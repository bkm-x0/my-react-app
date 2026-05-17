import React from 'react';
import { motion } from 'framer-motion';
import { Printer, X } from 'lucide-react';
import useLangStore from '../store/langStore';

const OrderReceipt = ({ order, onClose }) => {
  const { t, lang } = useLangStore();
  const formatPrice = (v) => {
    const num = parseFloat(v) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' DZD';
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Print Style */}
        <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            .print-hide { display: none !important; }
            .receipt-container { margin: 0; max-height: none; }
          }
        `}</style>

        {/* Header with Close & Print Buttons */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white print-hide">
          <h2 className="text-gray-900 font-bold text-lg">{lang === 'ar' ? 'وصل الطلب' : 'Order Receipt'}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              {t('admin.print')}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="receipt-container p-6 text-gray-900">
          {/* Header */}
          <div className="text-center mb-6 pb-6 border-b-2 border-gray-300">
            <h1 className="text-2xl font-black mb-1">{t('admin.receipt')}</h1>
            <p className="text-gray-600">{t('admin.orderNumber')}: #{order.id}</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">{t('admin.orderDate')}</p>
              <p className="text-sm font-bold">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">{t('admin.orderStatus')}</p>
              <p className="text-sm font-bold capitalize">{order.status || t('admin.pending')}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">{t('admin.customer')}</p>
              <p className="text-sm font-bold">{order.username || order.user_email || 'عميل'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">{t('admin.paymentMethod')}</p>
              <p className="text-sm font-bold">{order.payment_method || t('admin.nA')}</p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">{t('admin.shippingAddress')}</p>
              <p className="text-sm">
                {typeof order.shipping_address === 'string'
                  ? order.shipping_address
                  : `${order.shipping_address.address || ''}, ${order.shipping_address.city || ''} ${order.shipping_address.wilaya || ''}`
                }
              </p>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-600 uppercase mb-3">{t('admin.products')}</p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left text-xs font-bold text-gray-600 py-2">{t('admin.product')}</th>
                  <th className="text-center text-xs font-bold text-gray-600 py-2">{t('admin.quantity')}</th>
                  <th className="text-right text-xs font-bold text-gray-600 py-2">{t('admin.price')}</th>
                  <th className="text-right text-xs font-bold text-gray-600 py-2">{t('admin.total')}</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="text-sm py-3">{item.name || item.product_name || `المنتج #${item.product_id}`}</td>
                      <td className="text-center text-sm py-3">{item.quantity}</td>
                      <td className="text-right text-sm py-3">{formatPrice(item.price)}</td>
                      <td className="text-right text-sm font-bold py-3">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500 text-sm">
                      {t('admin.noProducts')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">{t('admin.subtotal')}:</span>
              <span className="text-sm font-bold">{formatPrice(order.subtotal || order.total_amount)}</span>
            </div>
            {order.tax_amount && parseFloat(order.tax_amount) > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">{t('admin.tax')}:</span>
                <span className="text-sm font-bold">{formatPrice(order.tax_amount)}</span>
              </div>
            )}
            {order.shipping_cost && parseFloat(order.shipping_cost) > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">{t('admin.shipping')}:</span>
                <span className="text-sm font-bold">{formatPrice(order.shipping_cost)}</span>
              </div>
            )}
            {order.discount && parseFloat(order.discount) > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">{t('admin.discount')}:</span>
                <span className="text-sm font-bold text-red-600">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 pt-3">
              <span className="text-sm font-bold text-gray-900">{t('admin.grandTotal')}:</span>
              <span className="text-lg font-black text-blue-600">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t-2 border-gray-300">
            <p className="text-xs text-gray-500 mb-4">{t('admin.thankYou')}</p>
            <p className="text-xs text-gray-400">{t('admin.createdBy')}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderReceipt;
