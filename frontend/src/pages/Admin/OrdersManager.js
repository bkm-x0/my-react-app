import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Loader2, AlertTriangle, Eye, Trash2,
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Truck, Package as PackageIcon
} from 'lucide-react';
import { orderAPI } from '../../services/api';

const statusColors = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: Clock },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: PackageIcon },
  shipped: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: Truck },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle }
};

const statusOptions = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await orderAPI.getOrders(params);
      setOrders(data.orders || data);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await orderAPI.updateOrder(id, { status: 'cancelled' });
      setDeleteModal(null);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setDeleting(false);
    }
  };

  const viewOrder = async (id) => {
    try {
      const { data } = await orderAPI.getOrder(id);
      setSelectedOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    }
  };

  const formatPrice = (v) => {
    const num = parseFloat(v) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-white font-black text-xl flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-orange-400" />
          Orders Management
          <span className="text-zinc-500 text-sm font-normal ml-2">({total} total)</span>
        </h2>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              statusFilter === s
                ? 'bg-orange-500 text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No orders found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Order</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Customer</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Amount</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-right text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => {
                    const sc = statusColors[order.status] || statusColors.pending;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="text-white text-sm font-bold">#{order.id}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-zinc-300 text-sm">{order.username || order.user_email || `User #${order.user_id}`}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-orange-400 text-sm font-bold">{formatPrice(order.total_amount)}</span>
                        </td>
                        <td className="px-5 py-4">
                          {updatingStatus === order.id ? (
                            <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                          ) : (
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer ${sc.bg} ${sc.text} focus:outline-none focus:ring-1 focus:ring-orange-500`}
                            >
                              {statusOptions.map(s => (
                                <option key={s} value={s} className="bg-zinc-900 text-white">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-zinc-500 text-sm">{formatDate(order.created_at)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => viewOrder(order.id)}
                              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                              <button
                                onClick={() => setDeleteModal(order)}
                                className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                                title="Cancel Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-zinc-400 text-sm px-3">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-white font-bold text-lg mb-4">Order #{selectedOrder.id}</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Status</span>
                  <span className={`text-sm font-bold ${(statusColors[selectedOrder.status] || statusColors.pending).text}`}>
                    {(selectedOrder.status || 'pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Total</span>
                  <span className="text-orange-400 text-sm font-bold">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Payment</span>
                  <span className="text-zinc-300 text-sm">{selectedOrder.payment_method || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Date</span>
                  <span className="text-zinc-300 text-sm">{formatDate(selectedOrder.created_at)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="bg-zinc-800 rounded-xl p-4 mb-4">
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Shipping Address</p>
                  <p className="text-zinc-300 text-sm">
                    {typeof selectedOrder.shipping_address === 'string'
                      ? selectedOrder.shipping_address
                      : `${selectedOrder.shipping_address.address || ''}, ${selectedOrder.shipping_address.city || ''} ${selectedOrder.shipping_address.wilaya || ''}`
                    }
                  </p>
                </div>
              )}

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Items ({selectedOrder.items.length})</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-800 rounded-xl p-3">
                        <div>
                          <p className="text-white text-sm font-bold">{item.name || item.product_name || `Product #${item.product_id}`}</p>
                          <p className="text-zinc-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-orange-400 text-sm font-bold">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-6 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">Cancel Order</h3>
              <p className="text-zinc-400 text-sm text-center mb-6">
                Are you sure you want to cancel order <span className="text-white font-bold">#{deleteModal.id}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Cancel It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersManager;
