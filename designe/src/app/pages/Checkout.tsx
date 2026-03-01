import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard, Truck, MapPin, User, Phone, Mail,
  Check, ChevronRight, ArrowLeft, ShoppingBag, Zap, Loader2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function formatPrice(price: number) {
  return price.toLocaleString('uz-UZ') + " so'm";
}

const STEPS = [
  { id: 1, label: 'Yetkazib berish', icon: Truck },
  { id: 2, label: 'To\'lov', icon: CreditCard },
  { id: 3, label: 'Tasdiqlash', icon: Check },
];

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, discount, setPromoCode } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({
    name: '', surname: '', phone: '', email: '',
    city: 'Toshkent', address: '', apartment: '', comment: ''
  });
  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = cartTotal > 500000 ? 0 : 30000;
  const discountAmount = Math.round(cartTotal * discount / 100);
  const finalTotal = cartTotal - discountAmount + shipping;

  const formatCardNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');

  const validateDelivery = () => {
    const e: Record<string, string> = {};
    if (!delivery.name.trim()) e.name = "Majburiy";
    if (!delivery.surname.trim()) e.surname = "Majburiy";
    if (!delivery.phone.trim()) e.phone = "Majburiy";
    if (!delivery.address.trim()) e.address = "Majburiy";
    return e;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (payment.method === 'card') {
      if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = "To'g'ri karta raqami kiriting";
      if (!payment.cardName.trim()) e.cardName = "Majburiy";
      if (payment.expiry.length < 5) e.expiry = "To'g'ri sana kiriting";
      if (payment.cvv.length < 3) e.cvv = "To'g'ri CVV kiriting";
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
    setStep(s => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    navigate('/order-success');
  };

  if (cartCount === 0) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-bold text-xl mb-4">Savat bo'sh</p>
          <Link to="/products" className="text-orange-400 hover:text-orange-300">← Xarid qilish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/cart" className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 text-sm transition-colors group mb-6">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Savatga qaytish
        </Link>

        <h1 className="text-white font-black text-2xl sm:text-3xl mb-8">Buyurtma rasmiylashtirish</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-8 max-w-md">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: step >= s.id ? '#f97316' : '#27272a',
                    borderColor: step === s.id ? '#f97316' : step > s.id ? '#f97316' : '#3f3f46',
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
                    Yetkazib berish ma'lumotlari
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { field: 'name', label: 'Ism', placeholder: 'Ismingiz', icon: User, col: 1 },
                      { field: 'surname', label: 'Familiya', placeholder: 'Familiyangiz', icon: User, col: 1 },
                      { field: 'phone', label: 'Telefon', placeholder: '+998 90 123 45 67', icon: Phone, col: 1 },
                      { field: 'email', label: 'Email', placeholder: 'email@example.com', icon: Mail, col: 1 },
                    ].map(({ field, label, placeholder, icon: Icon }) => (
                      <div key={field}>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            value={delivery[field as keyof typeof delivery]}
                            onChange={e => { setDelivery(d => ({ ...d, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })); }}
                            placeholder={placeholder}
                            className={`w-full bg-zinc-800 border ${errors[field] ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                        </div>
                        {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Manzil</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={delivery.address}
                          onChange={e => { setDelivery(d => ({ ...d, address: e.target.value })); setErrors(er => ({ ...er, address: '' })); }}
                          placeholder="Ko'cha, uy raqami"
                          className={`w-full bg-zinc-800 border ${errors.address ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Xonadon</label>
                      <input
                        type="text"
                        value={delivery.apartment}
                        onChange={e => setDelivery(d => ({ ...d, apartment: e.target.value }))}
                        placeholder="Xonadon raqami"
                        className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Izoh (ixtiyoriy)</label>
                      <textarea
                        value={delivery.comment}
                        onChange={e => setDelivery(d => ({ ...d, comment: e.target.value }))}
                        placeholder="Kuryerga eslatma..."
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
                    To'lov usuli
                  </h2>

                  {/* Payment methods */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', label: 'Karta', desc: 'Visa/MC/UzCard' },
                      { id: 'payme', label: 'Payme', desc: 'Payme orqali' },
                      { id: 'cash', label: 'Naqd', desc: 'Qabul qilishda' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPayment(p => ({ ...p, method: m.id }))}
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
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
                              <p className="text-zinc-500 text-xs">KARTA EGASI</p>
                              <p className="text-white font-bold text-sm">{payment.cardName || 'ISM FAMILIYA'}</p>
                            </div>
                            <div>
                              <p className="text-zinc-500 text-xs">MUDDATI</p>
                              <p className="text-white font-bold text-sm">{payment.expiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Karta raqami</label>
                        <input
                          type="text"
                          value={payment.cardNumber}
                          onChange={e => { setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) })); setErrors(er => ({ ...er, cardNumber: '' })); }}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className={`w-full bg-zinc-800 border ${errors.cardNumber ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 font-mono tracking-wider`}
                        />
                        {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Karta egasi ismi</label>
                        <input
                          type="text"
                          value={payment.cardName}
                          onChange={e => { setPayment(p => ({ ...p, cardName: e.target.value.toUpperCase() })); setErrors(er => ({ ...er, cardName: '' })); }}
                          placeholder="ISM FAMILIYA"
                          className={`w-full bg-zinc-800 border ${errors.cardName ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 uppercase`}
                        />
                        {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Muddati</label>
                          <input
                            type="text"
                            value={payment.expiry}
                            onChange={e => { setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) })); setErrors(er => ({ ...er, expiry: '' })); }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full bg-zinc-800 border ${errors.expiry ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                          {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">CVV</label>
                          <input
                            type="password"
                            value={payment.cvv}
                            onChange={e => { setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })); setErrors(er => ({ ...er, cvv: '' })); }}
                            placeholder="•••"
                            maxLength={3}
                            className={`w-full bg-zinc-800 border ${errors.cvv ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                          />
                          {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {payment.method === 'payme' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 bg-zinc-800 rounded-2xl"
                    >
                      <p className="text-white font-bold mb-2">Payme orqali to'lov</p>
                      <p className="text-zinc-400 text-sm">Buyurtma bergandan so'ng Payme havolasi yuboriladi</p>
                    </motion.div>
                  )}

                  {payment.method === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 bg-zinc-800 rounded-2xl"
                    >
                      <p className="text-white font-bold mb-2">Naqd pul bilan to'lov</p>
                      <p className="text-zinc-400 text-sm">Mahsulotni qabul qilishda naqd to'laysiz</p>
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
                    Buyurtmani tasdiqlash
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Yetkazib berish</p>
                      <p className="text-white font-medium">{delivery.name} {delivery.surname}</p>
                      <p className="text-zinc-300 text-sm">{delivery.phone}</p>
                      <p className="text-zinc-300 text-sm">{delivery.city}, {delivery.address}</p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">To'lov usuli</p>
                      <p className="text-white font-medium">
                        {payment.method === 'card' ? `Karta: •••• ${payment.cardNumber.slice(-4)}` : payment.method === 'payme' ? 'Payme' : 'Naqd pul'}
                      </p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Mahsulotlar ({cartCount} ta)</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-700 rounded-lg overflow-hidden shrink-0">
                              <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                  onClick={() => setStep(s => s - 1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 font-bold rounded-xl transition-all text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Orqaga
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
                    Davom etish <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleOrder}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.4)' } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 text-black disabled:text-zinc-500 font-black rounded-xl transition-colors"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Joʻnatilmoqda...</> : <><ShoppingBag className="w-5 h-5" /> Buyurtmani tasdiqlash</>}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit lg:sticky lg:top-24">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              Buyurtma
            </h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-zinc-300 text-xs flex-1 line-clamp-1">{item.name} x{item.quantity}</p>
                  <p className="text-white text-xs font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Jami</span>
                <span className="text-white">{formatPrice(cartTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Chegirma</span>
                  <span className="text-emerald-400">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Yetkazib berish</span>
                <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>{shipping === 0 ? 'Bepul' : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between">
                <span className="text-white font-bold">Yakuniy summa</span>
                <span className="text-orange-400 font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>Xavfsiz to'lov tizimi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
