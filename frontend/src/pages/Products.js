import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, Grid3X3, List, Search, X,
  ChevronDown, ChevronUp, Star, Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import useLangStore from './store/langStore';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { t } = useLangStore();

  const SORT_OPTIONS = [
    { value: 'popular', label: t('products.popular') },
    { value: 'price-asc', label: t('products.priceLow') },
    { value: 'price-desc', label: t('products.priceHigh') },
    { value: 'rating', label: t('products.topRated') },
    { value: 'newest', label: t('products.newest') },
  ];

  const PRICE_RANGES = [
    { label: t('products.all'), min: 0, max: Infinity },
    { label: '$100', min: 0, max: 100 },
    { label: '$100 – $500', min: 100, max: 500 },
    { label: '$500 – $1000', min: 500, max: 1000 },
    { label: '$1000 – $5000', min: 1000, max: 5000 },
    { label: '$5000+', min: 5000, max: Infinity },
  ];

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ category: true, price: true, rating: true });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productAPI.getCategories();
        const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50, sort: sortBy === 'newest' ? 'newest' : sortBy === 'price-asc' ? 'price_asc' : sortBy === 'price-desc' ? 'price_desc' : 'newest' };
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const range = PRICE_RANGES[priceRange];
      if (range.min > 0) params.minPrice = range.min;
      if (range.max < Infinity) params.maxPrice = range.max;
      if (minRating > 0) params.minRating = minRating;

      const res = await productAPI.getProducts(params);
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, searchQuery, priceRange, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const search = params.get('search');
    if (cat && cat !== selectedCategory) setSelectedCategory(cat);
    if (search && search !== searchQuery) setSearchQuery(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const toggleSection = (key) => {
    setExpandedSections(s => ({ ...s, [key]: !s[key] }));
  };

  // Client-side sort for rating/popular
  const sortedProducts = useMemo(() => {
    let result = [...products];
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || b.average_rating || 0) - (a.rating || a.average_rating || 0)); break;
      default: break;
    }
    return result;
  }, [products, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange(0);
    setMinRating(0);
    setSearchQuery('');
    navigate('/products');
  };

  const hasFilters = selectedCategory !== 'all' || priceRange > 0 || minRating > 0 || searchQuery;

  const allCategories = [{ id: 'all', name: t('products.allCategories'), slug: 'all' }, ...categories];

  const SidebarContent = () => (
    <div className="space-y-1">
      {hasFilters && (
        <motion.button
          onClick={clearFilters}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mb-3"
        >
          <X className="w-4 h-4" /> {t('products.clearAll')}
        </motion.button>
      )}

      {/* Categories */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
        >
          {t('products.category')} {expandedSections.category ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
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
                {allCategories.map(cat => (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(cat.slug || cat.id?.toString() || 'all')}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      selectedCategory === (cat.slug || cat.id?.toString())
                        ? 'bg-orange-500 text-black font-bold'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 text-white font-bold text-sm"
        >
          {t('products.priceRange')} {expandedSections.price ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
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
          {t('products.rating')} {expandedSections.rating ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
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
                      t('products.all')
                    ) : (
                      <>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
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
              <h1 className="text-white font-black text-2xl sm:text-3xl">{t('products.title')}</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {sortedProducts.length} {t('products.results')}
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500 w-48"
                />
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

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

              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-xl hover:border-orange-500/40 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {t('products.filterMobile')}
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
              {selectedCategory !== 'all' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded-xl">
                  {allCategories.find(c => (c.slug || c.id?.toString()) === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
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
                <span className="text-white font-bold text-sm">{t('products.filters')}</span>
              </div>
              <SidebarContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse">
                    <div className="aspect-square bg-zinc-800 rounded-xl mb-4" />
                    <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-zinc-400 text-lg mb-2">{t('products.noProducts')}</p>
                <p className="text-zinc-600 text-sm mb-6">{t('products.noProductsSub')}</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-colors"
                >
                  {t('products.clearAll')}
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
                  {sortedProducts.map((product, i) => (
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
                  <span className="text-white font-bold">{t('products.filters')}</span>
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
};

export default Products;
