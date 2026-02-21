import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Star, ShoppingCart, Eye, Search } from 'lucide-react';
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
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory; // send slug or id
      if (searchTerm) params.search = searchTerm;

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
  }, [page, limit, selectedCategory, searchTerm, sort]);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-orbitron font-bold mb-4">
          <span className="text-cyber-muted-blue">PRODUCT</span>
          <span className="text-cyber-muted-pink"> DATABASE</span>
        </h1>
        <p className="text-gray-300 text-lg font-rajdhani max-w-3xl mx-auto">
          Access the most advanced cybernetic technology and quantum hardware. Filter by category or use the search to find specific augmentations.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 bg-cyber-gray/50 border border-cyber-muted-blue/30 rounded-lg">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Filter className="h-5 w-5 text-cyber-muted-blue" />
          <span className="font-orbitron font-bold text-lg">FILTERS</span>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none mr-4">
            <input
              aria-label="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="cyber-input w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>

          <div className="flex border border-cyber-muted-purple rounded-lg overflow-hidden">
            <button 
              onClick={() => { setViewMode('grid'); pushViewToUrl('grid'); }}
              className={`p-2 ${viewMode === 'grid' ? 'bg-cyber-muted-purple text-cyber-black' : 'text-cyber-muted-purple'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button 
              onClick={() => { setViewMode('list'); pushViewToUrl('list'); }}
              className={`p-2 ${viewMode === 'list' ? 'bg-cyber-muted-purple text-cyber-black' : 'text-cyber-muted-purple'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cyber-input w-48"
          >
            <option value="newest">SORT: NEWEST</option>
            <option value="price_asc">PRICE: LOW TO HIGH</option>
            <option value="price_desc">PRICE: HIGH TO LOW</option>
            <option value="rating">RATING</option>
            <option value="featured">FEATURED</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-blue">CATEGORIES</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.slug || category.id}
              onClick={() => setSelectedCategory(category.slug || category.id)}
              className={`px-4 py-2 border font-orbitron font-bold transition-all ${
                selectedCategory === (category.slug || category.id)
                  ? `bg-cyber-neon-${category.color} text-cyber-black border-cyber-neon-${category.color}`
                  : `border-cyber-neon-${category.color} text-cyber-neon-${category.color} hover:bg-cyber-neon-${category.color} hover:text-cyber-black`
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">جارٍ التحميل...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-20">{error}</div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} view="list" />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors font-orbitron"
            disabled={page === 1}
          >
            PREV
          </button>

          {Array.from({ length: pages }).map((_, idx) => {
            const num = idx + 1;
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 border font-orbitron font-bold ${
                  num === page
                    ? 'bg-cyber-muted-blue text-cyber-black border-cyber-muted-blue'
                    : 'border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple hover:text-cyber-black'
                }`}
              >
                {num}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors font-orbitron"
            disabled={page === pages}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
