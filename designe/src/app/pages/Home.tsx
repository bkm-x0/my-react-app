import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Zap, Shield, Truck, Headphones,
  Star, ChevronRight, TrendingUp, Award, Users, Package
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { featuredProducts } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const heroSlides = [
  {
    id: 0,
    title: "Gaming Kompyuterlar",
    subtitle: "Eng yuqori unumdorlik",
    desc: "K PC Store — O'zbekistondagi eng yaxshi gaming do'koni. Professional darajadagi komponentlar va qurilmalar.",
    cta: "Hozir xarid qiling",
    ctaLink: "/products?cat=kompyuterlar",
    image: "https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "orange",
  },
  {
    id: 1,
    title: "RTX 4090 Videokarta",
    subtitle: "Eng kuchli GPU",
    desc: "NVIDIA RTX 4090 — 4K va 8K gaming uchun mo'ljallangan eng kuchli videokarta. Chegirmali narxda!",
    cta: "Ko'proq ma'lumot",
    ctaLink: "/products?cat=komponentlar",
    image: "https://images.unsplash.com/photo-1578286788444-8c1487fcd823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "orange",
  },
  {
    id: 2,
    title: "Gaming Noutbuklar",
    subtitle: "Istalgan joyda o'yna",
    desc: "ASUS ROG, MSI, Lenovo Legion — eng yaxshi gaming noutbuklar eng qulay narxlarda sizni kutmoqda.",
    cta: "Noutbuklarni ko'rish",
    ctaLink: "/products?cat=noutbuklar",
    image: "https://images.unsplash.com/photo-1684127987312-43455fd95925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "orange",
  },
];

const categoryCards = [
  { name: 'Gaming PC', icon: '🖥️', desc: 'Tayyor gaming kompyuterlar', path: '/products?cat=kompyuterlar', color: 'from-orange-500/20 to-transparent' },
  { name: 'Noutbuklar', icon: '💻', desc: 'ROG, Legion, MSI noutbuklar', path: '/products?cat=noutbuklar', color: 'from-blue-500/20 to-transparent' },
  { name: 'Videokartallar', icon: '🎮', desc: 'RTX 4090, RX 7900 XTX', path: '/products?cat=komponentlar', color: 'from-purple-500/20 to-transparent' },
  { name: 'Klaviaturalar', icon: '⌨️', desc: 'Mexanik RGB klaviaturalar', path: '/products?sub=klaviaturalar', color: 'from-green-500/20 to-transparent' },
  { name: 'Sichqonchalar', icon: '🖱️', desc: 'Gaming mice top brendlar', path: '/products?sub=sichqonchalar', color: 'from-red-500/20 to-transparent' },
  { name: 'Monitorlar', icon: '🖥️', desc: '1440p, 4K, 165Hz+ monitorlar', path: '/products?sub=monitorlar', color: 'from-cyan-500/20 to-transparent' },
  { name: 'Naushniklar', icon: '🎧', desc: 'Gaming headsets, simsiz', path: '/products?sub=naushniklar', color: 'from-yellow-500/20 to-transparent' },
  { name: 'Komponentlar', icon: '🔧', desc: 'CPU, RAM, SSD, korpuslar', path: '/products?cat=komponentlar', color: 'from-pink-500/20 to-transparent' },
];

const brands = ['ASUS ROG', 'MSI', 'Corsair', 'Razer', 'Logitech', 'HyperX', 'SteelSeries', 'NZXT', 'Lian Li', 'Samsung', 'NVIDIA', 'AMD', 'Intel'];

const stats = [
  { label: "Mahsulotlar", value: "500+", icon: Package },
  { label: "Mijozlar", value: "12,000+", icon: Users },
  { label: "Brendlar", value: "50+", icon: Award },
  { label: "Baholash", value: "4.9★", icon: TrendingUp },
];

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={slide.image}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Orange glow effect */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
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
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6"
              >
                <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
                <span className="text-orange-400 text-sm font-bold tracking-wide">{slide.subtitle}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white mb-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1 }}
              >
                {slide.title.split(' ').map((word, i) => (
                  <span key={i}>
                    {i === 0 ? (
                      <span className="text-orange-500">{word} </span>
                    ) : (
                      word + ' '
                    )}
                  </span>
                ))}
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
                    {slide.cta}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 hover:border-orange-500/40 transition-all text-base backdrop-blur-sm"
                  >
                    Barcha mahsulotlar
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
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

        {/* Scroll indicator */}
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
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-orange-400 font-black text-xl">{stat.value}</p>
                  <p className="text-zinc-400 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brands ticker */}
      <AnimatedSection className="mt-16 overflow-hidden">
        <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Hamkor brendlar</p>
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
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Kategoriyalar</p>
            <h2 className="text-white font-black text-3xl">Xarid qiling</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors group">
            Barchasi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryCards.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <Link
                to={cat.path}
                className={`block bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl p-5 transition-all duration-300 bg-gradient-to-br ${cat.color}`}
                style={{ backgroundOrigin: 'border-box' }}
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="text-white font-bold text-sm mb-1">{cat.name}</h3>
                <p className="text-zinc-400 text-xs">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Tavsiya etiladi</p>
            <h2 className="text-white font-black text-3xl">Eng Mashhur Mahsulotlar</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors group">
            Barchasi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
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
        <div className="text-center mt-10">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(249,115,22,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl transition-colors text-base"
            >
              Barcha mahsulotlarni ko'rish
            </motion.button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Promo Banners */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Banner 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-orange-900 p-8 cursor-pointer min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 opacity-20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1695480553563-4db8f08781d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Gaming PC"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <span className="text-orange-200 text-xs font-bold uppercase tracking-widest">Maxsus taklif</span>
              <h3 className="text-white font-black text-2xl mt-2 mb-2">Gaming PC<br />yig'ish xizmati</h3>
              <p className="text-orange-100 text-sm">Mutaxassislarimiz siz uchun ideal PC yig'ib beradi</p>
            </div>
            <Link to="/products?cat=kompyuterlar">
              <motion.button
                whileHover={{ x: 4 }}
                className="relative z-10 flex items-center gap-2 text-white font-bold text-sm group"
              >
                Batafsil <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-400/20 rounded-full" />
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-300/10 rounded-full" />
          </motion.div>

          {/* Banner 2 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-8 cursor-pointer min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 opacity-30">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1643869094356-4dc3f74f22eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Keyboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/80" />
            </div>
            <div className="relative z-10">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Chegirma</span>
              <h3 className="text-white font-black text-2xl mt-2 mb-2">Aksessuarlar<br /><span className="text-orange-400">-30% chegirma!</span></h3>
              <p className="text-zinc-300 text-sm">Sichqoncha, klaviatura va headsetlarda katta chegirmalar</p>
            </div>
            <Link to="/products?cat=aksessuarlar">
              <motion.button
                whileHover={{ x: 4 }}
                className="relative z-10 flex items-center gap-2 text-orange-400 font-bold text-sm group"
              >
                Xarid qilish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Afzalliklarimiz</p>
          <h2 className="text-white font-black text-3xl">Nima uchun K PC Store?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Tezkor yetkazib berish', desc: 'Toshkent bo\'ylab 24 soat ichida yetkazib beramiz' },
            { icon: Shield, title: 'Kafolat', desc: 'Barcha mahsulotlarga 1-3 yil rasmiy kafolat' },
            { icon: Headphones, title: '24/7 Qo\'llab-quvvatlash', desc: 'Har doim yordam berish uchun tayyormiz' },
            { icon: Star, title: 'Yuqori sifat', desc: 'Faqat original va sertifikatlangan mahsulotlar' },
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
      <AnimatedSection className="mt-20 mx-4 sm:mx-6 lg:mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
              alt="Gaming"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 bg-black/20 rounded-2xl flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-white" fill="white" />
            </motion.div>
            <h2 className="text-white font-black text-3xl sm:text-4xl mb-3">Gaming PC yig'ish uchun biz bilan bog'laning!</h2>
            <p className="text-orange-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Byudjetingizga va ehtiyojlaringizga mos ideal PC yig'ib berish xizmatimizdan foydalaning
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products?cat=kompyuterlar">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,0,0,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-black hover:bg-zinc-900 text-white font-black rounded-xl transition-colors"
                >
                  Gaming PClar
                </motion.button>
              </Link>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl border border-white/40 transition-colors backdrop-blur-sm"
                >
                  Barcha mahsulotlar
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
}
