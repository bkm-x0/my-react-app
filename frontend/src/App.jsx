import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './pages/store/authStore';
import useLangStore from './pages/store/langStore';
import CyberNavbar from './components/CyberNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import AddProduct from './pages/Admin/AddProduct';
import AddSupplier from './pages/Admin/AddSupplier';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import NewArrivals from './pages/NewArrivals';
import Trending from './pages/Trending';
import Sale from './pages/Sale';
import PreOrder from './pages/PreOrder';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Suppliers from './pages/Suppliers';
import SupplierDetail from './pages/SupplierDetail';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, initialized } = useAuthStore();
  const isAdmin = useAuthStore((state) => state.isAdmin());

  // Wait until auth initialization is complete before redirecting
  if (!initialized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="text-zinc-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

// Layout with Navbar + Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooter = ['/login', '/register', '/checkout', '/admin'].some(p => location.pathname.startsWith(p));
  
  return (
    <>
      <CyberNavbar />
      <main id="main-content" className="min-h-screen bg-zinc-950">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  // Initialize authentication on app start
  React.useEffect(() => {
    const { initializeAuth } = useAuthStore.getState();
    initializeAuth();
    // Initialize language/dir on app start
    const { lang } = useLangStore.getState();
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);
  
  return (
    <Router>
      {/* Skip-to-content for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/categories" element={<Layout><Categories /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/track-order" element={<Layout><TrackOrder /></Layout>} />
        <Route path="/new-arrivals" element={<Layout><NewArrivals /></Layout>} />
        <Route path="/trending" element={<Layout><Trending /></Layout>} />
        <Route path="/sale" element={<Layout><Sale /></Layout>} />
        <Route path="/pre-order" element={<Layout><PreOrder /></Layout>} />
        <Route path="/suppliers" element={<Layout><Suppliers /></Layout>} />
        <Route path="/suppliers/:id" element={<Layout><SupplierDetail /></Layout>} />

        {/* Protected Routes with Layout */}
        <Route path="/checkout" element={
          <ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>
        } />
        <Route path="/order-confirmation/:orderId" element={
          <ProtectedRoute><Layout><OrderConfirmation /></Layout></ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute><Layout><OrderConfirmation /></Layout></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
        } />

        {/* Auth Routes (no navbar/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/products/new" element={
          <ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>
        } />
        <Route path="/admin/suppliers/new" element={
          <ProtectedRoute adminOnly><AddSupplier /></ProtectedRoute>
        } />
        <Route path="/admin/suppliers/edit/:id" element={
          <ProtectedRoute adminOnly><AddSupplier /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;