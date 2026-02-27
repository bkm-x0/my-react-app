import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './pages/store/authStore';
import CyberNavbar from './components/CyberNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import AddProduct from './pages/Admin/AddProduct';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import NewArrivals from './pages/NewArrivals';
import Trending from './pages/Trending';
import Sale from './pages/Sale';
import PreOrder from './pages/PreOrder';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated } = useAuthStore();
  const isAdmin = useAuthStore((state) => state.isAdmin());
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  // Initialize authentication on app start
  React.useEffect(() => {
    const { initializeAuth } = useAuthStore.getState();
    initializeAuth();
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Home />
            </div>
          </>
        } />
        
        <Route path="/products" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Products />
            </div>
          </>
        } />
        
        <Route path="/categories" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Categories />
            </div>
          </>
        } />
        
        <Route path="/about" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <About />
            </div>
          </>
        } />
        
        <Route path="/contact" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Contact />
            </div>
          </>
        } />
        
        <Route path="/products/:id" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <ProductDetail />
            </div>
          </>
        } />
        
        <Route path="/cart" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Cart />
            </div>
          </>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Checkout />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/order-confirmation/:orderId" element={
          <ProtectedRoute>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <OrderConfirmation />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={
          <div className="min-h-screen bg-aliexpress-bgcolor">
            <Login />
          </div>
        } />
        
        <Route path="/register" element={
          <div className="min-h-screen bg-aliexpress-bgcolor">
            <Register />
          </div>
        } />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Profile />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <div className="min-h-screen bg-aliexpress-bgcolor">
            <AdminLogin />
          </div>
        } />

        <Route path="/support" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Support />
            </div>
          </>
        } />

        <Route path="/track-order" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <TrackOrder />
            </div>
          </>
        } />

        <Route path="/new-arrivals" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <NewArrivals />
            </div>
          </>
        } />

        <Route path="/trending" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Trending />
            </div>
          </>
        } />

        <Route path="/sale" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <Sale />
            </div>
          </>
        } />

        <Route path="/pre-order" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-aliexpress-bgcolor">
              <PreOrder />
            </div>
          </>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products/new" element={
          <ProtectedRoute adminOnly>
            <AddProduct />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute adminOnly>
            <AddProduct />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;