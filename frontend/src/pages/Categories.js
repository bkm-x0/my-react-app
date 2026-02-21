import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Grid3X3, Search, Filter } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryProducts(selectedCategoryId);
    }
  }, [selectedCategoryId, searchTerm, sort]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products/categories');
      const categoriesData = Array.isArray(response.data) ? response.data : response.data.categories || [];
      setCategories(categoriesData);
      
      // Set first category as selected by default
      if (categoriesData.length > 0) {
        setSelectedCategoryId(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryId) => {
    try {
      const params = {
        category: categoryId,
        limit: 100,
        sort
      };
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('http://localhost:5000/api/products', { params });
      const products = Array.isArray(response.data) ? response.data : response.data.products || [];
      setCategoryProducts(products);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setCategoryProducts([]);
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-cyan-900 to-cyber-black border-b border-cyan-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={24} className="text-cyan-400" />
            <h1 className="text-5xl font-bold text-cyan-400 glow">الفئات</h1>
          </div>
          <p className="text-gray-300 text-lg">استكشف جميع فئات المنتجات المتقدمة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 group cursor-pointer ${
                selectedCategoryId === category.id
                  ? 'border-cyan-400 bg-cyan-900 bg-opacity-30 shadow-lg shadow-cyan-500'
                  : 'border-gray-600 bg-gray-900 hover:border-cyan-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  {category.icon && (
                    <div className="text-3xl mb-2">{category.icon}</div>
                  )}
                  <h3 className="font-bold text-left">{category.name}</h3>
                </div>
                <ChevronRight
                  size={20}
                  className={`transition-all ${
                    selectedCategoryId === category.id
                      ? 'text-cyan-400 translate-x-2'
                      : 'text-gray-500 group-hover:text-cyan-400'
                  }`}
                />
              </div>
              {category.description && (
                <p className="text-xs text-gray-400 text-left">{category.description}</p>
              )}
            </button>
          ))}
        </div>

        {/* Products Section */}
        {selectedCategory && (
          <>
            {/* Category Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-cyan-900 to-transparent border-l-4 border-cyan-400 p-6 rounded">
                <h2 className="text-3xl font-bold text-cyan-400 mb-2">{selectedCategory.name}</h2>
                {selectedCategory.description && (
                  <p className="text-gray-300">{selectedCategory.description}</p>
                )}
                <p className="text-sm text-cyan-300 mt-2">عدد المنتجات: {categoryProducts.length}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-cyan-500" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-cyan-500 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-cyan-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-cyan-500 rounded text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price_asc">السعر: الأقل إلى الأعلى</option>
                  <option value="price_desc">السعر: الأعلى إلى الأقل</option>
                  <option value="rating">التقييم الأعلى</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3X3 size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">لا توجد منتجات في هذه الفئة</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition"
                  >
                    حذف البحث
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
