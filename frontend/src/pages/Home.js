import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Cpu, Sparkles, ShoppingCart, Star, TrendingUp, Clock, Award, Users, Globe } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?limit=4&sort=newest');
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

  const featuredCategories = [
    {
      id: 1,
      name: 'Neural Interfaces',
      description: 'Direct brain-computer connections',
      products: 24,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800',
      icon: Cpu,
      color: 'pink'
    },
    {
      id: 2,
      name: 'Cybernetic Limbs',
      description: 'Advanced prosthetics & enhancements',
      products: 18,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800',
      icon: Zap,
      color: 'blue'
    },
    {
      id: 3,
      name: 'Quantum Hardware',
      description: 'Next-gen computing technology',
      products: 32,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800',
      icon: Shield,
      color: 'green'
    },
    {
      id: 4,
      name: 'Holographic Tech',
      description: 'Immersive display systems',
      products: 15,
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800',
      icon: Sparkles,
      color: 'purple'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users', color: 'blue' },
    { icon: Award, value: '500+', label: 'Premium Products', color: 'pink' },
    { icon: Globe, value: '50+', label: 'Countries Served', color: 'green' },
    { icon: Clock, value: '24/7', label: 'Support', color: 'yellow' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden border-b border-cyber-muted-blue/30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-muted-pink/10 via-transparent to-cyber-muted-blue/10"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(157,0,255,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Main Text */}
              <div>
                <div className="inline-flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-cyber-muted-taupe animate-pulse-neon" />
                  <span className="cyber-badge border-cyber-muted-pink text-cyber-muted-pink">
                    NEW ARRIVALS LIVE
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
                  <span className="text-cyber-muted-blue block">UPGRADE YOUR</span>
                  <span className="text-cyber-muted-pink glitch-text" data-text="REALITY">REALITY</span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-10 font-rajdhani">
                  Access the world's most advanced cybernetic technology. From neural interfaces to quantum processors, 
                  we provide cutting-edge solutions for the future of humanity.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products" className="cyber-button text-lg py-4 px-8 flex items-center justify-center">
                    EXPLORE STORE
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/register" className="cyber-button cyber-button-secondary text-lg py-4 px-8">
                    JOIN THE NETWORK
                  </Link>
                </div>
              </div>

              {/* Right Column - Featured Product Card */}
              <div className="relative">
                <div className="cyber-card transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="relative h-64 mb-6 bg-gradient-to-br from-cyber-muted-blue/20 to-cyber-muted-pink/20 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-cyber-dark/50"></div>
                    <div className="absolute top-4 left-4">
                      <span className="cyber-badge border-cyber-muted-green text-cyber-muted-green">
                        FEATURED
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 text-3xl font-orbitron font-bold text-cyber-muted-green">
                      2999₡
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-orbitron font-bold mb-3 text-cyber-muted-blue">
                    Neural Interface MK.II
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? 'text-cyber-muted-taupe fill-cyber-muted-taupe'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-rajdhani">4.8 (128 reviews)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-muted-green font-mono">IN STOCK</span>
                    <button className="flex items-center px-4 py-2 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 border border-cyber-muted-purple rounded-lg animate-pulse-neon"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-cyber-muted-blue rounded-lg animate-pulse-neon" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">EXPLORE</span>
              <span className="text-cyber-muted-pink"> CATEGORIES</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Browse our cutting-edge categories and discover the future of technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group cyber-card hover:scale-[1.02] transition-transform"
                >
                  <div className="relative h-48 mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-cyber-muted-pink/10 to-cyber-muted-blue/10">
                    <div className={`absolute top-4 right-4 w-12 h-12 rounded-lg bg-cyber-neon-${category.color}/20 border border-cyber-neon-${category.color} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-cyber-neon-${category.color}`} />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-sm font-mono text-gray-400">
                        {category.products} PRODUCTS
                      </div>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-orbitron font-bold mb-2 text-cyber-neon-${category.color}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{category.description}</p>
                  
                  <div className="flex items-center text-cyber-muted-blue group-hover:text-cyber-muted-pink transition-colors">
                    <span className="font-orbitron text-sm">BROWSE CATEGORY</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="py-20 bg-gradient-to-b from-transparent to-cyber-dark/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-cyber-muted-pink mr-3" />
                <span className="cyber-badge border-cyber-muted-pink text-cyber-muted-pink">
                  TRENDING NOW
                </span>
              </div>
              <h2 className="text-4xl font-orbitron font-bold">
                <span className="text-cyber-muted-blue">POPULAR</span>
                <span className="text-cyber-muted-pink"> PRODUCTS</span>
              </h2>
            </div>
            <Link to="/products" className="cyber-button mt-4 md:mt-0">
              VIEW ALL PRODUCTS
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="cyber-card group">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-cyber-dark">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/90 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="cyber-badge border-cyber-muted-blue text-cyber-muted-blue">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center bg-cyber-black/80 px-2 py-1 rounded">
                      <Star className="h-3 w-3 text-cyber-muted-taupe fill-cyber-muted-taupe mr-1" />
                      <span className="text-xs font-rajdhani">{product.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 text-2xl font-orbitron font-bold text-cyber-muted-green">
                    {product.price.toLocaleString()}₡
                  </div>
                </div>
                
                <h3 className="text-xl font-orbitron font-bold mb-3 group-hover:text-cyber-muted-blue transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(product.features) ? (
                    product.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-cyber-dark border border-cyber-muted-purple text-cyber-muted-purple text-xs font-mono rounded"
                      >
                        {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                      </span>
                    ))
                  ) : product.features ? (
                    <span className="px-2 py-1 bg-cyber-dark border border-cyber-muted-purple text-cyber-muted-purple text-xs font-mono rounded">
                      {typeof product.features === 'string' ? product.features : JSON.stringify(product.features)}
                    </span>
                  ) : null}
                </div>
                
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/products/${product.id}`}
                    className="text-sm text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors"
                  >
                    VIEW DETAILS →
                  </Link>
                  <button className="flex items-center px-3 py-2 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors text-sm font-orbitron">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 border-t border-cyber-muted-blue/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-lg bg-cyber-neon-${stat.color}/10 border border-cyber-neon-${stat.color}`}>
                    <Icon className={`h-8 w-8 text-cyber-neon-${stat.color}`} />
                  </div>
                  <div className="text-4xl font-orbitron font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-rajdhani">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-muted-blue/10 via-cyber-muted-purple/10 to-cyber-muted-pink/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="cyber-card bg-cyber-dark/80 backdrop-blur-sm">
              <h2 className="text-4xl font-orbitron font-bold mb-6">
                <span className="text-cyber-muted-blue">READY TO</span>
                <span className="text-cyber-muted-pink"> UPGRADE?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of early adopters who have enhanced their capabilities with our technology. 
                The future is here, and it's waiting for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="cyber-button text-lg py-4 px-8">
                  SHOP NOW
                </Link>
                <Link to="/register" className="cyber-button cyber-button-secondary text-lg py-4 px-8">
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated grid overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-black"></div>
      </div>
    </div>
  );
};

export default Home;
