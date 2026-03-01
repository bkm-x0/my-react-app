import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, MapPin, Phone, Mail, Send } from 'lucide-react';
import useLangStore from '../pages/store/langStore';

const Footer = () => {
  const { t } = useLangStore();
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60 mt-20">
      {/* Newsletter */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-2xl mb-1">{t('footer.newsletter')}</h3>
              <p className="text-zinc-400 text-sm">{t('footer.newsletterSub')}</p>
            </div>
            <form className="flex w-full md:w-auto gap-2 max-w-md" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500"
                dir="auto"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:block">{t('footer.subscribe')}</span>
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
                <span className="text-white font-black text-xl tracking-tight">CYBER</span>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">{t('footer.tagline')}</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.productsTitle')}</h4>
            <ul className="space-y-2.5">
              {[
                { key: 'footer.gamingPCs', path: '/products?category=desktops' },
                { key: 'footer.laptops', path: '/products?category=laptops' },
                { key: 'footer.graphicsCards', path: '/products?category=components' },
                { key: 'footer.processors', path: '/products?category=components' },
                { key: 'footer.peripherals', path: '/products?category=accessories' },
                { key: 'footer.monitors', path: '/products?category=monitors' },
              ].map(item => (
                <li key={item.key}>
                  <Link to={item.path} className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.infoTitle')}</h4>
            <ul className="space-y-2.5">
              {[
                { key: 'footer.aboutUs', path: '/about' },
                { key: 'nav.contact', path: '/contact' },
                { key: 'footer.support', path: '/support' },
                { key: 'footer.trackOrder', path: '/track-order' },
                { key: 'footer.newArrivals', path: '/new-arrivals' },
                { key: 'footer.onSale', path: '/sale' },
              ].map(item => (
                <li key={item.key}>
                  <Link to={item.path} className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.contactTitle')}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-sm">123 Tech Avenue, Silicon Valley, CA 94025</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-zinc-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-zinc-400 text-sm">support@cyberstore.com</span>
              </div>
            </div>
            <div className="mt-5 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-xs mb-1">{t('footer.workingHours')}</p>
              <p className="text-white text-sm font-medium">{t('footer.weekdays')}</p>
              <p className="text-white text-sm font-medium">{t('footer.weekends')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-500 text-sm">{t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            {['Visa', 'MasterCard', 'PayPal', 'Apple Pay'].map(p => (
              <span key={p} className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
    <footer className="bg-zinc-950 border-t border-zinc-800/60 mt-20">
      {/* Newsletter */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-2xl mb-1">Stay Updated</h3>
              <p className="text-zinc-400 text-sm">Get the latest deals and promotions delivered to your inbox</p>
            </div>
            <form className="flex w-full md:w-auto gap-2 max-w-md" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address..."
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:block">Subscribe</span>
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
                <span className="text-white font-black text-xl tracking-tight">CYBER</span>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Premium gaming hardware and PC components. Top quality products, competitive prices, and fast delivery worldwide.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Gaming PCs', path: '/products?category=desktops' },
                { label: 'Laptops', path: '/products?category=laptops' },
                { label: 'Graphics Cards', path: '/products?category=components' },
                { label: 'Processors', path: '/products?category=components' },
                { label: 'Peripherals', path: '/products?category=accessories' },
                { label: 'Monitors', path: '/products?category=monitors' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="text-zinc-400 hover:text-orange-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Information</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Support', path: '/support' },
                { label: 'Track Order', path: '/track-order' },
                { label: 'New Arrivals', path: '/new-arrivals' },
                { label: 'On Sale', path: '/sale' },
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
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-sm">123 Tech Avenue, Silicon Valley, CA 94025</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-zinc-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-zinc-400 text-sm">support@cyberstore.com</span>
              </div>
            </div>
            <div className="mt-5 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-xs mb-1">Working hours:</p>
              <p className="text-white text-sm font-medium">Mon–Fri: 09:00–20:00</p>
              <p className="text-white text-sm font-medium">Sat–Sun: 10:00–18:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-500 text-sm">© 2026 CyberStore. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Visa', 'MasterCard', 'PayPal', 'Apple Pay'].map(p => (
              <span key={p} className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  


