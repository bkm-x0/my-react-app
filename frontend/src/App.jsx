import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './pages/store/authStore';
import CyberNavbar from './components/CyberNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
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
            <div className="min-h-screen bg-cyber-black scanlines">
              <Home />
            </div>
          </>
        } />
        
        <Route path="/products" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Products />
            </div>
          </>
        } />
        
        <Route path="/products/:id" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <ProductDetail />
            </div>
          </>
        } />
        
        <Route path="/cart" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Cart />
            </div>
          </>
        } />
        
        <Route path="/login" element={
          <div className="min-h-screen bg-cyber-black scanlines">
            <Login />
          </div>
        } />
        
        <Route path="/register" element={
          <div className="min-h-screen bg-cyber-black scanlines">
            <Register />
          </div>
        } />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Profile />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <div className="min-h-screen bg-cyber-black scanlines">
            <AdminLogin />
          </div>
        } />

        <Route path="/support" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Support />
            </div>
          </>
        } />

        <Route path="/track-order" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <TrackOrder />
            </div>
          </>
        } />

        <Route path="/new-arrivals" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <NewArrivals />
            </div>
          </>
        } />

        <Route path="/trending" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Trending />
            </div>
          </>
        } />

        <Route path="/sale" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
              <Sale />
            </div>
          </>
        } />

        <Route path="/pre-order" element={
          <>
            <CyberNavbar />
            <div className="min-h-screen bg-cyber-black scanlines">
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