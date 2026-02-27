import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Zap, Grid3X3, Search, Filter,
  Monitor, Laptop, Gamepad2, Cpu, Layers, HardDrive,
  Tv, Keyboard, Mouse, Headphones, Wifi,
  Router, Cable, Server, Radio, Plug, Usb, 
  Mic, Volume2, Speaker
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

// Subcategories for each main category (keyed by slug)
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const productsRef = useRef(null);
  const cacheRef = useRef({});
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryProducts(selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, searchTerm, sort]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/categories');
      const categoriesData = Array.isArray(response.data) ? response.data : response.data.categories || [];
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setSelectedCategoryId(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = useCallback(async (categoryId) => {
    const cacheKey = `${categoryId}-${searchTerm}-${sort}`;
    if (cacheRef.current[cacheKey]) {
      setCategoryProducts(cacheRef.current[cacheKey]);
      return;
    }
    try {
      setProductsLoading(true);
      const params = { category: categoryId, limit: 100, sort };
      if (searchTerm) params.search = searchTerm;
      const response = await api.get('/products', { params });
      const products = Array.isArray(response.data) ? response.data : response.data.products || [];
      cacheRef.current[cacheKey] = products;
      setCategoryProducts(products);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setCategoryProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [searchTerm, sort]);

  const handleCategoryEnter = (slug) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCategorySlug(slug);
  };

  const handleCategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategorySlug(null);
    }, 250);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setHoveredCategorySlug(null);
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubcategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setHoveredCategorySlug(null);
    navigate(`/products?category=${categoryId}`);
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  if (loading) {
    return (
      <div className="min-h-screen bg-aliexpress-black flex items-center justify-center">
        <div className="animate-pulse text-aliexpress-red font-display text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aliexpress-black">
      {/* Hero Section */}
      <div className="border-b border-aliexpress-border bg-aliexpress-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-aliexpress-red rounded">
              <Zap className="h-6 w-6 text-aliexpress-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-aliexpress-white">
              Browse <span className="text-aliexpress-red">Categories</span>
            </h1>
          </div>
          <p className="text-aliexpress-medgray text-lg">
            Hover over any category to explore subcategories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const subs = subcategoriesMap[category.slug] || [];
            const isHovered = hoveredCategorySlug === category.slug;
            const isSelected = selectedCategoryId === category.id;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryEnter(category.slug)}
                onMouseLeave={handleCategoryLeave}
              >
                {/* Category Card */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full p-5 rounded border-2 transition-all duration-300 cursor-pointer text-left ${
                    isSelected
                      ? 'border-aliexpress-red bg-aliexpress-darkgray shadow-lg shadow-aliexpress-red/20'
                      : 'border-aliexpress-border bg-aliexpress-darkgray hover:border-aliexpress-red'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-display font-bold text-sm md:text-base ${
                      isSelected || isHovered ? 'text-aliexpress-red' : 'text-aliexpress-white'
                    }`}>
                      {category.name}
                    </h3>
                    <ChevronRight
                      size={18}
                      className={`transition-all flex-shrink-0 ${
                        isSelected || isHovered
                          ? 'text-aliexpress-red translate-x-1'
                          : 'text-aliexpress-medgray'
                      }`}
                    />
                  </div>
                  {category.description && (
                    <p className="text-xs text-aliexpress-medgray line-clamp-2">{category.description}</p>
                  )}
                  {subs.length > 0 && (
                    <div className="mt-2 text-xs text-aliexpress-accent font-display font-semibold">
                      {subs.length} subcategories ▾
                    </div>
                  )}
                </button>

                {/* Subcategories Dropdown */}
                {isHovered && subs.length > 0 && (
                  <div
                    className="absolute z-50 left-0 w-full min-w-[220px] mt-1 bg-aliexpress-darkgray border-2 border-aliexpress-red rounded shadow-2xl shadow-aliexpress-red/30"
                    style={{ animation: 'fadeIn 0.15s ease-in' }}
                    onMouseEnter={() => handleCategoryEnter(category.slug)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <div className="p-3">
                      <div className="text-xs font-display font-bold text-aliexpress-red mb-2 px-2 pb-2 border-b border-aliexpress-border uppercase tracking-wider">
                        {category.name}
                      </div>
                      <div className="space-y-0.5 max-h-72 overflow-y-auto">
                        {subs.map((sub) => {
                          const Icon = sub.icon;
                          return (
                            <button
                              key={sub.slug}
                              onClick={() => handleSubcategoryClick(category.id)}
                              className="w-full flex items-center gap-3 px-2 py-2.5 rounded hover:bg-aliexpress-black transition-colors group/sub text-left"
                            >
                              <Icon className="h-4 w-4 text-aliexpress-accent group-hover/sub:text-aliexpress-red transition-colors flex-shrink-0" />
                              <span className="text-sm text-aliexpress-white group-hover/sub:text-aliexpress-red transition-colors">
                                {sub.name}
                              </span>
                              <ChevronRight className="h-3 w-3 text-aliexpress-border group-hover/sub:text-aliexpress-red ml-auto transition-colors" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Products Section */}
        {selectedCategory && (
          <div ref={productsRef}>
            {/* Category Header */}
            <div className="mb-8">
              <div className="bg-aliexpress-darkgray border-l-4 border-aliexpress-red p-6 rounded">
                <h2 className="text-3xl font-display font-bold text-aliexpress-white mb-2">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.description && (
                  <p className="text-aliexpress-medgray">{selectedCategory.description}</p>
                )}
                <p className="text-sm text-aliexpress-red mt-2 font-display font-semibold">
                  {productsLoading ? '...' : categoryProducts.length} PRODUCTS
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-aliexpress-red" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-aliexpress-black border border-aliexpress-border rounded text-aliexpress-white placeholder-aliexpress-medgray focus:outline-none focus:border-aliexpress-red focus:ring-1 focus:ring-aliexpress-red/30 font-display"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-aliexpress-red" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2.5 bg-aliexpress-black border border-aliexpress-border rounded text-aliexpress-white focus:outline-none focus:border-aliexpress-red focus:ring-1 focus:ring-aliexpress-red/30 font-display cursor-pointer"
                >
                  <option value="newest">SORT: NEWEST</option>
                  <option value="price_asc">PRICE: LOW TO HIGH</option>
                  <option value="price_desc">PRICE: HIGH TO LOW</option>
                  <option value="rating">RATING</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-aliexpress-red border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-aliexpress-medgray font-display">Loading products...</p>
              </div>
            ) : categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3X3 size={48} className="mx-auto text-aliexpress-border mb-4" />
                <p className="text-aliexpress-medgray text-lg font-display">No products in this category</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="mt-4 btn-primary">
                    CLEAR SEARCH
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
