import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, ArrowLeft, Package } from 'lucide-react';
import useCartStore from './store/cartStore';
import useLangStore from './store/langStore';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function getImageUrl(item) {
  const img = item.image_url || item.image;
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
}

function formatPrice(price) {
  if (!price) return '$0';
  return '$' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [discount, setDiscount] = useState(0);

  const cartTotal = getTotalPrice();
  const cartCount = getTotalItems();
  const { t } = useLangStore();

  const handlePromo = () => {
    if (!promoInput.trim()) { setPromoError(t('cart.promoPlaceholder')); return; }
    const validCodes = { 'KSTORE10': 10, 'SALE20': 20 };
    if (validCodes[promoInput.toUpperCase()]) {
      setDiscount(validCodes[promoInput.toUpperCase()]);
      setPromoSuccess(true);
      setPromoError('');
    } else {
      setPromoError(t('cart.promoInvalid'));
      setPromoSuccess(false);
    }
  };

  const shipping = cartTotal > 1000 ? 0 : 30;
  const discountAmount = Math.round(cartTotal * discount / 100);
  const finalTotal = cartTotal - discountAmount + shipping;

  if (cartCount === 0) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingCart className="w-12 h-12 text-zinc-500" />
          </motion.div>
          <h2 className="text-white font-black text-2xl mb-3">{t('cart.empty')}</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-xs">{t('cart.emptySub')}</p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 mx-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors"
            >
              {t('cart.continueShopping')} <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7 text-orange-400" />
          <h1 className="text-white font-black text-2xl sm:text-3xl">{t('cart.title')}</h1>
          <span className="bg-orange-500 text-black text-sm font-black px-2.5 py-1 rounded-full">{cartCount}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map(item => {
                const imageUrl = getImageUrl(item);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0 }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex gap-4 group transition-colors"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-500 text-xs mb-0.5 capitalize">{item.category_name || item.category || ''}</p>
                      <h3 className="text-white font-bold text-sm sm:text-base mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-orange-400 font-black text-base sm:text-lg">{formatPrice(item.price)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <motion.button
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>

                      <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (item.quantity === 1) removeFromCart(item.id);
                            else updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="px-3 py-1.5 text-white text-sm font-bold min-w-[2rem] text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>

                      <p className="text-zinc-300 font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Link to="/products" className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 text-sm transition-colors group pt-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" />
                {t('cart.promo')}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); setPromoSuccess(false); }}
                  placeholder={t('cart.promoPlaceholder')}
                  className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-3 py-2.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600 uppercase"
                />
                <motion.button
                  onClick={handlePromo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm rounded-xl transition-colors"
                >
                  {t('cart.apply')}
                </motion.button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
              {promoSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-xs mt-2"
                >
                  ✓ {t('cart.promoApplied')} ({discount}%)
                </motion.p>
              )}
              <p className="text-zinc-600 text-xs mt-2">Sinab ko'ring: KSTORE10 yoki SALE20</p>
            </div>

            {/* Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-400" />
                {t('cart.summary')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{t('cart.items')} ({cartCount})</span>
                  <span className="text-white font-medium">{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-emerald-400">{t('cart.discount')} ({discount}%)</span>
                    <span className="text-emerald-400 font-medium">-{formatPrice(discountAmount)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-emerald-400 font-medium' : 'text-white font-medium'}>
                    {shipping === 0 ? t('cart.freeShipping') : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-zinc-500 text-xs">✓ $1000 dan yuqori buyurtmalarda bepul yetkazib berish</p>
                )}
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="text-white font-bold">{t('cart.total')}</span>
                  <span className="text-orange-400 font-black text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 mt-5 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors"
                >
                  {t('cart.placeOrder')}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
