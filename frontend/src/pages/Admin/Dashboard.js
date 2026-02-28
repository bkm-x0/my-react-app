import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Package, CreditCard, TrendingUp, 
  AlertCircle, Settings, LogOut, Plus, Edit, Trash2,
  Search, Filter, Download, Eye, ShoppingCart, DollarSign,
  PieChart, Activity, Database, Server, Shield, Cpu,
  ChevronRight, Star, TrendingDown, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const API_BASE = `http://${window.location.hostname}:5000/api`;
const API_HOST = `http://${window.location.hostname}:5000`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    todaysRevenue: 0,
    todaysOrders: 0,
    revenueGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'DASHBOARD', icon: Activity },
    { id: 'products', label: 'PRODUCTS', icon: Package },
    { id: 'orders', label: 'ORDERS', icon: ShoppingCart },
    { id: 'users', label: 'USERS', icon: Users },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'inventory', label: 'INVENTORY', icon: Database },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/login');
    } else {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Fetch real orders
      const ordersResponse = await axios.get(`${API_BASE}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allOrders = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || [];
      
      // Fetch real products
      const productsResponse = await axios.get(`${API_BASE}/products`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const allProducts = Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.products || [];
      
      // Calculate stats
      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalProducts = allProducts.length;
      const lowStockProducts = allProducts.filter(p => p.stock < 10);
      
      setStats({
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        totalProducts: totalProducts,
        totalUsers: 1234,
        todaysRevenue: totalRevenue * 0.3, // Mock: 30% of total
        todaysOrders: Math.floor(totalOrders * 0.2), // Mock: 20% of total
        revenueGrowth: 15.7
      });
      
      // Recent orders - last 5
      setRecentOrders(allOrders.slice(0, 5).map(order => ({
        _id: order.id,
        orderNumber: `ORD-${order.id}`,
        user: { username: order.customer_name || 'User' },
        totalPrice: order.total_amount,
        orderStatus: order.status
      })));
      
      // Low stock products
      setLowStockProducts(lowStockProducts.map(p => ({
        _id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock
      })));
      
      // Top products
      setTopProducts(allProducts.slice(0, 5).map(p => ({
        _id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        rating: p.rating || 4.5
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use fallback mock data if API fails
      setStats({
        totalRevenue: 54231,
        totalOrders: 789,
        totalProducts: 456,
        totalUsers: 1234,
        todaysRevenue: 1245,
        todaysOrders: 23,
        revenueGrowth: 15.7
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderStatCard = (icon, label, value, change, color) => {
    const Icon = icon;
    return (
      <div className="cyber-card hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-cyber-neon-${color}/20 border border-cyber-neon-${color}`}>
            <Icon className={`h-6 w-6 text-cyber-neon-${color}`} />
          </div>
          <div className={`flex items-center text-sm font-orbitron ${change >= 0 ? 'text-cyber-muted-green' : 'text-cyber-muted-pink'}`}>
            {change >= 0 ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="text-3xl font-orbitron font-bold mb-2">{value}</div>
        <div className="text-gray-400">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-cyber-dark border-r border-cyber-muted-blue/30 z-50">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-muted-blue to-cyber-muted-pink rounded-lg flex items-center justify-center mr-3">
              <Server className="h-6 w-6 text-cyber-black" />
            </div>
            <div>
              <div className="font-orbitron font-bold text-lg">CYBER CONTROL</div>
              <div className="text-xs text-cyber-muted-green">ADMIN v2.1.4</div>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyber-muted-blue to-cyber-muted-purple text-cyber-black shadow-lg'
                      : 'text-gray-300 hover:bg-cyber-gray/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-orbitron font-bold">{tab.label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-cyber-gray/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-muted-green to-cyber-muted-purple rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyber-black" />
            </div>
            <div className="ml-3">
              <div className="font-orbitron font-bold">{user?.username || 'ADMIN'}</div>
              <div className="text-xs text-gray-400">System Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors rounded-lg font-orbitron"
          >
            <LogOut className="h-4 w-4 mr-2" />
            TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-cyber-gray/30 rounded-lg border border-cyber-muted-blue/20">
          <div>
            <h1 className="text-3xl font-orbitron font-bold mb-2">
              <span className="text-cyber-muted-blue">SYSTEM</span>
              <span className="text-cyber-muted-pink"> CONTROL PANEL</span>
            </h1>
            <div className="flex items-center text-gray-300">
              <Cpu className="h-4 w-4 mr-2 text-cyber-muted-green" />
              <span className="font-mono">Status: <span className="text-cyber-muted-green">ALL SYSTEMS NOMINAL</span></span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="QUERY DATABASE..."
                className="cyber-input pl-10 w-64"
              />
            </div>
            <button className="cyber-button flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              NEW ENTRY
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatCard(DollarSign, 'TOTAL REVENUE', `$${stats.totalRevenue.toLocaleString()}`, stats.revenueGrowth, 'green')}
          {renderStatCard(ShoppingCart, 'TOTAL ORDERS', stats.totalOrders, 12.5, 'blue')}
          {renderStatCard(Package, 'TOTAL PRODUCTS', stats.totalProducts, 8.3, 'pink')}
          {renderStatCard(Users, 'TOTAL USERS', stats.totalUsers, 15.7, 'purple')}
        </div>

        {/* Main Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Charts Row - Simplified without recharts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="cyber-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-orbitron font-bold text-cyber-muted-blue">
                    REVENUE TREND
                  </h2>
                  <select className="cyber-input text-sm w-40">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-24 w-24 text-cyber-muted-blue mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Chart visualization will appear here</p>
                    <p className="text-sm text-gray-500 mt-2">Install recharts for full functionality</p>
                  </div>
                </div>
              </div>

              {/* Sales by Category */}
              <div className="cyber-card">
                <h2 className="text-xl font-orbitron font-bold mb-6 text-cyber-muted-pink">
                  SALES BY CATEGORY
                </h2>
                <div className="space-y-4">
                  {salesData.map((category, index) => (
                    <div key={category._id} className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-orbitron font-bold">{String(category._id || '').toUpperCase()}</div>
                        <div className="text-cyber-muted-green font-bold">${category.totalRevenue.toLocaleString()}</div>
                      </div>
                      <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyber-muted-blue"
                          style={{ 
                            width: `${(category.totalRevenue / 30000) * 100}%`,
                            backgroundColor: ['#00ffff', '#ff00ff', '#00ff00', '#9d00ff'][index % 4]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="cyber-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-orbitron font-bold text-cyber-muted-blue">
                    RECENT ORDERS
                  </h2>
                  <Link to="/admin/orders" className="text-sm text-cyber-muted-purple hover:text-cyber-muted-pink">
                    VIEW ALL →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyber-gray/30">
                        <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">ORDER</th>
                        <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">CUSTOMER</th>
                        <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">AMOUNT</th>
                        <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="border-b border-cyber-gray/10 hover:bg-cyber-dark/50">
                          <td className="py-3 px-4 font-mono">{order.orderNumber}</td>
                          <td className="py-3 px-4">
                            {order.user?.username || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 font-orbitron font-bold text-cyber-muted-green">
                            ${order.totalPrice}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded ${
                              order.orderStatus === 'delivered' ? 'bg-cyber-muted-green/20 text-cyber-muted-green' :
                              order.orderStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.orderStatus === 'processing' ? 'bg-cyber-muted-taupe/20 text-cyber-muted-taupe' :
                              order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-cyber-muted-blue/20 text-cyber-muted-blue'
                            }`}>
                              {String(order.orderStatus || '').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Products */}
              <div className="cyber-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-orbitron font-bold text-cyber-muted-pink">
                    LOW STOCK ALERT
                  </h2>
                  <span className="px-3 py-1 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink text-sm font-orbitron rounded">
                    {lowStockProducts.length} ITEMS
                  </span>
                </div>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product._id} className="p-3 bg-cyber-dark border border-cyber-muted-pink/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-orbitron font-bold">{product.name}</div>
                          <div className="text-sm text-gray-400">{product.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-orbitron font-bold ${
                            product.stock < 5 ? 'text-cyber-muted-pink' : 'text-cyber-muted-taupe'
                          }`}>
                            {product.stock} LEFT
                          </div>
                          <div className="text-sm text-gray-400">Stock: {product.stock}</div>
                        </div>
                      </div>
                      <div className="mt-2 h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            product.stock < 5 ? 'bg-cyber-muted-pink' : 'bg-cyber-muted-taupe'
                          }`}
                          style={{ width: `${(product.stock / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="cyber-card">
              <h2 className="text-xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                TOP PERFORMING PRODUCTS
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topProducts.map((product) => (
                  <div key={product._id} className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg hover:border-cyber-muted-blue transition-colors">
                    <div className="h-32 bg-gradient-to-br from-cyber-muted-blue/20 to-cyber-muted-purple/20 rounded-lg mb-3"></div>
                    <h3 className="font-orbitron font-bold text-sm mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-muted-green font-bold">${product.price}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-cyber-muted-taupe fill-cyber-muted-taupe mr-1" />
                        <span className="text-sm">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">Stock: {product.stock}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductsManagement />
        )}

        {activeTab === 'orders' && (
          <OrdersManagement />
        )}

        {activeTab === 'users' && (
          <UsersManagement />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'inventory' && (
          <InventoryManagement />
        )}

        {activeTab === 'settings' && (
          <SystemSettings />
        )}
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'neural',
    stock: '',
    sku: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/products`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const productsData = Array.isArray(response.data) ? response.data : response.data.products || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      await handleEditProduct(e);
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please log in as admin.');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        sku: formData.sku
      };
      
      if (formData.image && formData.image.startsWith('data:')) {
        payload.image = formData.image;
      }

      const response = await axios.post(`${API_BASE}/products`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProducts([...products, response.data]);
      setFormData({ name: '', description: '', price: '', category: 'neural', stock: '', sku: '', image: null });
      setImagePreview(null);
      setShowAddForm(false);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Confirm deletion?')) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await axios.delete(`${API_BASE}/products/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category_name || product.category || 'neural',
      stock: product.stock,
      sku: product.sku,
      image: null
    });
    if (product.image) {
      setImagePreview(`${API_HOST}${product.image}`);
    }
    setShowAddForm(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please log in as admin.');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        sku: formData.sku
      };
      
      if (formData.image && formData.image.startsWith('data:')) {
        payload.image = formData.image;
      }

      const response = await axios.put(`${API_BASE}/products/${editingId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProducts(products.map(p => p.id === editingId ? response.data : p));
      handleCancelEdit();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', category: 'neural', stock: '', sku: '', image: null });
    setImagePreview(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">{editingId ? 'EDIT PRODUCT' : 'PRODUCTS MANAGEMENT'}</h2>
          {!editingId && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="cyber-button flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD PRODUCT
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg">
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
              {imagePreview && (
                <div className="col-span-2 flex justify-center">
                  <img src={imagePreview} alt="Preview" className="h-48 w-48 object-cover rounded-lg border border-cyber-muted-blue" />
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-sm font-orbitron text-gray-300 mb-2">UPLOAD IMAGE</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cyber-input col-span-2"
                />
              </div>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="cyber-input"
                required
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="cyber-input"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="cyber-input"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="cyber-input"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="cyber-input col-span-2"
              />
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="cyber-input"
              >
                <option value="neural">Neural Tech</option>
                <option value="cybernetic">Cybernetic Limbs</option>
                <option value="quantum">Quantum Hardware</option>
                <option value="holographic">Holographic Tech</option>
                <option value="software">Software</option>
                <option value="accessories">Accessories</option>
              </select>
              <div className="flex gap-2 col-span-2">
                <button type="submit" className="cyber-button flex-1">{editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</button>
                <button type="button" onClick={handleCancelEdit} className="cyber-button-outline flex-1">CANCEL</button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-muted-blue/30">
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">IMAGE</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">NAME</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">SKU</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">PRICE</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">STOCK</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">CATEGORY</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-cyber-gray/10 hover:bg-cyber-dark/50">
                    <td className="py-3 px-4">
                      {product.image ? (
                        <img src={`${API_HOST}${product.image}`} alt={product.name} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-cyber-gray/30 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                      )}
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 font-mono text-sm">{product.sku}</td>
                    <td className="py-3 px-4 text-cyber-muted-green font-bold">${product.price}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.stock > 10 ? 'bg-cyber-muted-green/20 text-cyber-muted-green' :
                        product.stock > 0 ? 'bg-cyber-muted-taupe/20 text-cyber-muted-taupe' :
                        'bg-cyber-muted-pink/20 text-cyber-muted-pink'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">{product.category_name || product.category}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="text-cyber-muted-purple hover:text-cyber-muted-pink mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-cyber-muted-pink hover:text-cyber-muted-purple"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                    {loading ? 'Loading products...' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Users Management Component
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/auth/users`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const usersData = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/users/${userId}`, {
        role: newRole
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(users.map(u => u.id === userId ? {...u, role: newRole} : u));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Confirm deletion?')) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await axios.delete(`${API_BASE}/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">USERS MANAGEMENT</h2>
          <div className="text-sm text-gray-400">Total: {users.length}</div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-muted-blue/30">
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">USERNAME</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">EMAIL</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">ROLE</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">STATUS</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">JOINED</th>
                <th className="text-left py-3 px-4 font-orbitron text-cyber-muted-blue">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-cyber-gray/10 hover:bg-cyber-dark/50">
                    <td className="py-3 px-4 font-orbitron">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {editingId === user.id ? (
                        <select 
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="cyber-input text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-sm font-orbitron ${
                          user.role === 'admin' ? 'bg-cyber-muted-pink/20 text-cyber-muted-pink' :
                          'bg-cyber-muted-green/20 text-cyber-muted-green'
                        }`}>
                          {String(user.role || '').toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.is_active ? 'bg-cyber-muted-green/20 text-cyber-muted-green' :
                        'bg-cyber-muted-pink/20 text-cyber-muted-pink'
                      }`}>
                        {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === user.id ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleChangeRole(user.id, editRole)}
                            className="text-cyber-muted-green hover:text-cyber-muted-purple text-sm"
                          >
                            SAVE
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-300 text-sm"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setEditingId(user.id);
                              setEditRole(user.role);
                            }}
                            className="text-cyber-muted-purple hover:text-cyber-muted-pink"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-cyber-muted-pink hover:text-cyber-muted-purple"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-4 text-center text-gray-400">
                    {loading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    totalUsers: 0,
    ordersDailyData: []
  });
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    // Mock analytics data
    setAnalytics({
      totalRevenue: 125450,
      totalOrders: 356,
      averageOrderValue: 352.41,
      totalProducts: 127,
      totalUsers: 892,
      ordersDailyData: [
        { date: 'Mon', orders: 12, revenue: 4200 },
        { date: 'Tue', orders: 15, revenue: 5100 },
        { date: 'Wed', orders: 18, revenue: 6200 },
        { date: 'Thu', orders: 22, revenue: 7500 },
        { date: 'Fri', orders: 28, revenue: 9200 },
        { date: 'Sat', orders: 35, revenue: 11800 },
        { date: 'Sun', orders: 25, revenue: 8500 }
      ]
    });
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">ANALYTICS DASHBOARD</h2>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="cyber-input text-sm py-2 px-3"
          >
            <option value="24hours">LAST 24 HOURS</option>
            <option value="7days">LAST 7 DAYS</option>
            <option value="30days">LAST 30 DAYS</option>
          </select>
        </div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-cyber-dark border border-cyber-muted-green/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-orbitron">REVENUE</p>
            <p className="text-2xl font-orbitron font-bold text-cyber-muted-green">${analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-2">↑ 12.5% from last period</p>
          </div>
          
          <div className="p-4 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-orbitron">ORDERS</p>
            <p className="text-2xl font-orbitron font-bold text-cyber-muted-blue">{analytics.totalOrders}</p>
            <p className="text-xs text-blue-400 mt-2">↑ 8.3% from last period</p>
          </div>
          
          <div className="p-4 bg-cyber-dark border border-cyber-muted-taupe/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-orbitron">AVG ORDER VALUE</p>
            <p className="text-2xl font-orbitron font-bold text-cyber-muted-taupe">${analytics.averageOrderValue.toFixed(2)}</p>
            <p className="text-xs text-yellow-400 mt-2">↑ 3.1% from last period</p>
          </div>
          
          <div className="p-4 bg-cyber-dark border border-cyber-muted-purple/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-orbitron">PRODUCTS</p>
            <p className="text-2xl font-orbitron font-bold text-cyber-muted-purple">{analytics.totalProducts}</p>
            <p className="text-xs text-purple-400 mt-2">→ No change</p>
          </div>
          
          <div className="p-4 bg-cyber-dark border border-cyber-muted-pink/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-orbitron">CUSTOMERS</p>
            <p className="text-2xl font-orbitron font-bold text-cyber-muted-pink">{analytics.totalUsers}</p>
            <p className="text-xs text-pink-400 mt-2">↑ 5.2% from last period</p>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
          <h3 className="font-orbitron font-bold mb-4">DAILY ORDERS & REVENUE</h3>
          <div className="space-y-4">
            {analytics.ordersDailyData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-orbitron">{data.date}</span>
                  <span className="text-sm">
                    <span className="text-cyber-muted-blue mr-4">{data.orders} Orders</span>
                    <span className="text-cyber-muted-green">${data.revenue.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-cyber-muted-blue/20 rounded" style={{width: `${(data.orders / 40) * 100}%`}}></div>
                  <div className="flex-1 h-8 bg-cyber-muted-green/20 rounded" style={{width: `${(data.revenue / 12000) * 100}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/products`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const productsData = Array.isArray(response.data) ? response.data : response.data.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-cyber-dark border border-cyber-muted-green/30 rounded-lg">
          <p className="text-xs text-gray-400 mb-1 font-orbitron">TOTAL PRODUCTS</p>
          <p className="text-2xl font-orbitron font-bold text-cyber-muted-green">{products.length}</p>
        </div>
        <div className="p-4 bg-cyber-dark border border-cyber-muted-taupe/30 rounded-lg">
          <p className="text-xs text-gray-400 mb-1 font-orbitron">LOW STOCK</p>
          <p className="text-2xl font-orbitron font-bold text-cyber-muted-taupe">{lowStockProducts.length}</p>
        </div>
        <div className="p-4 bg-cyber-dark border border-cyber-muted-pink/30 rounded-lg">
          <p className="text-xs text-gray-400 mb-1 font-orbitron">OUT OF STOCK</p>
          <p className="text-2xl font-orbitron font-bold text-cyber-muted-pink">{outOfStockProducts.length}</p>
        </div>
      </div>

      <div className="cyber-card">
        <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue mb-6">INVENTORY LEVELS</h2>
        
        <div className="mb-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="cyber-input"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="neural">Neural Tech</option>
            <option value="cybernetic">Cybernetic</option>
            <option value="quantum">Quantum</option>
          </select>
        </div>

        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className={`p-4 border rounded-lg ${
              product.stock === 0 ? 'border-cyber-muted-pink/50 bg-cyber-muted-pink/5' :
              product.stock < 10 ? 'border-cyber-muted-taupe/50 bg-cyber-muted-taupe/5' :
              'border-cyber-gray/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-orbitron font-bold">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sku}</p>
                </div>
                <p className={`font-orbitron font-bold ${
                  product.stock === 0 ? 'text-cyber-muted-pink' :
                  product.stock < 10 ? 'text-cyber-muted-taupe' :
                  'text-cyber-muted-green'
                }`}>
                  {product.stock} UNITS
                </p>
              </div>
              <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    product.stock === 0 ? 'bg-cyber-muted-pink' :
                    product.stock < 10 ? 'bg-cyber-muted-taupe' :
                    'bg-cyber-muted-green'
                  }`}
                  style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Orders Management Component
const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, selectedStatus, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchTerm) ||
        order.order_id?.toString().includes(searchTerm) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/confirm`, 
        { adminNotes: adminNotes },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      ));
      setConfirmingOrderId(null);
      setAdminNotes('');
      alert('✅ Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert(error.response?.data?.message || 'Failed to confirm order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/reject`, 
        { reason: rejectReason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      setRejectingOrderId(null);
      setRejectReason('');
      alert('❌ Order rejected and cancelled');
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert(error.response?.data?.message || 'Failed to reject order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusColors = {
    pending: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    confirmed: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    processing: 'border-blue-500 bg-blue-500/10 text-blue-400',
    shipped: 'border-purple-500 bg-purple-500/10 text-purple-400',
    delivered: 'border-green-500 bg-green-500/10 text-green-400',
    cancelled: 'border-red-500 bg-red-500/10 text-red-400'
  };

  if (loading) {
    return (
      <div className="cyber-card">
        <p className="text-center text-gray-400 font-orbitron">LOADING ORDERS...</p>
      </div>
    );
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue flex items-center">
          <ShoppingCart className="h-6 w-6 mr-3" />
          ORDERS MANAGEMENT
        </h2>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-cyber-muted-blue text-cyber-black font-orbitron font-bold rounded hover:bg-cyber-muted-blue/80 transition-colors"
        >
          REFRESH
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search by Order ID or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="cyber-input"
        >
          <option value="all">ALL STATUS</option>
          <option value="pending">⏳ PENDING (Awaiting Confirmation)</option>
          <option value="confirmed">✅ CONFIRMED</option>
          <option value="processing">🔄 PROCESSING</option>
          <option value="shipped">📦 SHIPPED</option>
          <option value="delivered">✔️ DELIVERED</option>
          <option value="cancelled">❌ CANCELLED</option>
        </select>
        <div className="text-right text-gray-400 text-sm font-orbitron">
          Total Orders: <span className="text-cyber-muted-green font-bold">{filteredOrders.length}</span>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-4 text-cyber-gray" />
          <p className="font-orbitron">NO ORDERS FOUND</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">ORDER ID</p>
                  <p className="font-orbitron font-bold text-cyber-muted-blue">{order.order_id || order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">CUSTOMER</p>
                  <p className="font-orbitron">{order.customer_name || order.user?.username || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">TOTAL AMOUNT</p>
                  <p className="font-orbitron font-bold text-cyber-muted-green">{order.total_amount?.toLocaleString()}₡</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">PAYMENT METHOD</p>
                  <p className="font-mono text-sm">
                    {order.payment_method === 'cod' ? '💵 COD' : '💳 ' + (order.payment_method || 'Unknown')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">STATUS</p>
                  <p className={`px-2 py-1 rounded font-orbitron text-xs font-bold border ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status?.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="text-xs text-gray-400 mb-4 p-3 bg-cyber-black/50 rounded">
                📍 <span className="font-mono">{order.shipping_address || 'No address'}</span>
              </div>

              {/* Order Items */}
              <div className="mb-4 text-sm">
                <p className="text-xs text-gray-400 mb-2">ITEMS:</p>
                <div className="space-y-1 ml-4">
                  {order.items && order.items.map((item, idx) => (
                    <p key={idx} className="text-gray-300">
                      • {item.product_name || 'Product'} x{item.quantity} = {(item.price * item.quantity).toLocaleString()}₡
                    </p>
                  ))}
                </div>
              </div>

              {/* Confirm/Reject for pending orders */}
              {order.status === 'pending' && (
                <div className="mb-4 p-4 border-2 border-yellow-500/50 bg-yellow-500/5 rounded-lg">
                  <p className="text-yellow-400 font-orbitron text-sm font-bold mb-3">⏳ AWAITING ADMIN CONFIRMATION</p>
                  
                  {confirmingOrderId === order.id ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Admin notes (optional)..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="cyber-input w-full text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          disabled={updatingOrderId === order.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron text-xs font-bold rounded transition-colors disabled:opacity-50"
                        >
                          {updatingOrderId === order.id ? 'CONFIRMING...' : '✅ CONFIRM ORDER'}
                        </button>
                        <button
                          onClick={() => { setConfirmingOrderId(null); setAdminNotes(''); }}
                          className="px-4 py-2 bg-cyber-gray/30 text-gray-300 font-orbitron text-xs font-bold rounded hover:bg-cyber-gray/50"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : rejectingOrderId === order.id ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Reason for rejection (optional)..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="cyber-input w-full text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          disabled={updatingOrderId === order.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-orbitron text-xs font-bold rounded transition-colors disabled:opacity-50"
                        >
                          {updatingOrderId === order.id ? 'REJECTING...' : '❌ CONFIRM REJECTION'}
                        </button>
                        <button
                          onClick={() => { setRejectingOrderId(null); setRejectReason(''); }}
                          className="px-4 py-2 bg-cyber-gray/30 text-gray-300 font-orbitron text-xs font-bold rounded hover:bg-cyber-gray/50"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setConfirmingOrderId(order.id)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron text-sm font-bold rounded transition-colors shadow-lg shadow-emerald-600/30"
                      >
                        ✅ CONFIRM
                      </button>
                      <button
                        onClick={() => setRejectingOrderId(order.id)}
                        className="px-6 py-2 bg-red-600/80 hover:bg-red-500 text-white font-orbitron text-sm font-bold rounded transition-colors shadow-lg shadow-red-600/30"
                      >
                        ❌ REJECT
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status Update for confirmed+ orders */}
              {order.status !== 'pending' && order.status !== 'cancelled' && (
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'processing', 'shipped', 'delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(order.id, status)}
                    disabled={updatingOrderId === order.id || order.status === status}
                    className={`px-3 py-1 rounded font-orbitron text-xs font-bold transition-colors ${
                      order.status === status
                        ? 'bg-cyber-muted-green text-cyber-black'
                        : 'bg-cyber-gray/30 text-gray-300 hover:bg-cyber-gray/50 disabled:opacity-50'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SystemSettings = () => (
  <div className="cyber-card">
    <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue mb-6">SYSTEM SETTINGS</h2>
    
    <div className="space-y-6">
      <div className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
        <h3 className="font-orbitron font-bold mb-3">STORE INFORMATION</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">STORE NAME</label>
            <input type="text" value="CYBERSTORE" className="cyber-input" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">DESCRIPTION</label>
            <textarea className="cyber-input" defaultValue="Next-gen cybernetic upgrades and quantum tech"></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
        <h3 className="font-orbitron font-bold mb-3">EMAIL SETTINGS</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">SMTP SERVER</label>
            <input type="text" placeholder="smtp.gmail.com" className="cyber-input" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">EMAIL ADDRESS</label>
            <input type="email" placeholder="noreply@cyberstore.com" className="cyber-input" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
        <h3 className="font-orbitron font-bold mb-3">PAYMENT METHODS</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-3" />
            <span className="text-sm">Credit Card</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-3" />
            <span className="text-sm">Cryptocurrency</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm">PayPal</span>
          </label>
        </div>
      </div>

      <button className="cyber-button w-full">SAVE SETTINGS</button>
    </div>
  </div>
);


export default AdminDashboard;
