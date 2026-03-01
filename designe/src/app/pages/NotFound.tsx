import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="mb-6"
        >
          <span className="text-orange-500 font-black text-[8rem] leading-none block">404</span>
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white font-black text-2xl mb-3">Sahifa topilmadi</h1>
          <p className="text-zinc-400 mb-8">Siz qidirayotgan sahifa mavjud emas yoki o'chirib yuborilgan.</p>
          <div className="flex justify-center gap-3">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                Bosh sahifa
              </motion.button>
            </Link>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-bold rounded-xl transition-all"
              >
                Mahsulotlar <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
