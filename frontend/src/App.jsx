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