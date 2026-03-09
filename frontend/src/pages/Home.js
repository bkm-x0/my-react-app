import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, Truck, Headphones,
  Star, ChevronRight, ChevronDown, TrendingUp, Award, Users, Package,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import useLangStore from './store/langStore';

const brands = [
  'ASUS ROG', 'MSI', 'Corsair', 'Razer', 'Logitech',
  'HyperX', 'SteelSeries', 'NZXT', 'Lian Li', 'Samsung',
  'NVIDIA', 'AMD', 'Intel',
];

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
  const [showBrands, setShowBrands] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const { t } = useLangStore();

  const touchStartX = useRef(null);

  const prevSlide = () => setCurrentSlide(s => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide(s => (s + 1) % heroSlides.length);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) nextSlide();
    else if (delta > 50) prevSlide();
    touchStartX.current = null;
  };

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

  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPanEnd={(e, info) => {
          if (info.offset.x < -50) nextSlide();
          else if (info.offset.x > 50) prevSlide();
        }}
      >
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

          <div className="absolute bottom-8 left-4 sm:left-6 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
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
      </motion.section>

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

      {/* Brands Section — ticker + expandable grid */}
      <AnimatedSection className="mt-16">
        {/* Clickable ticker bar */}
        <button
          onClick={() => setShowBrands(s => !s)}
          aria-expanded={showBrands}
          className="w-full group focus:outline-none"
        >
          <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6 group-hover:text-orange-400 transition-colors">
            {t('home.brands') || 'Our Brands'}
          </p>
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setTickerPaused(true)}
            onMouseLeave={() => setTickerPaused(false)}
          >
            <div
              className="flex gap-10"
              style={{
                width: 'max-content',
                animation: 'ticker 20s linear infinite',
                animationPlayState: tickerPaused ? 'paused' : 'running',
              }}
            >
              {[...brands, ...brands].map((brand, i) => (
                <span
                  key={i}
                  className="text-zinc-500 group-hover:text-zinc-300 font-black text-lg transition-colors shrink-0"
                >
                  {brand}
                </span>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
          </div>

          {/* Expand indicator */}
          <div className="flex justify-center mt-5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-zinc-700 group-hover:border-orange-500/50 text-zinc-400 group-hover:text-orange-400 text-xs font-bold transition-all">
              {showBrands ? 'Hide Brands' : 'View All Brands'}
              <motion.span
                animate={{ rotate: showBrands ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="inline-flex"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </span>
          </div>
        </button>

        {/* Expandable brands grid */}
        <AnimatePresence>
          {showBrands && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {brands.map((brand, i) => (
                    <motion.div
                      key={brand}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={`/products?search=${encodeURIComponent(brand)}`}
                        onClick={() => setShowBrands(false)}
                      >
                        <motion.div
                          whileHover={{ y: -4, boxShadow: '0 0 20px rgba(249,115,22,0.12)' }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl p-5 text-center cursor-pointer transition-colors duration-300 group"
                        >
                          <div className="w-10 h-10 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                            <Award className="w-5 h-5 text-orange-400" />
                          </div>
                          <p className="text-zinc-300 group-hover:text-orange-400 font-bold text-sm transition-colors">
                            {brand}
                          </p>
                          <p className="text-zinc-600 group-hover:text-orange-500/60 text-xs mt-1 transition-colors flex items-center justify-center gap-0.5">
                            View products <ChevronRight className="w-3 h-3" />
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
