import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, MapPin, Package, Clock, Home, FileText } from 'lucide-react';
import api from '../services/api';
import useAuthStore from './store/authStore';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);

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
      setError('Failed to load order details');
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
      
      // Create downloadable link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to download invoice');
      console.error(err);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await api.post(`/orders/${orderId}/send-invoice`);
      alert('Invoice sent to your email!');
    } catch (err) {
      setError('Failed to send invoice');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black scanlines flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="h-12 w-12 text-cyber-muted-blue mx-auto" />
          </div>
          <p className="text-gray-400 font-orbitron">LOADING ORDER DETAILS...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-cyber-black scanlines flex items-center justify-center">
        <div className="text-center cyber-card max-w-md">
          <p className="text-cyber-muted-pink font-orbitron mb-4">{error}</p>
          <Link to="/" className="cyber-button inline-block">
            RETURN HOME
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
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered'
  };

  return (
    <div className="min-h-screen bg-cyber-black scanlines">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-muted-green/10 border-2 border-cyber-muted-green mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-cyber-muted-green" />
            </div>
            <h1 className="text-5xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-green">ORDER</span>
              <span className="text-cyber-muted-blue"> CONFIRMED</span>
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Thank you for your purchase! Your cybernetic upgrades are being prepared.
            </p>
            <p className="text-gray-400 text-sm font-mono">
              Order ID: <span className="text-cyber-muted-pink font-bold">{orderId}</span>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 border border-cyber-muted-pink bg-cyber-muted-pink/10 rounded">
              <p className="text-cyber-muted-pink text-sm">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Main Order Details */}
            <div className="lg:col-span-2">
              {/* Status */}
              <div className="cyber-card mb-8">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">ORDER STATUS</h2>
                
                <div className="flex items-center justify-between mb-8">
                  {statusSteps.map((status, index) => (
                    <React.Fragment key={status}>
                      <div className="text-center flex-1">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-orbitron font-bold ${
                          statusSteps.indexOf(orderStatus) >= index
                            ? 'bg-cyber-muted-green text-cyber-black'
                            : 'bg-cyber-gray text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="text-xs font-orbitron text-gray-400 uppercase">{statusLabels[status]}</p>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          statusSteps.indexOf(orderStatus) > index
                            ? 'bg-cyber-muted-green'
                            : 'bg-cyber-gray'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className={`p-4 border-2 rounded-lg ${statusColors[orderStatus]}`}>
                  <p className="font-orbitron font-bold uppercase">Current Status: {orderStatus}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="cyber-card mb-8">
                <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                  <Package className="h-6 w-6 mr-3 text-cyber-muted-blue" />
                  ORDER ITEMS
                </h2>

                <div className="space-y-4">
                  {order?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-orbitron font-bold text-cyber-muted-blue">{item.product_name || 'Product'}</p>
                        <p className="text-sm text-gray-400 mt-1">SKU: {item.product_sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300">Qty: {item.quantity}</p>
                        <p className="font-orbitron font-bold text-cyber-muted-green">
                          {(item.price * item.quantity).toLocaleString()}₡
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Actions */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-cyber-muted-pink" />
                  INVOICE & DOCUMENTS
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={invoiceLoading}
                    className="flex items-center justify-center p-4 border-2 border-cyber-muted-blue hover:bg-cyber-muted-blue/10 transition-colors rounded-lg font-orbitron font-bold disabled:opacity-50"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {invoiceLoading ? 'DOWNLOADING...' : 'DOWNLOAD INVOICE'}
                  </button>
                  
                  <button
                    onClick={handleSendEmail}
                    className="flex items-center justify-center p-4 border-2 border-cyber-muted-green hover:bg-cyber-muted-green/10 transition-colors rounded-lg font-orbitron font-bold"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    EMAIL INVOICE
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Order Summary */}
              <div className="cyber-card mb-8">
                <h2 className="text-xl font-orbitron font-bold mb-4 text-cyber-muted-blue">ORDER SUMMARY</h2>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-orbitron">{(order?.total_amount || 0).toLocaleString()}₡</span>
                  </div>
                  <div className="flex justify-between border-t border-cyber-gray/30 pt-3">
                    <span className="font-orbitron font-bold">TOTAL</span>
                    <span className="text-cyber-muted-green font-bold">{(order?.total_amount || 0).toLocaleString()}₡</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="cyber-card mb-8">
                <h2 className="text-xl font-orbitron font-bold mb-4 flex items-center text-cyber-muted-blue">
                  <MapPin className="h-5 w-5 mr-2" />
                  SHIPPING TO
                </h2>
                
                <div className="text-sm space-y-2 text-gray-300">
                  <p className="font-orbitron font-bold">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <p className="text-gray-400">{shippingInfo.email}</p>
                  <p className="text-gray-400">{shippingInfo.phone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="cyber-card mb-8">
                <h2 className="text-xl font-orbitron font-bold mb-4 flex items-center text-cyber-muted-blue">
                  💳 PAYMENT METHOD
                </h2>
                
                <div className={`p-4 rounded-lg text-sm font-orbitron font-bold ${
                  shippingInfo.paymentMethod === 'cod'
                    ? 'bg-cyber-muted-pink/10 border-2 border-cyber-muted-pink text-cyber-muted-pink'
                    : 'bg-cyber-muted-blue/10 border-2 border-cyber-muted-blue text-cyber-muted-blue'
                }`}>
                  {shippingInfo.paymentMethod === 'credit_card' && 'CREDIT CARD'}
                  {shippingInfo.paymentMethod === 'crypto' && 'CRYPTOCURRENCY'}
                  {shippingInfo.paymentMethod === 'cod' && 'CASH ON DELIVERY'}
                </div>
                
                {shippingInfo.paymentMethod === 'cod' && (
                  <div className="mt-4 p-3 bg-cyber-muted-pink/10 border border-cyber-muted-pink/30 rounded text-sm text-gray-300">
                    💵 Payment will be collected upon delivery. Please have the exact amount ready.
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="cyber-card">
                <h2 className="text-xl font-orbitron font-bold mb-4 flex items-center text-cyber-muted-blue">
                  <Clock className="h-5 w-5 mr-2" />
                  TIMELINE
                </h2>
                
                <div className="text-sm space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-cyber-muted-green rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-orbitron text-cyber-muted-green">Order Confirmed</p>
                      <p className="text-xs text-gray-400">Just now</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-cyber-gray rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-orbitron text-gray-400">Processing</p>
                      <p className="text-xs text-gray-500">In progress</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-cyber-gray rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-orbitron text-gray-400">Shipped</p>
                      <p className="text-xs text-gray-500">TBA</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-cyber-gray rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-orbitron text-gray-400">Delivered</p>
                      <p className="text-xs text-gray-500">TBA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="cyber-card">
            <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
              <Home className="h-6 w-6 mr-3 text-cyber-muted-pink" />
              WHAT'S NEXT?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border border-cyber-gray/30 rounded-lg">
                <p className="font-orbitron font-bold text-cyber-muted-blue mb-2">1. CONFIRMATION EMAIL</p>
                <p className="text-sm text-gray-400">A detailed order confirmation will be sent to your email with invoice and tracking information.</p>
              </div>
              
              <div className="p-4 border border-cyber-gray/30 rounded-lg">
                <p className="font-orbitron font-bold text-cyber-muted-blue mb-2">2. PROCESSING & QA</p>
                <p className="text-sm text-gray-400">Our cybernetic specialists will process and quality-check your order (1-2 business days).</p>
              </div>
              
              <div className="p-4 border border-cyber-gray/30 rounded-lg">
                <p className="font-orbitron font-bold text-cyber-muted-blue mb-2">3. SHIPPING</p>
                <p className="text-sm text-gray-400">Your package will be shipped with real-time tracking. Expected delivery: 3-5 business days.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12">
            <Link
              to="/track-order"
              className="flex-1 cyber-button py-4 text-lg text-center"
            >
              TRACK YOUR ORDER
            </Link>
            
            <Link
              to="/"
              className="flex-1 px-6 py-4 border-2 border-cyber-gray text-gray-300 font-orbitron font-bold hover:border-cyber-muted-purple transition-colors rounded-lg text-center"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
