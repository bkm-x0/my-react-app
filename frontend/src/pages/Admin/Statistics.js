import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart,
  Loader2, AlertTriangle, RefreshCw, Calendar, Eye
} from 'lucide-react';
import { adminAPI, orderAPI, productAPI } from '../../services/api';
import useLangStore from '../store/langStore';

const COLORS = ['#f97316', '#10b981', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b'];

const StatBox = ({ label, value, icon: Icon, trend, color = 'orange', subtext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
  >
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${
          trend > 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-white font-bold text-xl mt-3">{value}</p>
    <p className="text-zinc-500 text-xs mt-1">{label}</p>
    {subtext && <p className="text-zinc-600 text-xs mt-1">{subtext}</p>}
  </motion.div>
);

const ChartCard = ({ title, children, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-orange-400" />
      <h3 className="text-white font-bold">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLangStore();

  const fetchAllStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardRes, salesRes, inventoryRes, ordersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        fetchSalesData(),
        fetchInventoryData(),
        orderAPI.getOrders({ limit: 100 })
      ]);

      setStats(dashboardRes.data);
      setSalesData(salesRes || []);
      setInventoryData(inventoryRes || null);

      // Calculate top products from orders
      const topProds = calculateTopProducts(ordersRes.data.orders || []);
      setTopProducts(topProds);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`}/stats/sales`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch sales data');
      return await response.json();
    } catch (err) {
      console.error('Error fetching sales:', err);
      return [];
    }
  };

  const fetchInventoryData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`}/stats/inventory`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch inventory data');
      return await response.json();
    } catch (err) {
      console.error('Error fetching inventory:', err);
      return null;
    }
  };

  const calculateTopProducts = (orders) => {
    const productMap = {};

    orders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        const key = item.product_id || item.name;
        if (!productMap[key]) {
          productMap[key] = {
            id: item.product_id,
            name: item.name || 'Unknown Product',
            quantity: 0,
            revenue: 0
          };
        }
        productMap[key].quantity += item.quantity || 1;
        productMap[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getInventoryChartData = () => {
    if (!inventoryData?.summary) return [];
    const { totalProducts, lowStockCount, outOfStockCount } = inventoryData.summary;
    const inStock = totalProducts - lowStockCount - outOfStockCount;

    return [
      { name: 'In Stock', value: inStock, fill: '#10b981' },
      { name: 'Low Stock', value: lowStockCount, fill: '#f59e0b' },
      { name: 'Out of Stock', value: outOfStockCount, fill: '#ef4444' }
    ];
  };

  const getOrderStatusData = () => {
    if (!stats?.recentOrders) return [];

    const statusMap = {};
    stats.recentOrders.forEach(order => {
      const status = order.status || 'pending';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      fill: COLORS[Object.keys(statusMap).indexOf(status)]
    }));
  };

  const formatPrice = (v) => {
    const num = parseFloat(v) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={fetchAllStats}
          className="text-orange-400 hover:text-orange-300 text-sm font-bold flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> {t('admin.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-2xl">{t('admin.statisticsAnalytics')}</h2>
        <button
          onClick={fetchAllStats}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-bold rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> {t('admin.refresh')}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label={t('admin.totalRevenue')}
          value={formatPrice(stats?.overview?.totalRevenue)}
          icon={DollarSign}
          color="green"
          trend={5.2}
          subtext={t('admin.allTime')}
        />
        <StatBox
          label={t('admin.totalOrders')}
          value={stats?.overview?.totalOrders}
          icon={ShoppingCart}
          color="purple"
          trend={12.5}
          subtext={`${stats?.overview?.todaysOrders} ${t('admin.today')}`}
        />
        <StatBox
          label={t('admin.activeProducts')}
          value={stats?.overview?.totalProducts}
          icon={Package}
          color="orange"
          trend={-2.1}
          subtext={`${stats?.lowStockProducts?.length || 0} ${t('admin.lowStock')}`}
        />
        <StatBox
          label={t('admin.activeUsers')}
          value={stats?.overview?.totalUsers}
          icon={Users}
          color="blue"
          trend={8.3}
          subtext={t('admin.registered')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        {salesData.length > 0 && (
          <ChartCard title={t('admin.salesTrend')} icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '12px' }} />
                <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                <Area type="monotone" dataKey="totalRevenue" stroke="#f97316" fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Orders by Date */}
        {salesData.length > 0 && (
          <ChartCard title={t('admin.ordersByDate')} icon={ShoppingCart}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '12px' }} />
                <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                <Bar dataKey="totalOrders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Inventory Status */}
        {inventoryData?.summary && (
          <ChartCard title={t('admin.inventoryStatus')} icon={Package}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getInventoryChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getInventoryChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Order Status Distribution */}
        {getOrderStatusData().length > 0 && (
          <ChartCard title={t('admin.orderStatusDistribution')} icon={Eye}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getOrderStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getOrderStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Top Products */}
      <ChartCard title={t('admin.topProductsByRevenue')} icon={Package}>
        <div className="space-y-3">
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-zinc-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center text-orange-400 font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold line-clamp-1">{product.name}</p>
                    <p className="text-zinc-500 text-xs">{product.quantity} {t('admin.unitsSOld')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-bold text-sm">{formatPrice(product.revenue)}</p>
                  <div className="w-24 h-1.5 bg-zinc-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${(product.revenue / (topProducts[0]?.revenue || 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm text-center py-6">{t('admin.noProductData')}</p>
          )}
        </div>
      </ChartCard>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ChartCard title={t('admin.inventoryValue')} icon={Package}>
          <p className="text-orange-400 font-black text-2xl">
            {formatPrice(inventoryData?.summary?.totalValue || 0)}
          </p>
          <p className="text-zinc-500 text-xs mt-2">
            {inventoryData?.summary?.totalStock || 0} {t('admin.inStock')}
          </p>
        </ChartCard>

        <ChartCard title={t('admin.averageOrderValue')} icon={DollarSign}>
          <p className="text-green-400 font-black text-2xl">
            {formatPrice((parseFloat(stats?.overview?.totalRevenue || 0) / (stats?.overview?.totalOrders || 1)).toFixed(2))}
          </p>
          <p className="text-zinc-500 text-xs mt-2">
            {t('admin.basedOn')} {stats?.overview?.totalOrders || 0} {t('admin.total')}
          </p>
        </ChartCard>

        <ChartCard title={t('admin.todaysPerformance')} icon={TrendingUp}>
          <p className="text-blue-400 font-black text-2xl">
            {formatPrice(stats?.overview?.todaysRevenue || 0)}
          </p>
          <p className="text-zinc-500 text-xs mt-2">
            {stats?.overview?.todaysOrders || 0} {t('admin.ordersToday')}
          </p>
        </ChartCard>
      </div>
    </div>
  );
};

export default Statistics;
