import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Cpu, Sparkles, ShoppingCart, Star, TrendingUp, Clock, Award, Users, Globe, Eye, Grid3X3, Monitor, Laptop, Gamepad2, Layers, HardDrive, Tv, Keyboard, Mouse, Headphones, Wifi } from 'lucide-react';
import api from '../services/api';
import useAuthStore from './store/authStore';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await api.get('/products?limit=4&sort=newest');
      const productsData = Array.isArray(response.data) ? response.data : response.data.products || [];
      setTrendingProducts(productsData.slice(0, 4));
    } catch (error) {
      console.error('Error fetching trending products:', error);
      // Use fallback data if API fails
      setTrendingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      const data = Array.isArray(response.data) ? response.data : response.data.categories || [];
      setDbCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Map category slugs to icons
  const categoryIconMap = {
    'desktops': Monitor,
    'laptops': Laptop,
    'gaming-systems': Gamepad2,
    'processors': Cpu,
    'graphics-cards': Layers,
    'memory-ram': HardDrive,
    'storage': HardDrive,
    'monitors': Tv,
    'keyboards': Keyboard,
    'mice': Mouse,
    'audio': Headphones,
    'networking': Wifi,
  };

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users', color: 'blue' },
    { icon: Award, value: '500+', label: 'Premium Products', color: 'pink' },
    { icon: Globe, value: '50+', label: 'Countries Served', color: 'green' },
    { icon: Clock, value: '24/7', label: 'Support', color: 'yellow' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative border-b border-aliexpress-border bg-aliexpress-black">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Main Text */}
              <div>
                <div className="inline-flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-aliexpress-red" />
                  <span className="badge-secondary">
                    NEW ARRIVALS LIVE
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                  <span className="text-aliexpress-white block">Dominate the</span>
                  <span className="text-aliexpress-red block">competition</span>
                </h1>
                
                <p className="text-lg text-aliexpress-medgray mb-10">
                  Unleash maximum performance with our premium gaming gear, high-end PC components, and cutting-edge accessories built for champions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products" className="btn-primary text-lg py-4 px-8 flex items-center justify-center">
                    POWER UP NOW
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  {!isAuthenticated && (
                    <Link to="/register" className="btn-secondary text-lg py-4 px-8 text-center">
                      JOIN THE ELITE
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column - Featured Product Card */}
              <div className="relative">
                <div className="card shadow-lg shadow-aliexpress-red/20">
                  <div className="relative h-64 mb-6 bg-aliexpress-black border-2 border-aliexpress-red rounded overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <span className="badge">
                        FEATURED
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 text-3xl font-display font-bold text-aliexpress-red">
                      2999₡
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-3 text-aliexpress-white">
                    Neural Interface MK.II
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? 'text-aliexpress-red fill-aliexpress-red'
                              : 'text-aliexpress-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-aliexpress-medgray">4.8 (128 reviews)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-aliexpress-accent font-semibold">IN STOCK</span>
                    <button className="flex items-center px-4 py-2 bg-aliexpress-red text-aliexpress-black rounded hover:bg-aliexpress-darkred transition-colors font-bold">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-aliexpress-darkgray">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <div className="flex items-center mb-2">
                <Grid3X3 className="h-6 w-6 text-aliexpress-red mr-3" />
                <span className="badge-secondary">EXPLORE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-aliexpress-white">
                Browse <span className="text-aliexpress-red">categories</span>
              </h2>
              <p className="text-aliexpress-medgray mt-2">
                Select your weapon of choice — from elite gaming peripherals to high-performance components
              </p>
            </div>
            <Link to="/categories" className="btn-primary mt-4 md:mt-0 flex items-center">
              <Grid3X3 className="h-4 w-4 mr-2" />
              VIEW ALL CATEGORIES
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {dbCategories.map((category) => {
              const Icon = categoryIconMap[category.slug] || Cpu;
              return (
                <Link 
                  key={category.id}
                  to={`/categories`}
                  className="group card hover:shadow-lg hover:shadow-aliexpress-red/20 transition-all hover:-translate-y-1 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-aliexpress-black border-2 border-aliexpress-border group-hover:border-aliexpress-red flex items-center justify-center transition-colors">
                    <Icon className="h-7 w-7 text-aliexpress-red" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-aliexpress-white group-hover:text-aliexpress-red transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-aliexpress-medgray mt-1 line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex items-center justify-center text-aliexpress-accent mt-3 text-xs font-display font-semibold group-hover:text-aliexpress-red transition-colors">
                    BROWSE
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          {dbCategories.length === 0 && (
            <div className="text-center py-10 text-aliexpress-medgray">Loading categories...</div>
          )}
        </div>
      </div>

      {/* Trending Products */}
      <div className="py-16 bg-aliexpress-black border-t border-aliexpress-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-aliexpress-red mr-3" />
                <span className="badge-secondary">
                  TRENDING NOW
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-aliexpress-white">
                Top <span className="text-aliexpress-red">performers</span>
              </h2>
            </div>
            <Link to="/products" className="btn-primary mt-4 md:mt-0">
              VIEW ALL PRODUCTS
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-aliexpress-medgray">Loading trending products...</div>
          ) : trendingProducts.length === 0 ? (
            <div className="py-10 text-center text-aliexpress-medgray">No trending products available right now.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <div key={product.id} className="card group">
                  <div className="relative h-48 mb-4 overflow-hidden rounded bg-aliexpress-black border-2 border-aliexpress-red">
                    <div className="absolute top-3 left-3">
                      <span className="badge-secondary">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-aliexpress-darkgray px-2 py-1 rounded border border-aliexpress-border">
                        <Star className="h-3 w-3 text-aliexpress-red fill-aliexpress-red mr-1" />
                        <span className="text-xs text-aliexpress-white">{product.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 text-2xl font-display font-bold text-aliexpress-red">
                      {product.price}₡
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2 text-aliexpress-white">
                    {product.name}
                  </h3>
                  <p className="text-aliexpress-medgray text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/products/${product.id}`}
                      className="flex items-center text-sm text-aliexpress-white hover:text-aliexpress-red transition-colors font-bold"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      DETAILS
                    </Link>
                    <button className="flex items-center px-3 py-2 bg-aliexpress-red text-aliexpress-black rounded hover:bg-aliexpress-darkred transition-colors text-sm font-bold">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Store Stats */}
      <div className="py-12 bg-aliexpress-darkgray border-t border-aliexpress-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-aliexpress-black border-2 border-aliexpress-red flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-aliexpress-red" />
                  </div>
                  <div className="text-2xl font-display font-bold text-aliexpress-red mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-aliexpress-medgray uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="py-20 bg-aliexpress-black border-t border-aliexpress-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aliexpress-red/10 via-transparent to-aliexpress-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-aliexpress-white">
              Ready to <span className="text-aliexpress-red">level up</span>?
            </h2>
            <p className="text-lg text-aliexpress-medgray mb-10">
              Join thousands of gamers and PC enthusiasts. Browse our premium collection and unleash your full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary text-lg px-10 py-4">
                GEAR UP NOW
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn-secondary text-lg px-10 py-4">
                  JOIN THE ELITE
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
