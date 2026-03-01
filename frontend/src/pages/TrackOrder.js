import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, MapPin, Clock, DollarSign, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from './store/authStore';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const TrackOrder = () => {
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const { t } = useLangStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError(t('trackOrder.errorEmpty'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderId = searchTerm.replace(/\D/g, '');
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(t('trackOrder.errorNotFound'));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMyOrders = async () => {
    if (!token) {
      setError(t('trackOrder.loginRequired'));
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/orders/myorders');
      setMyOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
      setShowMyOrders(true);
    } catch (err) {
      setError(t('trackOrder.failedLoad'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStage = (status) => {
    const stages = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };
    return stages[status] || 0;
  };

  const statusColors = {
    pending: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    confirmed: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    processing: 'border-blue-500 bg-blue-500/10 text-blue-400',
    shipped: 'border-purple-500 bg-purple-500/10 text-purple-400',
    delivered: 'border-green-500 bg-green-500/10 text-green-400',
    cancelled: 'border-red-500 bg-red-500/10 text-red-400'
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              {t('trackOrder.title')} <span className="text-orange-400">{t('trackOrder.titleHighlight')}</span>
            </h1>
            <p className="text-zinc-400">{t('trackOrder.subtitle')}</p>
          </motion.div>

          {/* Search */}
          <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <form onSubmit={handleSearch}>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder={t('trackOrder.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-12 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl px-8 transition-colors">
                  {t('trackOrder.search')}
                </button>
              </div>
            </form>
            {error && (
              <div className="mt-4 p-4 border border-red-500/30 bg-red-500/10 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          {!showMyOrders && (
            <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-center" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              {token ? (
                <button onClick={handleLoadMyOrders} className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl px-8 py-3 transition-colors">
                  {t('trackOrder.loadMyOrders')}
                </button>
              ) : (
                <p className="text-zinc-400">
                  <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors">Log in</Link>
                  {' ' + t('trackOrder.loginPrompt')}
                </p>
              )}
            </motion.div>
          )}

          {/* My Orders List */}
          {showMyOrders && myOrders.length > 0 && (
            <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8" initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="text-xl font-bold mb-6 text-white">{t('trackOrder.yourOrders')}</h2>
              <div className="space-y-3">
                {myOrders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => { setOrder(o); setShowMyOrders(false); }}
                    className="w-full p-4 border border-zinc-800 hover:border-orange-500/50 transition-colors rounded-xl text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Order #ORD-{o.id}</p>
                        <p className="text-sm text-zinc-500">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">${(o.total_amount || 0).toLocaleString()}</p>
                        <p className={`text-xs font-semibold ${
                          o.status === 'delivered' ? 'text-emerald-400' :
                          o.status === 'shipped' ? 'text-purple-400' :
                          o.status === 'confirmed' ? 'text-emerald-400' :
                          o.status === 'processing' ? 'text-blue-400' :
                          o.status === 'cancelled' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {String(o.status || 'pending').toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Order Details */}
          {order && (
            <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeUp}>
              {/* Order Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">{t('trackOrder.orderNumber')}</p>
                    <p className="text-3xl font-bold text-white">#ORD-{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">{t('trackOrder.orderStatus')}</p>
                    <p className={`text-sm font-bold px-3 py-2 rounded-xl w-fit border ${statusColors[order.status || 'pending']}`}>
                      {String(order.status || 'pending').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-white">{t('trackOrder.shipmentTimeline')}</h2>
                <div className="space-y-0">
                  {[
                    { stage: 'pending', label: t('trackOrder.orderPlaced'), icon: Check },
                    { stage: 'confirmed', label: t('trackOrder.adminConfirmed'), icon: Check },
                    { stage: 'processing', label: t('trackOrder.processing'), icon: Package },
                    { stage: 'shipped', label: t('trackOrder.shipped'), icon: Truck },
                    { stage: 'delivered', label: t('trackOrder.delivered'), icon: MapPin }
                  ].map((item, index) => {
                    const currentStage = getStatusStage(order.status || 'pending');
                    const isCompleted = getStatusStage(item.stage) <= currentStage;
                    const isCurrent = item.stage === (order.status || 'pending');
                    const Icon = item.icon;
                    return (
                      <div key={item.stage}>
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
                            isCompleted ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${
                              isCurrent ? 'text-orange-400 text-lg' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                            }`}>
                              {item.label}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {isCurrent ? t('trackOrder.inProgress') : isCompleted ? t('trackOrder.completed') : t('trackOrder.pending')}
                            </p>
                          </div>
                        </div>
                        {index < 4 && <div className="ml-5 h-8 border-l-2 border-zinc-800" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-orange-400" />
                    {t('trackOrder.orderDetails')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{t('trackOrder.orderDate')}</span>
                      <span className="text-zinc-300 font-mono">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{t('trackOrder.paymentMethod')}</span>
                      <span className="text-zinc-300 capitalize">{order.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{t('trackOrder.itemsOrdered')}</span>
                      <span className="text-zinc-300">{order.items?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                    <DollarSign className="h-5 w-5 mr-2 text-orange-400" />
                    {t('trackOrder.totalAmount')}
                  </h3>
                  <div className="text-4xl font-bold text-orange-400">
                    ${(order.total_amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                  <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                  {t('trackOrder.shippingAddress')}
                </h3>
                <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                  <p className="text-zinc-300 whitespace-pre-line text-sm">{order.shipping_address || t('trackOrder.addressNA')}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 text-white">{t('trackOrder.orderItems')}</h3>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                        <div>
                          <p className="font-semibold text-white">{item.product_name || 'Product'}</p>
                          <p className="text-sm text-zinc-500">{`${t('trackOrder.qty')}:`} {item.quantity}</p>
                        </div>
                        <p className="font-bold text-orange-400">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">{t('trackOrder.noItems')}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Estimated Delivery */}
          {order && (
            <motion.div className="bg-zinc-900 border border-emerald-500/20 rounded-2xl p-5 mt-6" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-emerald-400 mb-1">{t('trackOrder.estimatedDelivery')}</p>
                  <p className="text-zinc-400">
                    {t('trackOrder.estimatedDeliveryDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

