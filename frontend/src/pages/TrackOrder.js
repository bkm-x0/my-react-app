import React, { useState } from 'react';
import { Search, Package, Truck, MapPin, Clock, DollarSign, Check } from 'lucide-react';
import api from '../services/api';
import useAuthStore from './store/authStore';

const TrackOrder = () => {
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Try to fetch the order (assuming order number format is just the ID)
      const orderId = searchTerm.replace(/\D/g, '');
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError('Order not found. Please check the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMyOrders = async () => {
    if (!token) {
      setError('Please log in to view your orders');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/orders/myorders');
      setMyOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
      setShowMyOrders(true);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStage = (status) => {
    const stages = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4
    };
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
    <div className="min-h-screen bg-cyber-black scanlines">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">TRACK</span>
              <span className="text-cyber-muted-pink"> YOUR ORDER</span>
            </h1>
            <p className="text-gray-300">Enter your order number to track shipment status in real-time</p>
          </div>

          {/* Search Section */}
          <div className="cyber-card mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter order number (e.g., ORD-123 or just 123)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="cyber-input w-full pl-12"
                  />
                </div>
                <button type="submit" className="cyber-button px-8">
                  SEARCH
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 border border-cyber-muted-pink bg-cyber-muted-pink/10 rounded">
                <p className="text-cyber-muted-pink text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          {!showMyOrders && (
            <div className="cyber-card mb-8">
              <div className="text-center">
                {token ? (
                  <button
                    onClick={handleLoadMyOrders}
                    className="cyber-button"
                  >
                    LOAD MY ORDERS
                  </button>
                ) : (
                  <p className="text-gray-400">
                    <a href="/login" className="text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors">
                      Log in
                    </a>
                    {' '}to view your order history
                  </p>
                )}
              </div>
            </div>
          )}

          {/* My Orders List */}
          {showMyOrders && myOrders.length > 0 && (
            <div className="cyber-card mb-8">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">YOUR ORDERS</h2>
              <div className="space-y-3">
                {myOrders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setOrder(o);
                      setShowMyOrders(false);
                    }}
                    className="w-full p-4 border border-cyber-gray/30 hover:border-cyber-muted-blue transition-colors rounded-lg text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-orbitron font-bold">Order #ORD-{o.id}</p>
                        <p className="text-sm text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-orbitron font-bold text-cyber-muted-green">{(o.total_amount || 0).toLocaleString()}₡</p>
                        <p className={`text-xs font-orbitron ${
                          o.status === 'delivered' ? 'text-cyber-muted-green' :
                          o.status === 'shipped' ? 'text-cyber-muted-blue' :
                          o.status === 'confirmed' ? 'text-emerald-400' :
                          o.status === 'processing' ? 'text-cyber-muted-taupe' :
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
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="cyber-card">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ORDER NUMBER</p>
                    <p className="text-3xl font-orbitron font-bold text-cyber-muted-blue">#ORD-{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ORDER STATUS</p>
                    <p className={`text-lg font-orbitron font-bold px-3 py-2 rounded w-fit ${
                      statusColors[order.status || 'pending']
                    }`}>
                      {String(order.status || 'pending').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">SHIPMENT TIMELINE</h2>
                
                <div className="space-y-6">
                  {[
                    { stage: 'pending', label: 'Order Placed', icon: Check },
                    { stage: 'confirmed', label: 'Admin Confirmed', icon: Check },
                    { stage: 'processing', label: 'Processing', icon: Package },
                    { stage: 'shipped', label: 'Shipped', icon: Truck },
                    { stage: 'delivered', label: 'Delivered', icon: MapPin }
                  ].map((item, index) => {
                    const currentStage = getStatusStage(order.status || 'pending');
                    const isCompleted = getStatusStage(item.stage) <= currentStage;
                    const isCurrent = item.stage === (order.status || 'pending');
                    const Icon = item.icon;

                    return (
                      <div key={item.stage}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-orbitron font-bold ${
                            isCompleted ? 'bg-cyber-muted-green text-cyber-black' :
                            'bg-cyber-gray text-gray-500'
                          }`}>
                            {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-orbitron font-bold ${
                              isCurrent ? 'text-cyber-muted-green text-lg' :
                              isCompleted ? 'text-gray-400' :
                              'text-gray-500'
                            }`}>
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-400">
                              {isCurrent ? 'In progress' : isCompleted ? 'Completed' : 'Pending'}
                            </p>
                          </div>
                        </div>
                        
                        {index < 4 && (
                          <div className="ml-6 h-12 border-l-2 border-cyber-gray/30"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="cyber-card">
                  <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-cyber-muted-blue" />
                    ORDER DETAILS
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order Date</span>
                      <span className="font-mono">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="capitalize">{order.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Items Ordered</span>
                      <span>{order.items?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="cyber-card">
                  <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-cyber-muted-green" />
                    TOTAL AMOUNT
                  </h3>
                  <div className="text-4xl font-orbitron font-bold text-cyber-muted-green">
                    {(order.total_amount || 0).toLocaleString()}₡
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="cyber-card">
                <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-cyber-muted-pink" />
                  SHIPPING ADDRESS
                </h3>
                <div className="p-4 bg-cyber-dark/50 border border-cyber-gray/30 rounded">
                  <p className="text-gray-300 whitespace-pre-line">{order.shipping_address || 'Address not available'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="cyber-card">
                <h3 className="text-xl font-orbitron font-bold mb-4">ORDER ITEMS</h3>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark/50 border border-cyber-gray/30 rounded">
                        <div>
                          <p className="font-orbitron font-bold">{item.product_name || 'Product'}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-orbitron font-bold text-cyber-muted-green">
                          {(item.price * item.quantity).toLocaleString()}₡
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No items in this order</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Estimated Delivery Info */}
          {order && (
            <div className="cyber-card mt-8 p-4 border border-cyber-muted-green/30 bg-cyber-muted-green/5">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-cyber-muted-green flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-orbitron font-bold text-cyber-muted-green mb-1">ESTIMATED DELIVERY</p>
                  <p className="text-gray-300">
                    Your order should arrive within 3-5 business days from the ship date. You'll receive email updates with tracking information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

