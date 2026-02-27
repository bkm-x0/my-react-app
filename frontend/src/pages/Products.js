import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Search, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([{ id: 'all', name: 'ALL PRODUCTS', slug: 'all', color: 'blue' }]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Sync component state from URL query params so direct links work (e.g. ?page=2&view=list)
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const p = parseInt(params.get('page') || '1', 10);
      if (!Number.isNaN(p) && p > 0 && p !== page) setPage(p);

      const v = params.get('view') || 'grid';
      if (v && v !== viewMode) setViewMode(v);

      const cat = params.get('category');
      if (cat && cat !== selectedCategory) setSelectedCategory(cat);

      const s = params.get('search') || '';
      if (s !== searchTerm) setSearchTerm(s);

      const so = params.get('sort') || 'newest';
      if (so !== sort) setSort(so);

      const pr = params.get('price') || '';
      if (pr !== priceRange) setPriceRange(pr);

      const rt = params.get('rating') || '';
      if (rt !== minRating) setMinRating(rt);

      const st = params.get('stock') || '';
      if (st !== stockFilter) setStockFilter(st);
    } catch (err) {
      // defensive: don't break the page if malformed query string
      console.warn('Could not parse URL query params for Products page', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const pushViewToUrl = (view) => {
    const params = new URLSearchParams(location.search);
    params.set('view', view);
    if (!params.get('page')) params.set('page', String(page || 1));
    navigate(`/products?${params.toString()}`);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await productAPI.getCategories();
      const remote = Array.isArray(res.data) ? res.data : res.data.categories || [];
      setCategories((prev) => [prev[0], ...remote.map(c => ({ id: c.id, name: String(c.name || '').toUpperCase(), slug: c.slug, color: c.color || 'blue' }))]);
    } catch (err) {
      // keep defaults on error
      console.error('Could not load categories', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sort,
      };
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      // Price range filter
      if (priceRange) {
        switch (priceRange) {
          case 'under-1000': params.maxPrice = 1000; break;
          case '1000-5000': params.minPrice = 1000; params.maxPrice = 5000; break;
          case '5000-10000': params.minPrice = 5000; params.maxPrice = 10000; break;
          case 'over-10000': params.minPrice = 10000; break;
          default: break;
        }
      }

      // Rating filter
      if (minRating) params.rating = minRating;

      // Stock filter
      if (stockFilter) params.stock = stockFilter;

      const res = await productAPI.getProducts(params);
      const data = res.data || {};
      setProducts(Array.isArray(data.products) ? data.products : data);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      setError('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCategory, searchTerm, sort, priceRange, minRating, stockFilter]);

  // initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // refetch when filters change
  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => fetchProducts(), 200); // small debounce for UX
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-aliexpress-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-aliexpress-white">
            Products <span className="text-aliexpress-red">catalog</span>
          </h1>
          <p className="text-aliexpress-medgray text-lg max-w-3xl mx-auto">
            Browse and filter products easily using search, categories, and sorting options.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-10 p-6 bg-aliexpress-darkgray border border-aliexpress-border rounded">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-aliexpress-red rounded">
                <Filter className="h-5 w-5 text-aliexpress-black" />
              </div>
              <span className="font-display font-bold text-lg text-aliexpress-white">
                Filters
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none w-full sm:w-80">
                <input
                  aria-label="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-5 py-3 pl-12 bg-aliexpress-black border border-aliexpress-border rounded focus:border-aliexpress-red focus:ring-1 focus:ring-aliexpress-red/30 transition-all outline-none font-medium text-aliexpress-white placeholder:text-aliexpress-medgray"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aliexpress-medgray h-5 w-5" />
              </div>

              <div className="flex border border-aliexpress-border rounded overflow-hidden bg-aliexpress-black">
                <button 
                  onClick={() => { setViewMode('grid'); pushViewToUrl('grid'); }}
                  className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-aliexpress-red text-aliexpress-black' : 'text-aliexpress-white hover:bg-aliexpress-darkgray'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => { setViewMode('list'); pushViewToUrl('list'); }}
                  className={`p-3 transition-all ${viewMode === 'list' ? 'bg-aliexpress-red text-aliexpress-black' : 'text-aliexpress-white hover:bg-aliexpress-darkgray'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-52 px-4 py-3 bg-aliexpress-black border border-aliexpress-border rounded focus:border-aliexpress-red transition-all outline-none font-display font-semibold text-aliexpress-white cursor-pointer"
              >
                <option value="newest">SORT: NEWEST</option>
                <option value="price_asc">PRICE: LOW TO HIGH</option>
                <option value="price_desc">PRICE: HIGH TO LOW</option>
                <option value="rating">RATING</option>
                <option value="featured">FEATURED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold mb-4 text-aliexpress-white">
            Browse <span className="text-aliexpress-red">categories</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.slug || category.id}
                onClick={() => setSelectedCategory(category.slug || category.id)}
                className={`px-5 py-2.5 rounded font-display font-semibold text-sm transition-all ${
                  selectedCategory === (category.slug || category.id)
                    ? 'bg-aliexpress-red text-aliexpress-black'
                    : 'bg-aliexpress-darkgray border border-aliexpress-border text-aliexpress-white hover:border-aliexpress-red hover:text-aliexpress-red'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-20 text-aliexpress-medgray font-display">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-aliexpress-darkgray border border-aliexpress-red/50 rounded">
              <AlertCircle className="h-12 w-12 text-aliexpress-red" />
              <p className="text-lg font-semibold text-aliexpress-red">{error}</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-aliexpress-medgray font-display">No products found.</div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} view="list" />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-darkgray transition-colors font-display text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              PREV
            </button>

            {Array.from({ length: pages }).map((_, idx) => {
              const num = idx + 1;
              if (num === 1 || num === pages || Math.abs(num - page) <= 1) {
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`min-w-[40px] px-3 py-2 border font-display font-bold text-sm transition-all ${
                      num === page
                        ? 'bg-aliexpress-red text-aliexpress-black border-aliexpress-red'
                        : 'border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-darkgray'
                    }`}
                  >
                    {num}
                  </button>
                );
              } else if (num === page - 2 || num === page + 2) {
                return <span key={num} className="px-2 text-aliexpress-medgray">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-4 py-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-darkgray transition-colors font-display text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={page === pages}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
