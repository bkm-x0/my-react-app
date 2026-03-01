import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Check, ShoppingBag, Home, Package, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderSuccess() {
  const { cartItems, cartTotal } = useStore();
  const orderNumber = Math.floor(Math.random() * 900000 + 100000);

  return (
    <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
      <div className="max-w-md w-full px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-white font-black text-3xl mb-2">Buyurtma tasdiqlandi!</h1>
          <p className="text-zinc-400 mb-2">Buyurtma raqami:</p>
          <p className="text-orange-400 font-black text-2xl mb-4">#{orderNumber}</p>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Buyurtmangiz qabul qilindi. SMS va email orqali xabardor qilamiz. Yetkazib berish 24-48 soat ichida amalga oshiriladi.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-orange-400" />
              <p className="text-white font-bold text-sm">Buyurtma holati</p>
            </div>
            <div className="space-y-3">
              {[
                { step: 'Buyurtma qabul qilindi', done: true },
                { step: 'To\'lov tasdiqlandi', done: true },
                { step: 'Tayyorlanmoqda', done: false },
                { step: 'Yetkazib berilmoqda', done: false },
                { step: 'Yetkazib berildi', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-white font-medium' : 'text-zinc-500'}`}>{item.step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                Bosh sahifaga qaytish
              </motion.button>
            </Link>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white font-bold rounded-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Xarid davom ettirish
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
