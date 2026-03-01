import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Zap, MapPin, Phone, Mail, Send, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60 mt-20">
      {/* Newsletter */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-2xl mb-1">Yangiliklar olish</h3>
              <p className="text-zinc-400 text-sm">Eng so'nggi aktsiyalar va chegirmalardan xabardor bo'ling</p>
            </div>
            <form className="flex w-full md:w-auto gap-2 max-w-md" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email manzilingiz..."
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:block">Yuborish</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-orange-500 rounded-lg rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black relative z-10" fill="black" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-xl tracking-tight">K PC</span>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              O'zbekistondagi eng yaxshi gaming kompyuter do'koni. Yuqori sifatli mahsulotlar, qulay narxlar va tezkor yetkazib berish.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: '#' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 bg-zinc-800 hover:bg-orange-500 rounded-lg flex items-center justify-center text-zinc-400 hover:text-black transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Mahsulotlar</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Gaming Kompyuterlar', path: '/products?cat=kompyuterlar' },
                { label: 'Noutbuklar', path: '/products?cat=noutbuklar' },
                { label: 'Videokartallar', path: '/products?cat=komponentlar' },
                { label: 'Protsessorlar', path: '/products?cat=komponentlar' },
                { label: 'Sichqonchalar', path: '/products?sub=sichqonchalar' },
                { label: 'Klaviaturalar', path: '/products?sub=klaviaturalar' },
                { label: 'Monitorlar', path: '/products?sub=monitorlar' },
                { label: 'Naushniklar', path: '/products?sub=naushniklar' },
              ].map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Ma'lumot</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Biz haqimizda', path: '/about' },
                { label: 'Aksiyalar', path: '/products?badge=chegirma' },
                { label: 'Yetkazib berish', path: '#' },
                { label: 'Qaytarish siyosati', path: '#' },
                { label: 'Maxfiylik siyosati', path: '#' },
                { label: 'Aloqa', path: '#' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Aloqa</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-sm">Toshkent sh., Chilonzor tumani, Kichik halqa yo'li, 25-uy</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:+998901234567" className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">+998 90 123 45 67</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:info@kpcstore.uz" className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">info@kpcstore.uz</a>
              </div>
            </div>
            <div className="mt-5 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-xs mb-1">Ish vaqti:</p>
              <p className="text-white text-sm font-medium">Dush–Jum: 09:00–20:00</p>
              <p className="text-white text-sm font-medium">Shan–Yak: 10:00–18:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-500 text-sm">© 2025 K PC Store. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            {['Payme', 'Click', 'Uzcard', 'VISA', 'MasterCard'].map(p => (
              <span key={p} className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
