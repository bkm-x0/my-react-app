import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, Truck, Headphones,
  Star, ChevronRight, TrendingUp, Award, Users, Package,
  Monitor, Laptop, Gamepad2, Cpu, Layers, HardDrive,
  Tv, Keyboard, Mouse, Wifi,
  Router, Cable, Server, Radio, Plug, Usb,
  Mic, Volume2, Speaker
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import useLangStore from './store/langStore';

const brands = ['ASUS ROG', 'MSI', 'Corsair', 'Razer', 'Logitech', 'HyperX', 'SteelSeries', 'NZXT', 'Lian Li', 'Samsung', 'NVIDIA', 'AMD', 'Intel'];

const subcategoriesMap = {
  'desktops': [
    { name: 'Gaming Desktops', slug: 'gaming-desktops', icon: Gamepad2 },
    { name: 'Workstations', slug: 'workstations', icon: Monitor },
    { name: 'Office PCs', slug: 'office-pcs', icon: Monitor },
    { name: 'Mini PCs', slug: 'mini-pcs', icon: Cpu },
    { name: 'All-in-One', slug: 'all-in-one', icon: Tv },
  ],
  'laptops': [
    { name: 'Gaming Laptops', slug: 'gaming-laptops', icon: Gamepad2 },
    { name: 'Business Laptops', slug: 'business-laptops', icon: Laptop },
    { name: 'Ultrabooks', slug: 'ultrabooks', icon: Laptop },
    { name: 'Chromebooks', slug: 'chromebooks', icon: Laptop },
    { name: '2-in-1 Laptops', slug: '2-in-1-laptops', icon: Laptop },
  ],
  'gaming-systems': [
    { name: 'Custom Gaming PCs', slug: 'custom-gaming-pcs', icon: Cpu },
    { name: 'Pre-Built Gaming', slug: 'pre-built-gaming', icon: Monitor },
    { name: 'Streaming Rigs', slug: 'streaming-rigs', icon: Radio },
    { name: 'VR-Ready PCs', slug: 'vr-ready-pcs', icon: Layers },
  ],
  'processors': [
    { name: 'Intel Core i9', slug: 'intel-i9', icon: Cpu },
    { name: 'Intel Core i7', slug: 'intel-i7', icon: Cpu },
    { name: 'Intel Core i5', slug: 'intel-i5', icon: Cpu },
    { name: 'AMD Ryzen 9', slug: 'amd-ryzen-9', icon: Cpu },
    { name: 'AMD Ryzen 7', slug: 'amd-ryzen-7', icon: Cpu },
    { name: 'AMD Ryzen 5', slug: 'amd-ryzen-5', icon: Cpu },
  ],
  'graphics-cards': [
    { name: 'NVIDIA RTX 40 Series', slug: 'rtx-40', icon: Layers },
    { name: 'NVIDIA RTX 30 Series', slug: 'rtx-30', icon: Layers },
    { name: 'AMD Radeon RX 7000', slug: 'rx-7000', icon: Layers },
    { name: 'AMD Radeon RX 6000', slug: 'rx-6000', icon: Layers },
    { name: 'Professional GPUs', slug: 'professional-gpus', icon: Monitor },
  ],
  'memory-ram': [
    { name: 'DDR5 RAM', slug: 'ddr5', icon: HardDrive },
    { name: 'DDR4 RAM', slug: 'ddr4', icon: HardDrive },
    { name: 'Laptop RAM (SO-DIMM)', slug: 'laptop-ram', icon: Laptop },
    { name: 'ECC Memory', slug: 'ecc-memory', icon: Server },
  ],
  'storage': [
    { name: 'NVMe SSD', slug: 'nvme-ssd', icon: HardDrive },
    { name: 'SATA SSD', slug: 'sata-ssd', icon: HardDrive },
    { name: 'HDD', slug: 'hdd', icon: HardDrive },
    { name: 'External Storage', slug: 'external-storage', icon: Usb },
    { name: 'NAS Drives', slug: 'nas-drives', icon: Server },
  ],
  'monitors': [
    { name: 'Gaming Monitors', slug: 'gaming-monitors', icon: Tv },
    { name: '4K Monitors', slug: '4k-monitors', icon: Tv },
    { name: 'Ultrawide', slug: 'ultrawide', icon: Monitor },
    { name: 'Office Monitors', slug: 'office-monitors', icon: Monitor },
    { name: 'Monitor Stands', slug: 'monitor-stands', icon: Monitor },
  ],
  'keyboards': [
    { name: 'Mechanical', slug: 'mechanical-keyboards', icon: Keyboard },
    { name: 'Wireless', slug: 'wireless-keyboards', icon: Wifi },
    { name: 'Gaming', slug: 'gaming-keyboards', icon: Gamepad2 },
    { name: 'Ergonomic', slug: 'ergonomic-keyboards', icon: Keyboard },
    { name: 'Keycaps & Accessories', slug: 'keycaps', icon: Keyboard },
  ],
  'mice': [
    { name: 'Gaming Mice', slug: 'gaming-mice', icon: Mouse },
    { name: 'Wireless Mice', slug: 'wireless-mice', icon: Wifi },
    { name: 'Ergonomic Mice', slug: 'ergonomic-mice', icon: Mouse },
    { name: 'Mouse Pads', slug: 'mouse-pads', icon: Layers },
  ],
  'audio': [
    { name: 'Gaming Headsets', slug: 'gaming-headsets', icon: Headphones },
    { name: 'Speakers', slug: 'speakers', icon: Speaker },
    { name: 'Microphones', slug: 'microphones', icon: Mic },
    { name: 'Sound Cards', slug: 'sound-cards', icon: Volume2 },
    { name: 'Earbuds', slug: 'earbuds', icon: Headphones },
  ],
  'networking': [
    { name: 'Routers', slug: 'routers', icon: Router },
    { name: 'Switches', slug: 'switches', icon: Server },
    { name: 'Network Adapters', slug: 'network-adapters', icon: Plug },
    { name: 'Access Points', slug: 'access-points', icon: Wifi },
    { name: 'Network Cables', slug: 'network-cables', icon: Cable },
    { name: 'Modems', slug: 'modems', icon: Radio },
  ],
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLangStore();

  const heroSlides = [
    {
      id: 0,
      badge: t('home.hero.badge'),
      title: t('home.hero.slide1Title'),
      highlight: t('home.hero.slide1Highlight'),
      desc: t('home.hero.slide1Sub'),
      cta: t('home.hero.cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    },
    {
      id: 1,
      badge: t('home.hero.badge'),
      title: t('home.hero.slide2Title'),
      highlight: t('home.hero.slide2Highlight'),
      desc: t('home.hero.slide2Sub'),
      cta: t('home.hero.cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1578286788444-8c1487fcd823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    },
    {
      id: 2,
      badge: t('home.hero.badge'),
      title: t('home.hero.slide3Title'),
      highlight: t('home.hero.slide3Highlight'),
      desc: t('home.hero.slide3Sub'),
      cta: t('home.hero.cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1684127987312-43455fd95925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    },
  ];



  const statsData = [
    { labelKey: 'home.stats.products', value: '500+', icon: Package },
    { labelKey: 'home.stats.customers', value: '12,000+', icon: Users },
    { labelKey: 'home.stats.brands', value: '50+', icon: Award },
    { labelKey: 'home.stats.rating', value: '4.9★', icon: TrendingUp },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?limit=8&sort=newest');
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        setFeaturedProducts(data.slice(0, 8));
      } catch (err) {
        console.error('Error fetching products:', err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/products/categories');
        const data = Array.isArray(response.data) ? response.data : response.data.categories || [];
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleCategoryEnter = (slug) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCategorySlug(slug);
  };

  const handleCategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategorySlug(null);
    }, 250);
  };

  const handleSubcategoryClick = (categoryId) => {
    setHoveredCategorySlug(null);
    navigate(`/products?category=${categoryId}`);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6"
              >
                <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
                <span className="text-orange-400 text-sm font-bold tracking-wide">{slide.badge}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white mb-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1 }}
              >
                {slide.title} <span className="text-orange-500">{slide.highlight}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-300 text-lg mb-8 leading-relaxed"
              >
                {slide.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <Link to={slide.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249,115,22,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors text-base"
                  >
                    {slide.cta} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 hover:border-orange-500/40 transition-all text-base backdrop-blur-sm"
                  >
                    {t('home.hero.ctaSecondary')}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-4 sm:left-6 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-orange-500 w-8' : 'bg-zinc-600 w-3 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 right-6 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-zinc-500 text-xs tracking-widest rotate-90 mb-2">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </section>

      {/* Stats */}
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-orange-400 font-black text-xl">{stat.value}</p>
                    <p className="text-zinc-400 text-sm">{t(stat.labelKey)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Brands ticker */}
      <AnimatedSection className="mt-16 overflow-hidden">
        <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">{t('home.brands')}</p>
        <div className="relative">
          <div className="flex gap-10 animate-[ticker_20s_linear_infinite]" style={{ width: 'max-content' }}>
            {[...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-zinc-600 hover:text-zinc-300 font-black text-lg transition-colors shrink-0 cursor-default">
                {brand}
              </span>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
        </div>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">{t('home.categoriesSub')}</p>
            <h2 className="text-white font-black text-3xl">{t('home.categories')}</h2>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors group">
            {t('home.viewAll')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const subs = subcategoriesMap[category.slug] || [];
            const isHovered = hoveredCategorySlug === category.slug;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative"
                onMouseEnter={() => handleCategoryEnter(category.slug)}
                onMouseLeave={handleCategoryLeave}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className={`block w-full p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? 'border-orange-500 bg-zinc-900 shadow-lg shadow-orange-500/10'
                      : 'border-zinc-800 bg-zinc-900 hover:border-orange-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-sm md:text-base ${
                      isHovered ? 'text-orange-400' : 'text-white'
                    }`}>
                      {category.name}
                    </h3>
                    <ChevronRight
                      size={18}
                      className={`transition-all flex-shrink-0 ${
                        isHovered
                          ? 'text-orange-400 translate-x-1'
                          : 'text-zinc-500'
                      }`}
                    />
                  </div>
                  {category.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">{category.description}</p>
                  )}
                  {subs.length > 0 && (
                    <div className="mt-2 text-xs text-orange-400 font-medium">
                      {subs.length} {t('categories.subcategories')}
                    </div>
                  )}
                </Link>

                {/* Subcategories Dropdown */}
                <AnimatePresence>
                  {isHovered && subs.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 left-0 w-full min-w-[220px] mt-1 bg-zinc-900 border border-orange-500/40 rounded-2xl shadow-2xl shadow-black/50"
                      onMouseEnter={() => handleCategoryEnter(category.slug)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <div className="p-3">
                        <div className="text-xs font-bold text-orange-400 mb-2 px-2 pb-2 border-b border-zinc-800 uppercase tracking-wider">
                          {category.name}
                        </div>
                        <div className="space-y-0.5 max-h-72 overflow-y-auto">
                          {subs.map((sub) => {
                            const Icon = sub.icon;
                            return (
                              <button
                                key={sub.slug}
                                onClick={(e) => { e.preventDefault(); handleSubcategoryClick(category.id); }}
                                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors group/sub text-left"
                              >
                                <Icon className="h-4 w-4 text-zinc-500 group-hover/sub:text-orange-400 transition-colors flex-shrink-0" />
                                <span className="text-sm text-zinc-300 group-hover/sub:text-orange-400 transition-colors">
                                  {sub.name}
                                </span>
                                <ChevronRight className="h-3 w-3 text-zinc-700 group-hover/sub:text-orange-400 ml-auto transition-colors" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">{t('home.featuredSub')}</p>
            <h2 className="text-white font-black text-3xl">{t('home.featured')}</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors group">
            {t('home.viewAll')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-zinc-800 rounded-xl mb-4" />
                <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors text-base"
            >
              {t('home.viewAll')}
            </motion.button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Promo Banners */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-orange-900 p-8 cursor-pointer min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1695480553563-4db8f08781d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" alt="Gaming PC" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <span className="text-orange-200 text-xs font-bold uppercase tracking-widest">{t('home.promoAssemblySub')}</span>
              <h3 className="text-white font-black text-2xl mt-2 mb-2">{t('home.promoAssembly')}</h3>
              <p className="text-orange-100 text-sm">{t('home.promoAssemblySub')}</p>
            </div>
            <Link to="/products">
              <motion.button whileHover={{ x: 4 }} className="relative z-10 flex items-center gap-2 text-white font-bold text-sm group">
                {t('home.promoAssemblyBtn')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-400/20 rounded-full" />
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-300/10 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-8 cursor-pointer min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 opacity-30">
              <img src="https://images.unsplash.com/photo-1643869094356-4dc3f74f22eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" alt="Keyboard" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/80" />
            </div>
            <div className="relative z-10">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">{t('home.promoSale')}</span>
              <h3 className="text-white font-black text-2xl mt-2 mb-2">{t('home.promoSale')}<br /><span className="text-orange-400">{t('home.promoSaleSub')}</span></h3>
              <p className="text-zinc-300 text-sm">{t('home.promoSaleSub')}</p>
            </div>
            <Link to="/products">
              <motion.button whileHover={{ x: 4 }} className="relative z-10 flex items-center gap-2 text-orange-400 font-bold text-sm group">
                {t('home.promoSaleBtn')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{t('home.whyUsSub')}</p>
          <h2 className="text-white font-black text-3xl">{t('home.whyUs')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: t('home.delivery'), desc: t('home.deliverySub') },
            { icon: Shield, title: t('home.warranty'), desc: t('home.warrantySub') },
            { icon: Headphones, title: t('home.support'), desc: t('home.supportSub') },
            { icon: Star, title: t('home.quality'), desc: t('home.qualitySub') },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-6 text-center transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <item.icon className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Banner */}
      <AnimatedSection className="mt-20 mb-20 mx-4 sm:mx-6 lg:mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200" alt="Gaming" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 bg-black/20 rounded-2xl flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-white" fill="white" />
            </motion.div>
            <h2 className="text-white font-black text-3xl sm:text-4xl mb-3">{t('home.cta')}</h2>
            <p className="text-orange-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {t('home.ctaSub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,0,0,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-black hover:bg-zinc-900 text-white font-black rounded-xl transition-colors"
                >
                  {t('home.hero.cta')}
                </motion.button>
              </Link>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl border border-white/40 transition-colors backdrop-blur-sm"
                >
                  {t('home.hero.ctaSecondary')}
                </motion.button>
              </Link>
            </div>
          </div>
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl" />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
