import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, MapPin, Package, Clock, Home, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from './store/authStore';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const { t } = useLangStore();

  useEffect(() => {
    if (!order) {
      fetchOrder();
    }
  }, [orderId, order]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(t('orderConfirmation.failedLoad'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setInvoiceLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(t('orderConfirmation.failedDownload'));
      console.error(err);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await api.post(`/orders/${orderId}/send-invoice`);
      alert(t('orderConfirmation.invoiceSent'));
    } catch (err) {
      setError(t('orderConfirmation.failedSend'));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="h-12 w-12 text-orange-400 mx-auto" />
          </div>
          <p className="text-zinc-400 font-semibold">{t('orderConfirmation.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <Link to="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl px-6 py-3 transition-colors">
            {t('orderConfirmation.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  const shippingInfo = location.state?.shippingInfo || {};
  const statusColors = {
    pending: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    confirmed: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    processing: 'border-blue-500 bg-blue-500/10 text-blue-400',
    shipped: 'border-purple-500 bg-purple-500/10 text-purple-400',
    delivered: 'border-green-500 bg-green-500/10 text-green-400',
    cancelled: 'border-red-500 bg-red-500/10 text-red-400'
  };

  const orderStatus = order?.status || 'pending';
  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const statusLabels = {
    pending: t('orderConfirmation.statusPending'),
    confirmed: t('orderConfirmation.statusConfirmed'),
    processing: t('orderConfirmation.statusProcessing'),
    shipped: t('orderConfirmation.statusShipped'),
    delivered: t('orderConfirmation.statusDelivered')
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 mb-6">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              {t('orderConfirmation.title')} <span className="text-orange-400">{t('orderConfirmation.titleHighlight')}</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-4">
              {t('orderConfirmation.thankYou')}
            </p>
            <p className="text-zinc-500 text-sm font-mono">
              {t('orderConfirmation.orderId')}: <span className="text-orange-400 font-bold">{orderId}</span>
            </p>
          </motion.div>

          {error && (
            <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Main Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <h2 className="text-xl font-bold mb-6 text-white">{t('orderConfirmation.orderStatus')}</h2>
                <div className="flex items-center justify-between mb-8">
                  {statusSteps.map((status, index) => (
                    <React.Fragment key={status}>
                      <div className="text-center flex-1">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-sm ${
                          statusSteps.indexOf(orderStatus) >= index
                            ? 'bg-orange-500 text-black'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="text-xs text-zinc-500 uppercase">{statusLabels[status]}</p>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`flex-1 h-1 mx-1 rounded ${
                          statusSteps.indexOf(orderStatus) > index ? 'bg-orange-500' : 'bg-zinc-800'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className={`p-4 border rounded-xl ${statusColors[orderStatus]}`}>
                  <p className="font-bold uppercase text-sm">{t('orderConfirmation.currentStatus')}: {orderStatus}</p>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <h2 className="text-xl font-bold mb-6 flex items-center text-white">
                  <Package className="h-5 w-5 mr-3 text-orange-400" />
                  {t('orderConfirmation.orderItems')}
                </h2>
                <div className="space-y-3">
                  {order?.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.product_name || 'Product'}</p>
                        <p className="text-sm text-zinc-500 mt-1">{t('orderConfirmation.sku')}: {item.product_sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-400 text-sm">{t('orderConfirmation.qty')}: {item.quantity}</p>
                        <p className="font-bold text-orange-400">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Invoice Actions */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <h2 className="text-xl font-bold mb-6 flex items-center text-white">
                  <FileText className="h-5 w-5 mr-3 text-orange-400" />
                  {t('orderConfirmation.invoiceDocs')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={invoiceLoading}
                    className="flex items-center justify-center p-4 border border-zinc-700 hover:border-orange-500 text-white transition-colors rounded-xl font-semibold text-sm disabled:opacity-50"
                  >
                    <Download className="h-5 w-5 mr-2 text-orange-400" />
                    {invoiceLoading ? t('orderConfirmation.downloading') : t('orderConfirmation.downloadInvoice')}
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="flex items-center justify-center p-4 border border-zinc-700 hover:border-orange-500 text-white transition-colors rounded-xl font-semibold text-sm"
                  >
                    <Mail className="h-5 w-5 mr-2 text-orange-400" />
                    {t('orderConfirmation.emailInvoice')}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <h2 className="text-lg font-bold mb-4 text-white">{t('orderConfirmation.orderSummary')}</h2>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{t('orderConfirmation.subtotal')}</span>
                    <span className="text-white">${(order?.total_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-3">
                    <span className="font-bold text-white">{t('orderConfirmation.total')}</span>
                    <span className="text-orange-400 font-bold">${(order?.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Info */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <h2 className="text-lg font-bold mb-4 flex items-center text-white">
                  <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                  {t('orderConfirmation.shippingTo')}
                </h2>
                <div className="text-sm space-y-2 text-zinc-400">
                  <p className="font-semibold text-white">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <p className="text-zinc-500">{shippingInfo.email}</p>
                  <p className="text-zinc-500">{shippingInfo.phone}</p>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <h2 className="text-lg font-bold mb-4 flex items-center text-white">
                  {'💳 ' + t('orderConfirmation.paymentMethod')}
                </h2>
                <div className={`p-4 rounded-xl text-sm font-bold ${
                  shippingInfo.paymentMethod === 'cod'
                    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                    : 'bg-zinc-800 border border-zinc-700 text-white'
                }`}>
                  {shippingInfo.paymentMethod === 'credit_card' && t('orderConfirmation.creditCard')}
                  {shippingInfo.paymentMethod === 'crypto' && t('orderConfirmation.crypto')}
                  {shippingInfo.paymentMethod === 'cod' && t('orderConfirmation.cod')}
                </div>
                {shippingInfo.paymentMethod === 'cod' && (
                  <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-sm text-zinc-400">
                    {'💵 ' + t('orderConfirmation.codNote')}
                  </div>
                )}
              </motion.div>

              {/* Timeline */}
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <h2 className="text-lg font-bold mb-4 flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-orange-400" />
                  {t('orderConfirmation.timeline')}
                </h2>
                <div className="text-sm space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-400 font-medium">{t('orderConfirmation.orderConfirmed')}</p>
                      <p className="text-xs text-zinc-500">{t('orderConfirmation.justNow')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-500">{t('orderConfirmation.processing')}</p>
                      <p className="text-xs text-zinc-600">{t('orderConfirmation.inProgress')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-500">{t('orderConfirmation.shipped')}</p>
                      <p className="text-xs text-zinc-600">{t('orderConfirmation.tba')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-500">{t('orderConfirmation.delivered')}</p>
                      <p className="text-xs text-zinc-600">{t('orderConfirmation.tba')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Next Steps */}
          <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <Home className="h-5 w-5 mr-3 text-orange-400" />
              {t('orderConfirmation.whatsNext')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border border-zinc-800 rounded-xl">
                <p className="font-bold text-orange-400 mb-2">{t('orderConfirmation.step1Title')}</p>
                <p className="text-sm text-zinc-400">{t('orderConfirmation.step1Desc')}</p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-xl">
                <p className="font-bold text-orange-400 mb-2">{t('orderConfirmation.step2Title')}</p>
                <p className="text-sm text-zinc-400">{t('orderConfirmation.step2Desc')}</p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-xl">
                <p className="font-bold text-orange-400 mb-2">{t('orderConfirmation.step3Title')}</p>
                <p className="text-sm text-zinc-400">{t('orderConfirmation.step3Desc')}</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-10">
            <Link
              to="/track-order"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl py-4 text-center text-lg transition-colors"
            >
              {t('orderConfirmation.trackOrder')}
            </Link>
            <Link
              to="/"
              className="flex-1 border border-zinc-700 hover:border-orange-500 text-white font-bold rounded-xl py-4 text-center text-lg transition-colors"
            >
              {t('orderConfirmation.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
