import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, ShoppingCart, DollarSign,
  TrendingUp, AlertTriangle, Plus, LogOut, ArrowUpRight, Loader2, RefreshCw
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { adminAPI } from '../../services/api';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import UsersManager from './UsersManager';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'users', label: 'Users', icon: Users },
];

const StatCard = ({ label, value, icon: Icon, color = 'orange', sub, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        color === 'orange' ? 'bg-orange-500/10' :
        color === 'green' ? 'bg-emerald-500/10' :
        color === 'blue' ? 'bg-blue-500/10' : 'bg-purple-500/10'
      }`}>
        <Icon className={`w-5 h-5 ${
          color === 'orange' ? 'text-orange-400' :
          color === 'green' ? 'text-emerald-400' :
          color === 'blue' ? 'text-blue-400' : 'text-purple-400'
        }`} />
      </div>
      {sub && (
        <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" /> {sub}
        </span>
      )}
    </div>
    <p className="text-white font-black text-2xl">{value}</p>
    <p className="text-zinc-500 text-sm mt-1">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatPrice = (v) => {
    const num = parseFloat(v) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Admin Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Admin Panel</h1>
              <p className="text-zinc-500 text-xs">{user?.name || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-zinc-500 hover:text-orange-400 text-sm transition-colors">Home</Link>
          <span className="text-zinc-700">/</span>
          <button onClick={() => setActiveTab('overview')} className="text-zinc-500 hover:text-orange-400 text-sm transition-colors">Dashboard</button>
          {activeTab !== 'overview' && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-orange-400 text-sm font-bold capitalize">{activeTab}</span>
            </>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 mb-3">{error}</p>
                <button onClick={fetchStats} className="text-orange-400 hover:text-orange-300 text-sm font-bold flex items-center gap-1 mx-auto">
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            ) : stats && (
              <>
                {/* Stat Cards - clickable to navigate to respective tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Total Revenue" value={formatPrice(stats.overview.totalRevenue)} icon={DollarSign} color="green" sub={stats.overview.revenueGrowth + '%'} onClick={() => setActiveTab('orders')} />
                  <StatCard label="Products" value={stats.overview.totalProducts} icon={Package} color="orange" onClick={() => setActiveTab('products')} />
                  <StatCard label="Users" value={stats.overview.totalUsers} icon={Users} color="blue" onClick={() => setActiveTab('users')} />
                  <StatCard label="Orders" value={stats.overview.totalOrders} icon={ShoppingCart} color="purple" onClick={() => setActiveTab('orders')} />
                </div>

                {/* Today */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <h3 className="text-white font-bold text-sm">Today's Revenue</h3>
                    </div>
                    <p className="text-orange-400 font-black text-3xl">{formatPrice(stats.overview.todaysRevenue)}</p>
                    <p className="text-zinc-500 text-sm mt-1">{stats.overview.todaysOrders} orders today</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-orange-400" />
                      <h3 className="text-white font-bold text-sm">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                      <Link to="/admin/products/new" className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 text-sm transition-colors">
                        <Plus className="w-4 h-4" /> Add New Product
                      </Link>
                      <button onClick={() => setActiveTab('products')} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 text-sm transition-colors">
                        <Package className="w-4 h-4" /> Manage Products
                      </button>
                      <button onClick={() => setActiveTab('orders')} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 text-sm transition-colors">
                        <ShoppingCart className="w-4 h-4" /> Manage Orders
                      </button>
                      <button onClick={() => setActiveTab('users')} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 text-sm transition-colors">
                        <Users className="w-4 h-4" /> Manage Users
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-orange-400" />
                        Recent Orders
                      </h3>
                      <button onClick={() => setActiveTab('orders')} className="text-orange-400 hover:text-orange-300 text-xs font-bold">
                        View All →
                      </button>
                    </div>
                    {stats.recentOrders?.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentOrders.map((order, i) => (
                          <div key={order.id || i} className="flex items-center justify-between bg-zinc-800 rounded-xl p-3">
                            <div>
                              <p className="text-white text-sm font-bold">#{order.id}</p>
                              <p className="text-zinc-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-400 font-bold text-sm">{formatPrice(order.total_amount)}</p>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-zinc-700 text-zinc-400'
                              }`}>
                                {order.status || 'pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm text-center py-6">No orders yet</p>
                    )}
                  </div>

                  {/* Low Stock */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        Low Stock Products
                      </h3>
                      <button onClick={() => setActiveTab('products')} className="text-orange-400 hover:text-orange-300 text-xs font-bold">
                        View All →
                      </button>
                    </div>
                    {stats.lowStockProducts?.length > 0 ? (
                      <div className="space-y-3">
                        {stats.lowStockProducts.map((p, i) => (
                          <div key={p.id || i} className="flex items-center justify-between bg-zinc-800 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-zinc-700 rounded-lg flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-zinc-400" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-bold line-clamp-1">{p.name}</p>
                                <p className="text-zinc-500 text-xs">{formatPrice(p.price)}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              p.stock === 0 ? 'bg-red-500/10 text-red-400' :
                              p.stock < 5 ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-orange-500/10 text-orange-400'
                            }`}>
                              {p.stock} in stock
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm text-center py-6">All products well stocked</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'users' && <UsersManager />}
      </div>
    </div>
  );
};

export default Dashboard;
