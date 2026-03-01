import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Truck, MapPin, User, Phone, Mail,
  Check, ChevronRight, ArrowLeft, ShoppingBag, Zap, Loader2
} from 'lucide-react';
import useCartStore from './store/cartStore';
import useAuthStore from './store/authStore';
import { orderAPI } from '../services/api';
import useLangStore from './store/langStore';

function formatPrice(price) {
  return '$' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 });
}

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
}

const Checkout = () => {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useLangStore();

  const STEPS = [
    { id: 1, label: t('checkout.stepDelivery'), icon: Truck },
    { id: 2, label: t('checkout.stepPayment'), icon: CreditCard },
    { id: 3, label: t('checkout.stepConfirm'), icon: Check },
  ];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState({
    name: user?.name?.split(' ')[0] || '',
    surname: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
    email: user?.email || '',
    city: '',
    address: '',
    apartment: '',
    comment: ''
  });
  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 30;
  const discountAmount = Math.round(subtotal * discount / 100);
  const finalTotal = subtotal - discountAmount + shipping;

  const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'KSTORE10') setDiscount(10);
    else if (code === 'SALE20') setDiscount(20);
    else setErrors({ promo: 'Invalid promo code' });
  };

  const validateDelivery = () => {
    const e = {};
    if (!delivery.name.trim()) e.name = t('common.required');
    if (!delivery.surname.trim()) e.surname = t('common.required');
    if (!delivery.phone.trim()) e.phone = t('common.required');
    if (!delivery.address.trim()) e.address = t('common.required');
    return e;
  };

  const validatePayment = () => {
    const e = {};
    if (payment.method === 'card') {
      if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = t('common.required');
      if (!payment.cardName.trim()) e.cardName = t('common.required');
      if (payment.expiry.length < 5) e.expiry = t('common.required');
      if (payment.cvv.length < 3) e.cvv = t('common.required');
    }
    return e;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const e = validateDelivery();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    if (step === 2) {
      const e = validatePayment();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: `${delivery.address}, ${delivery.apartment || ''}, ${delivery.city}`,
        total_amount: finalTotal,
        payment_method: payment.method,
        name: `${delivery.name} ${delivery.surname}`,
        phone: delivery.phone,
        email: delivery.email,
        comment: delivery.comment,
      };
      await orderAPI.createOrder(orderData);
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Order failed:', err);
      // Still navigate on demo
      clearCart();
      navigate('/order-confirmation');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-white font-bold text-xl mb-4">{t('checkout.emptyCart')}</p>
          <Link to="/products" className="text-orange-400 hover:text-orange-300 transition-colors">
            {t('checkout.goShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link to="/cart" className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 text-sm transition-colors group mb-6">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('checkout.backToCart')}
        </Link>

        <h1 className="text-white font-black text-2xl sm:text-3xl mb-8">{t('checkout.title')}</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-8 max-w-md">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: step >= s.id ? '#f97316' : '#27272a',
                    borderColor: step >= s.id ? '#f97316' : '#3f3f46',
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    step > s.id ? 'bg-orange-500 border-orange-500' : step === s.id ? 'bg-orange-500 border-orange-500' : 'bg-zinc-800 border-zinc-700'
                  }`}
                >
                  {step > s.id
                    ? <Check className="w-5 h-5 text-black" />
                    : <s.icon className={`w-4 h-4 ${step === s.id ? 'text-black' : 'text-zinc-500'}`} />
                  }
                </motion.div>
                <span className={`text-xs mt-1 hidden sm:block ${step >= s.id ? 'text-orange-400 font-bold' : 'text-zinc-500'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-orange-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Delivery */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    {t('checkout.deliveryTitle')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{field:'name',label:t('checkout.fname'),placeholder:t('checkout.fname'),icon:User},{field:'surname',label:t('checkout.lname'),placeholder:t('checkout.lname'),icon:User},{field:'phone',label:t('checkout.phone'),placeholder:'+1 (555) 123-4567',icon:Phone},{field:'email',label:t('checkout.email'),placeholder:'email@example.com',icon:Mail}].map(({ field, label, placeholder, icon: Icon }) => (
                      <div key={field}>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            value={delivery[field]}
                            onChange={(e) => { setDelivery((d) => ({ ...d, [field]: e.target.value })); setErrors((er) => ({ ...er, [field]: '' })); }}
                            placeholder={placeholder}
                            className={`w-full bg-zinc-800 border ${errors[field] ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                        </div>
                        {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.address')}</label>
                      <input
                        type="text"
                        value={delivery.city}
                        onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))}
                        placeholder="City"
                        className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.apartment')}</label>
                      <input
                        type="text"
                        value={delivery.apartment}
                        onChange={(e) => setDelivery((d) => ({ ...d, apartment: e.target.value }))}
                        placeholder="Apt / Suite"
                        className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.address')}</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={delivery.address}
                          onChange={(e) => { setDelivery((d) => ({ ...d, address: e.target.value })); setErrors((er) => ({ ...er, address: '' })); }}
                          placeholder="Street, house number"
                          className={`w-full bg-zinc-800 border ${errors.address ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.comment')}</label>
                      <textarea
                        value={delivery.comment}
                        onChange={(e) => setDelivery((d) => ({ ...d, comment: e.target.value }))}
                        placeholder={t('checkout.commentPlaceholder')}
                        rows={2}
                        className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-400" />
                    {t('checkout.paymentTitle')}
                  </h2>

                  {/* Payment methods */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', label: t('checkout.card'), desc: t('checkout.cardDesc') },
                      { id: 'paypal', label: 'PayPal', desc: t('checkout.paymeDesc') },
                      { id: 'cash', label: t('checkout.cash'), desc: t('checkout.cashDesc') },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPayment((p) => ({ ...p, method: m.id }))}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          payment.method === m.id
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <p className="font-bold text-sm">{m.label}</p>
                        <p className="text-xs opacity-70 mt-0.5">{m.desc}</p>
                      </button>
                    ))}
                  </div>

                  {payment.method === 'card' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      {/* Card preview */}
                      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-orange-400 font-black text-lg">K PC Store</span>
                            <div className="flex gap-1">
                              <div className="w-7 h-7 bg-orange-500 rounded-full opacity-80" />
                              <div className="w-7 h-7 bg-orange-600 rounded-full opacity-60 -ml-3" />
                            </div>
                          </div>
                          <p className="text-zinc-300 font-mono text-lg tracking-widest mb-4">
                            {payment.cardNumber || '•••• •••• •••• ••••'}
                          </p>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-zinc-500 text-xs">CARD HOLDER</p>
                              <p className="text-white font-bold text-sm">{payment.cardName || 'FULL NAME'}</p>
                            </div>
                            <div>
                              <p className="text-zinc-500 text-xs">EXPIRES</p>
                              <p className="text-white font-bold text-sm">{payment.expiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.cardNumber')}</label>
                        <input
                          type="text"
                          value={payment.cardNumber}
                          onChange={(e) => { setPayment((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) })); setErrors((er) => ({ ...er, cardNumber: '' })); }}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className={`w-full bg-zinc-800 border ${errors.cardNumber ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 font-mono tracking-wider`}
                        />
                        {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.cardName')}</label>
                        <input
                          type="text"
                          value={payment.cardName}
                          onChange={(e) => { setPayment((p) => ({ ...p, cardName: e.target.value.toUpperCase() })); setErrors((er) => ({ ...er, cardName: '' })); }}
                          placeholder="FULL NAME"
                          className={`w-full bg-zinc-800 border ${errors.cardName ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 uppercase`}
                        />
                        {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.expiry')}</label>
                          <input
                            type="text"
                            value={payment.expiry}
                            onChange={(e) => { setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) })); setErrors((er) => ({ ...er, expiry: '' })); }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full bg-zinc-800 border ${errors.expiry ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                          {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{t('checkout.cvv')}</label>
                          <input
                            type="password"
                            value={payment.cvv}
                            onChange={(e) => { setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })); setErrors((er) => ({ ...er, cvv: '' })); }}
                            placeholder="•••"
                            maxLength={3}
                            className={`w-full bg-zinc-800 border ${errors.cvv ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                          {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {payment.method === 'paypal' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 bg-zinc-800 rounded-2xl">
                      <p className="text-white font-bold mb-2">PayPal</p>
                      <p className="text-zinc-400 text-sm">{t('checkout.paymeInfo')}</p>
                    </motion.div>
                  )}

                  {payment.method === 'cash' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 bg-zinc-800 rounded-2xl">
                      <p className="text-white font-bold mb-2">{t('checkout.cash')}</p>
                      <p className="text-zinc-400 text-sm">{t('checkout.cashInfo')}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <Check className="w-5 h-5 text-orange-400" />
                    {t('checkout.confirmTitle')}
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">{t('checkout.deliveryInfo')}</p>
                      <p className="text-white font-medium">{delivery.name} {delivery.surname}</p>
                      <p className="text-zinc-300 text-sm">{delivery.phone}</p>
                      <p className="text-zinc-300 text-sm">{delivery.city}{delivery.city ? ', ' : ''}{delivery.address}</p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">{t('checkout.paymentMethod')}</p>
                      <p className="text-white font-medium">
                        {payment.method === 'card'
                          ? `Card: •••• ${payment.cardNumber.replace(/\s/g, '').slice(-4)}`
                          : payment.method === 'paypal'
                          ? 'PayPal'
                          : 'Cash on Delivery'}
                      </p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">{t('checkout.products')} ({getTotalItems()})</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-700 rounded-lg overflow-hidden shrink-0">
                              {(item.image_url || item.image) ? (
                                <img src={getImageUrl(item.image_url || item.image)} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-zinc-700" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                              <p className="text-zinc-400 text-xs">{item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-orange-400 text-sm font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <motion.button
                  onClick={() => setStep((s) => s - 1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 font-bold rounded-xl transition-all text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('checkout.back')}
                </motion.button>
              )}
              <div className="ml-auto">
                {step < 3 ? (
                  <motion.button
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors"
                  >
                    {t('checkout.continue')} <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleOrder}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.4)' } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 text-black disabled:text-zinc-500 font-black rounded-xl transition-colors"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {t('checkout.placing')}</>
                    ) : (
                      <><ShoppingBag className="w-5 h-5" /> {t('checkout.placeOrder')}</>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit lg:sticky lg:top-24">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              {t('checkout.orderSummary')}
            </h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                    {(item.image_url || item.image) ? (
                      <img src={getImageUrl(item.image_url || item.image)} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-700" />
                    )}
                  </div>
                  <p className="text-zinc-300 text-xs flex-1 line-clamp-1">{item.name} x{item.quantity}</p>
                  <p className="text-white text-xs font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setErrors((er) => ({ ...er, promo: '' })); }}
                placeholder={t('cart.promoPlaceholder')}
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-xs px-3 py-2 rounded-lg outline-none transition-colors placeholder:text-zinc-600"
              />
              <button onClick={applyPromo} className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-2 rounded-lg font-bold transition-colors">
                {t('cart.apply')}
              </button>
            </div>
            {errors.promo && <p className="text-red-400 text-xs mb-2">{errors.promo}</p>}
            {discount > 0 && <p className="text-emerald-400 text-xs mb-2">{t('cart.promoApplied')}</p>}

            <div className="border-t border-zinc-800 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">{t('checkout.subtotal')}</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">{t('checkout.discount')}</span>
                  <span className="text-emerald-400">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">{t('checkout.shipping')}</span>
                <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                  {shipping === 0 ? t('checkout.free') : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between">
                <span className="text-white font-bold">{t('checkout.total')}</span>
                <span className="text-orange-400 font-black text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Security badge */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('checkout.secure')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
