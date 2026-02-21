import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, Phone, Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import useAuthStore from './store/authStore';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock cart data - in real app would come from cart context
  const cartItems = [
    {
      id: 1,
      name: 'Neural Interface MK.II',
      price: 2999,
      quantity: 1,
      sku: 'NI-MKII-256-QS',
    },
  ];

  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    
    // Payment
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card'
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.address || !formData.city || !formData.zipCode) {
      setError('Please complete your shipping address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError('Please fill in all payment details');
      return false;
    }
    if (formData.cardNumber.length < 13) {
      setError('Invalid card number');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      // Create order via API
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
        paymentMethod: formData.paymentMethod
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data.id}`, {
        state: {
          order: response.data,
          shippingInfo: formData
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black scanlines">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/cart"
              className="flex items-center text-cyber-muted-purple hover:text-cyber-muted-pink transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO CART
            </Link>
            <h1 className="text-5xl font-orbitron font-bold">
              <span className="text-cyber-muted-blue">SECURE</span>
              <span className="text-cyber-muted-pink"> CHECKOUT</span>
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { num: 1, label: 'SHIPPING' },
              { num: 2, label: 'PAYMENT' },
              { num: 3, label: 'CONFIRM' }
            ].map((s) => (
              <div
                key={s.num}
                className={`p-4 border-2 rounded-lg text-center font-orbitron font-bold transition-all ${
                  step >= s.num
                    ? 'border-cyber-muted-blue bg-cyber-muted-blue/10 text-cyber-muted-blue'
                    : 'border-cyber-gray text-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">{s.num}</div>
                <div className="text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="cyber-card">
                  <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-cyber-muted-blue" />
                    SHIPPING ADDRESS
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 border border-cyber-muted-pink bg-cyber-muted-pink/10 rounded">
                      <p className="text-cyber-muted-pink text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-orbitron mb-2">FIRST NAME *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="cyber-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron mb-2">LAST NAME *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="cyber-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-orbitron mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="user@example.com"
                        className="cyber-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        PHONE *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="cyber-input w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-orbitron mb-2">ADDRESS *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Cyber Street"
                      className="cyber-input w-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-orbitron mb-2">CITY *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Neo Tokyo"
                        className="cyber-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron mb-2">ZIP CODE *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="cyber-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron mb-2">COUNTRY</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Japan"
                        className="cyber-input w-full"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="w-full cyber-button py-3 text-lg"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="cyber-card">
                  <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-cyber-muted-pink" />
                    PAYMENT INFORMATION
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 border border-cyber-muted-pink bg-cyber-muted-pink/10 rounded">
                      <p className="text-cyber-muted-pink text-sm">{error}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-orbitron mb-2">PAYMENT METHOD</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'credit_card', label: 'CREDIT CARD' },
                        { id: 'crypto', label: 'CRYPTOCURRENCY' }
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                          className={`p-4 border-2 rounded-lg font-orbitron font-bold transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-cyber-muted-blue bg-cyber-muted-blue/10'
                              : 'border-cyber-gray hover:border-cyber-muted-purple'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <>
                      <div className="mb-6">
                        <label className="block text-sm font-orbitron mb-2">CARDHOLDER NAME *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="cyber-input w-full"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-orbitron mb-2">CARD NUMBER *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="4532 1234 5678 9010"
                          maxLength="19"
                          className="cyber-input w-full font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-orbitron mb-2">EXPIRY DATE *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="cyber-input w-full font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-orbitron mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            className="cyber-input w-full font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-cyber-gray text-gray-300 font-orbitron font-bold hover:border-cyber-muted-purple transition-colors rounded-lg"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 cyber-button py-3 text-lg"
                    >
                      REVIEW ORDER
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="cyber-card">
                  <h2 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                    <Check className="h-6 w-6 mr-3 text-cyber-muted-green" />
                    ORDER REVIEW
                  </h2>

                  <div className="mb-8">
                    <h3 className="font-orbitron font-bold text-cyber-muted-blue mb-4">SHIPPING ADDRESS</h3>
                    <div className="p-4 bg-cyber-dark/50 border border-cyber-gray/30 rounded">
                      <p className="text-gray-300">{formData.firstName} {formData.lastName}</p>
                      <p className="text-gray-400 text-sm">{formData.address}</p>
                      <p className="text-gray-400 text-sm">{formData.city}, {formData.zipCode}</p>
                      <p className="text-gray-400 text-sm">{formData.email}</p>
                      <p className="text-gray-400 text-sm">{formData.phone}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-orbitron font-bold text-cyber-muted-blue mb-4">PAYMENT METHOD</h3>
                    <div className="p-4 bg-cyber-dark/50 border border-cyber-gray/30 rounded">
                      <p className="text-gray-300">
                        {formData.paymentMethod === 'credit_card' ? 'Credit Card' : 'Cryptocurrency'}
                      </p>
                      {formData.paymentMethod === 'credit_card' && (
                        <p className="text-gray-400 text-sm font-mono">
                          •••• •••• •••• {formData.cardNumber.slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-8 p-4 border border-cyber-muted-green/30 bg-cyber-muted-green/5 rounded">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-cyber-muted-green mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300">
                        Your order is protected by quantum encryption. You will receive an invoice and tracking information via email.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-3 border-2 border-cyber-gray text-gray-300 font-orbitron font-bold hover:border-cyber-muted-purple transition-colors rounded-lg"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="flex-1 cyber-button py-3 text-lg disabled:opacity-50"
                    >
                      {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="cyber-card sticky top-24">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">ORDER SUMMARY</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-cyber-gray/30">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-orbitron font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="font-orbitron font-bold">{(item.price * item.quantity).toLocaleString()}₡</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-orbitron font-bold">{subtotal.toLocaleString()}₡</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shipping</span>
                    <span className={`font-orbitron font-bold ${shipping === 0 ? 'text-cyber-muted-green' : ''}`}>
                      {shipping === 0 ? 'FREE' : `${shipping}₡`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tax (8%)</span>
                    <span className="font-orbitron font-bold">{tax.toLocaleString()}₡</span>
                  </div>
                  
                  <div className="border-t border-cyber-gray/50 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-orbitron font-bold">TOTAL</span>
                      <span className="text-3xl font-orbitron font-bold text-cyber-muted-green">
                        {total.toLocaleString()}₡
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
