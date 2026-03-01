import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Menu, X, Search, Heart, Zap, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { cartCount, isLoggedIn, user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

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
    { label: 'Bosh sahifa', path: '/' },
    { label: 'Mahsulotlar', path: '/products', dropdown: [
      { label: 'Barcha mahsulotlar', path: '/products' },
      { label: 'Kompyuterlar', path: '/products?cat=kompyuterlar' },
      { label: 'Noutbuklar', path: '/products?cat=noutbuklar' },
      { label: 'Komponentlar', path: '/products?cat=komponentlar' },
      { label: 'Aksessuarlar', path: '/products?cat=aksessuarlar' },
    ]},
    { label: 'Aksiyalar', path: '/products?badge=chegirma' },
    { label: "Biz haqimizda", path: '/about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

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
              <span className="text-white font-black text-xl tracking-tight">K PC</span>
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.path} className="relative" onMouseEnter={() => link.dropdown && setDropdownOpen(link.label)} onMouseLeave={() => setDropdownOpen(null)}>
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
                    className="absolute top-full left-0 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden"
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
                    placeholder="Qidirish..."
                    className="bg-transparent text-white text-sm px-3 py-2 outline-none w-full placeholder:text-zinc-500"
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

            {/* Wishlist */}
            <motion.button
              className="hidden sm:flex p-2 text-zinc-400 hover:text-orange-400 transition-colors rounded-lg hover:bg-zinc-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5" />
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
                <span className="hidden sm:block text-sm text-zinc-300 group-hover:text-white transition-colors">Savat</span>
              </Link>
            </motion.div>

            {/* Auth */}
            {isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-black" />
                  <span className="text-black text-sm font-bold">{user?.name.split(' ')[0]}</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-black" />
                  <span className="text-black text-sm font-bold">Kirish</span>
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
                  key={link.path}
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
              <div className="pt-3 flex gap-2">
                <Link to="/login" className="flex-1 text-center py-2.5 bg-orange-500 text-black font-bold rounded-lg text-sm">Kirish</Link>
                <Link to="/register" className="flex-1 text-center py-2.5 bg-zinc-800 text-white font-bold rounded-lg text-sm border border-zinc-700">Ro'yxatdan o'tish</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
