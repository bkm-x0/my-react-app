import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Zap, ChevronDown, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../pages/store/authStore';
import useCartStore from '../pages/store/cartStore';
import useLangStore from '../pages/store/langStore';

const CyberNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems?.length || 0;
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLangStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [location]);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    {
      label: t('nav.products'), path: '/products', dropdown: [
        { label: t('nav.allProducts'), path: '/products' },
        { label: t('nav.desktops'), path: '/products?category=desktops' },
        { label: t('nav.laptops'), path: '/products?category=laptops' },
        { label: t('nav.components'), path: '/products?category=components' },
        { label: t('nav.accessories'), path: '/products?category=accessories' },
      ]
    },
    { label: t('nav.categories'), path: '/categories' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-orange-500/20 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-orange-500 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-5 h-5 text-black relative z-10" fill="black" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-black text-xl tracking-tight">CYBER</span>
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div
                key={link.path + link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setDropdownOpen(link.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-500'
                      : 'text-zinc-300 hover:text-orange-400'
                  }`}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-3 h-3" />}
                </Link>
                {link.dropdown && dropdownOpen === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full start-0 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden"
                  >
                    {link.dropdown.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 text-sm text-zinc-300 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="flex items-center bg-zinc-800 border border-orange-500/40 rounded-lg overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('nav.search')}
                    className="bg-transparent text-white text-sm px-3 py-2 outline-none w-full placeholder:text-zinc-500"
                    dir="auto"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-zinc-400 hover:text-orange-400 transition-colors rounded-lg hover:bg-zinc-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Language Switcher */}
            <motion.button
              onClick={toggleLang}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/40 rounded-lg transition-colors"
              title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            >
              <span className="text-base leading-none">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
              <span className="text-zinc-300 text-xs font-bold hidden sm:block">
                {lang === 'en' ? 'عربي' : 'EN'}
              </span>
            </motion.button>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 text-zinc-300 group-hover:text-orange-400 transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-black text-xs font-black rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
                <span className="hidden sm:block text-sm text-zinc-300 group-hover:text-white transition-colors">{t('nav.cart')}</span>
              </Link>
            </motion.div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-black" />
                  <span className="text-black text-sm font-bold">{user?.username || user?.email?.split('@')[0]}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-300 hover:text-orange-400"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-black" />
                  <span className="text-black text-sm font-bold">{t('nav.login')}</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-950/98 backdrop-blur-xl border-t border-zinc-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-zinc-300 hover:text-orange-400 hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile lang toggle */}
              <button
                onClick={toggleLang}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
              >
                <span className="text-base">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
                <span>{lang === 'en' ? 'عربي' : 'English'}</span>
              </button>
              <div className="pt-3 flex gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex-1 text-center py-2.5 bg-orange-500 text-black font-bold rounded-lg text-sm">{t('nav.profile')}</Link>
                    <button onClick={handleLogout} className="flex-1 text-center py-2.5 bg-zinc-800 text-white font-bold rounded-lg text-sm border border-zinc-700">{t('nav.logout')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1 text-center py-2.5 bg-orange-500 text-black font-bold rounded-lg text-sm">{t('nav.login')}</Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 bg-zinc-800 text-white font-bold rounded-lg text-sm border border-zinc-700">{t('nav.register')}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default CyberNavbar;
