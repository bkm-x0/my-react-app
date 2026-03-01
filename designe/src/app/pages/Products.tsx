import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  SlidersHorizontal, Grid3X3, List, Search, X,
  ChevronDown, ChevronUp, Star, Filter
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, categories, subcategories } from '../data/products';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Mashhurlik bo\'yicha' },
  { value: 'price-asc', label: 'Narx: Pastdan yuqoriga' },
  { value: 'price-desc', label: 'Narx: Yuqoridan pastga' },
  { value: 'rating', label: 'Reyting bo\'yicha' },
  { value: 'newest', label: 'Yangi' },
];

const PRICE_RANGES = [
  { label: 'Barchasi', min: 0, max: Infinity },
  { label: '500,000 so\'mgacha', min: 0, max: 500000 },
  { label: '500K – 1M so\'m', min: 500000, max: 1000000 },
  { label: '1M – 3M so\'m', min: 1000000, max: 3000000 },
  { label: '3M – 10M so\'m', min: 3000000, max: 10000000 },
  { label: '10M so\'mdan yuqori', min: 10000000, max: Infinity },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'barchasi');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('sub') || '');
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ category: true, subcategory: true, price: true, rating: true });

  useEffect(() => {
    const cat = searchParams.get('cat');
    const sub = searchParams.get('sub');
    const search = searchParams.get('search');
    const badge = searchParams.get('badge');
    if (cat) setSelectedCategory(cat);
    if (sub) setSelectedSubcategory(sub);
    if (search) setSearchQuery(search);
    if (badge) setSortBy('price-asc');
  }, [searchParams]);

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections(s => ({ ...s, [key]: !s[key] }));
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Badge filter
    const badge = searchParams.get('badge');
    if (badge === 'chegirma') {
      result = result.filter(p => p.originalPrice);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category
    if (selectedCategory && selectedCategory !== 'barchasi') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Subcategory
    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    // Price
    const range = PRICE_RANGES[priceRange];
    result = result.filter(p => p.price >= range.min && p.price <= range.max);

    // Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      default: result.sort((a, b) => b.reviews - a.reviews); break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSubcategory, priceRange, minRating, sortBy, searchParams]);

  const availableSubcats = selectedCategory !== 'barchasi' ? subcategories[selectedCategory] || [] : [];

  const clearFilters = () => {
    setSelectedCategory('barchasi');
    setSelectedSubcategory('');
    setPriceRange(0);
    setMinRating(0);
    setSearchQuery('');
  };

  const hasFilters = selectedCategory !== 'barchasi' || selectedSubcategory || priceRange > 0 || minRating > 0 || searchQuery;

  const SidebarContent = () => (
    <div className="space-y-1">
      {/* Clear filters */}
      {hasFilters && (
        <motion.button
          onClick={clearFilters}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mb-3"
        >
          <X className="w-4 h-4" /> Filtrlarni tozalash
        </motion.button>
      )}

      {/* Categories */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
        >
          Kategoriya {expandedSections.category ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>
        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(''); }}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-orange-500 text-black font-bold'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subcategories */}
      {availableSubcats.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('subcategory')}
            className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
          >
            Kichik kategoriya {expandedSections.subcategory ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>
          <AnimatePresence>
            {expandedSections.subcategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      !selectedSubcategory ? 'bg-orange-500 text-black font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    Barchasi
                  </button>
                  {availableSubcats.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        selectedSubcategory === sub.id ? 'bg-orange-500 text-black font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Price Range */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
        >
          Narx oralig'i {expandedSections.price ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1">
                {PRICE_RANGES.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      priceRange === i ? 'bg-orange-500 text-black font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
        >
          Minimal reyting {expandedSections.rating ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1">
                {[0, 4, 4.5, 4.7, 4.9].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      minRating === r ? 'bg-orange-500 text-black font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {r === 0 ? (
                      'Barchasi'
                    ) : (
                      <>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= r ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`} />
                          ))}
                        </div>
                        <span>{r}+</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-white font-black text-2xl sm:text-3xl">Barcha Mahsulotlar</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {filteredProducts.length} ta mahsulot topildi
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500 w-48"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-xl hover:border-orange-500/40 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtr
                {hasFilters && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {selectedCategory !== 'barchasi' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded-xl">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('barchasi')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded-xl">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded-xl">
                  {PRICE_RANGES[priceRange].label}
                  <button onClick={() => setPriceRange(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded-xl">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                <span className="text-white font-bold text-sm">Filtrlar</span>
              </div>
              <SidebarContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-zinc-400 text-lg mb-2">Mahsulot topilmadi</p>
                <p className="text-zinc-600 text-sm mb-6">Filtrlarni o'zgartiring yoki boshqacha qidiring</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-colors"
                >
                  Filtrlarni tozalash
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${selectedCategory}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-3'
                  }
                >
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 overflow-y-auto p-4 lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold">Filtrlar</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
