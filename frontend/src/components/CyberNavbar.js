import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, LogIn, LogOut, Menu, X, Search, Settings, 
  ChevronDown, Filter, Home, ChevronLeft, ChevronRight, Grid, List, 
  Zap, TrendingUp, Gift, Shield, Truck, Clock
} from 'lucide-react';
import useAuthStore from '../pages/store/authStore';

const CyberNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const filtersRef = useRef(null);

  const isProductsPage = location.pathname === '/products';
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentView = searchParams.get('view') || 'grid';
  const [viewMode, setViewMode] = useState(currentView);
  const totalPages = 5; // This should come from your API

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update view mode when URL changes
  useEffect(() => {
    const view = searchParams.get('view') || 'grid';
    setViewMode(view);
  }, [location.search]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const quickLinks = [
    { name: 'New Arrivals', icon: Zap, href: '/new-arrivals', badge: 'NEW' },
    { name: 'Trending', icon: TrendingUp, href: '/trending', badge: 'HOT' },
    { name: 'On Sale', icon: Gift, href: '/sale', badge: 'SALE' },
    { name: 'Pre-order', icon: Clock, href: '/pre-order', badge: 'PRE' },
  ];

  const filters = [
    { label: 'Price Range', param: 'price', options: ['under-1000', '1000-5000', '5000-10000', 'over-10000'] },
    { label: 'Rating', param: 'rating', options: ['4', '4.5', '5'] },
    { label: 'Stock Status', param: 'stock', options: ['in-stock', 'low-stock', 'pre-order'] },
    { label: 'Features', param: 'feature', options: ['rgb', 'wireless', 'mechanical', 'customizable'] }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(location.search);
      params.set('page', page);
      navigate(`/products?${params.toString()}`);
    }
  };

  const handleViewChange = (view) => {
    setViewMode(view);
    const params = new URLSearchParams(location.search);
    params.set('view', view);
    navigate(`/products?${params.toString()}`);
  };

  const applyFilter = (param, value) => {
    const params = new URLSearchParams(location.search);
    params.set(param, value);
    navigate(`/products?${params.toString()}`);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    navigate('/products');
    setShowFilters(false);
  };

  // Check if a filter is active
  const isFilterActive = (param, value) => {
    const params = new URLSearchParams(location.search);
    return params.get(param) === value;
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-display ${
            currentPage === 1
              ? 'bg-aliexpress-red text-aliexpress-black font-bold'
              : 'border border-aliexpress-border text-aliexpress-white hover:border-aliexpress-red hover:text-aliexpress-red'
          }`}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="text-aliexpress-medgray px-2">...</span>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-display ${
            currentPage === i
              ? 'bg-aliexpress-red text-aliexpress-black font-bold'
              : 'border border-aliexpress-border text-aliexpress-white hover:border-aliexpress-red hover:text-aliexpress-red'
          }`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="text-aliexpress-medgray px-2">...</span>
        );
      }
      
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-display ${
            currentPage === totalPages
              ? 'bg-aliexpress-red text-aliexpress-black font-bold'
              : 'border border-aliexpress-border text-aliexpress-white hover:border-aliexpress-red hover:text-aliexpress-red'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-aliexpress-red py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-aliexpress-black font-bold">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                FREE SHIPPING ON ORDERS OVER 5000₡
              </span>
              <span className="hidden md:flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                2-YEAR WARRANTY ON ALL PRODUCTS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/support" className="hover:text-gray-100 transition-colors">
                24/7 SUPPORT
              </Link>
              <span className="hidden md:inline">|</span>
              <Link to="/track-order" className="hidden md:block hover:text-gray-100 transition-colors">
                TRACK ORDER
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className={`sticky top-0 z-50 bg-aliexpress-black/90 backdrop-blur-md border-b border-aliexpress-border shadow-md transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-aliexpress-red/20 bg-aliexpress-black' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-aliexpress-red rounded flex items-center justify-center">
                <span className="font-bold text-aliexpress-black">CS</span>
              </div>
              <div className="text-2xl font-bold tracking-wide">
                <span className="text-aliexpress-red">CYBER</span>
                <span className="text-aliexpress-white">STORE</span>
              </div>
            </Link>

            {/* Desktop Navigation - FIXED VERSION */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Main Navigation */}
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="font-semibold text-lg text-aliexpress-white hover:text-aliexpress-red transition-colors flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  HOME
                </Link>
                
                {/* Categories Page */}
                <Link 
                  to="/categories" 
                  className="font-semibold text-lg text-aliexpress-white hover:text-aliexpress-red transition-colors flex items-center"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  CATEGORIES
                </Link>

                {/* Additional Pages */}
                <Link 
                  to="/about" 
                  className="font-semibold text-lg text-aliexpress-white hover:text-aliexpress-red transition-colors"
                >
                  ABOUT
                </Link>
                
                <Link 
                  to="/contact" 
                  className="font-semibold text-lg text-aliexpress-white hover:text-aliexpress-red transition-colors"
                >
                  CONTACT
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-aliexpress-red" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="cyber-input pl-10 pr-24 font-mono w-64"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-aliexpress-red text-aliexpress-black text-sm font-display rounded hover:bg-aliexpress-darkred transition-colors"
                >
                  SEARCH
                </button>
              </form>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 hover:bg-aliexpress-darkgray rounded-lg transition-colors group"
              >
                <ShoppingCart className="h-6 w-6 text-aliexpress-accent group-hover:text-aliexpress-red transition-colors" />
                <span className="absolute -top-1 -right-1 bg-aliexpress-accent text-aliexpress-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {user?.cartCount || 0}
                </span>
              </Link>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-display font-bold text-aliexpress-red">
                        {user?.username || user?.email}
                      </div>
                      <div className="text-xs text-aliexpress-medgray">
                        {user?.balance ? user.balance.toLocaleString() + '₡' : '0₡'}
                      </div>
                    </div>
                    <Link to="/profile" className="p-2 border border-aliexpress-red text-aliexpress-red hover:bg-aliexpress-red hover:text-aliexpress-black rounded-lg transition-colors">
                      <User className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="p-2 border border-aliexpress-accent text-aliexpress-accent hover:bg-aliexpress-accent hover:text-aliexpress-black rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 border border-aliexpress-lightgray text-aliexpress-lightgray hover:bg-aliexpress-lightgray hover:text-aliexpress-black rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="flex items-center space-x-2 text-aliexpress-red hover:text-aliexpress-accent transition-colors">
                    <LogIn className="h-5 w-5" />
                    <span className="font-display font-bold">LOGIN</span>
                  </Link>
                  <Link to="/register" className="cyber-button text-sm">
                    REGISTER
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 border border-aliexpress-red text-aliexpress-red rounded-lg hover:bg-aliexpress-red/10 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Updated Products Page Controls */}
        {isProductsPage && (
          <div className="border-t border-aliexpress-border py-3 bg-aliexpress-darkgray">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Side: Filter Controls */}
                <div className="flex items-center gap-4">
                  <div className="relative" ref={filtersRef}>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 border border-aliexpress-red text-aliexpress-red hover:bg-aliexpress-red/10 rounded transition-colors font-display"
                    >
                      <Filter className="h-4 w-4" />
                      FILTERS
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showFilters && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-aliexpress-darkgray border border-aliexpress-red rounded shadow-xl z-50 p-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-display font-bold text-aliexpress-red">FILTER PRODUCTS</h3>
                          {filters.map((filter) => (
                            <div key={filter.param}>
                              <h4 className="text-sm font-semibold text-aliexpress-white mb-2">{filter.label}</h4>
                              <div className="flex flex-wrap gap-2">
                                {filter.options.map((option) => {
                                  const isActive = isFilterActive(filter.param, option);
                                  const displayText = {
                                    'under-1000': 'Under 1000₡',
                                    '1000-5000': '1000-5000₡',
                                    '5000-10000': '5000-10000₡',
                                    'over-10000': '10000₡+',
                                    '4': '4+ Stars',
                                    '4.5': '4.5+ Stars',
                                    '5': '5 Stars',
                                    'in-stock': 'In Stock',
                                    'low-stock': 'Low Stock',
                                    'pre-order': 'Pre-order',
                                    'rgb': 'RGB Lighting',
                                    'wireless': 'Wireless',
                                    'mechanical': 'Mechanical',
                                    'customizable': 'Customizable'
                                  }[option] || option;
                                  
                                  return (
                                    <button
                                      key={option}
                                      onClick={() => applyFilter(filter.param, option)}
                                      className={`px-3 py-1 text-xs rounded transition-colors font-display ${
                                        isActive
                                          ? 'bg-aliexpress-red text-aliexpress-black'
                                          : 'border border-aliexpress-border text-aliexpress-medgray hover:border-aliexpress-red hover:text-aliexpress-red'
                                      }`}
                                    >
                                      {displayText}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <button
                              onClick={clearAllFilters}
                              className="flex-1 py-2 border border-aliexpress-accent text-aliexpress-accent hover:bg-aliexpress-accent hover:text-aliexpress-black rounded transition-colors text-sm font-display"
                            >
                              CLEAR ALL
                            </button>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="flex-1 py-2 bg-aliexpress-red text-aliexpress-black hover:bg-aliexpress-darkred rounded transition-colors text-sm font-display font-bold"
                            >
                              APPLY
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 border border-aliexpress-border rounded p-1">
                    <button
                      onClick={() => handleViewChange('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-aliexpress-red text-aliexpress-black' 
                          : 'text-aliexpress-white hover:bg-aliexpress-black'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewChange('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-aliexpress-red text-aliexpress-black' 
                          : 'text-aliexpress-white hover:bg-aliexpress-black'
                      }`}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-aliexpress-medgray font-display hidden md:block">
                    Showing 1-12 of 245 products
                  </div>
                </div>

                {/* Right Side: Pagination */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-red hover:text-aliexpress-black hover:border-aliexpress-red disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPaginationButtons()}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-red hover:text-aliexpress-black hover:border-aliexpress-red disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-aliexpress-medgray font-display">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-aliexpress-black/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-aliexpress-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-aliexpress-red rounded flex items-center justify-center">
                  <span className="font-display font-bold text-aliexpress-black">CS</span>
                </div>
                <div className="text-xl font-bold">
                  <span className="text-aliexpress-red">CYBER</span>
                  <span className="text-aliexpress-white">STORE</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-aliexpress-red hover:bg-aliexpress-red/10 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Search in Mobile */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-aliexpress-red" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH PRODUCTS..."
                    className="input-modern w-full pl-10"
                  />
                </div>
              </form>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-3 border border-aliexpress-border rounded text-center hover:border-aliexpress-red hover:bg-aliexpress-darkgray transition-colors"
                    >
                      <Icon className="h-5 w-5 text-aliexpress-red mx-auto mb-2" />
                      <div className="text-sm font-display text-aliexpress-white">{link.name}</div>
                      <span className="text-xs text-aliexpress-accent font-bold">{link.badge}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Main Navigation */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-lg font-display font-bold text-aliexpress-white hover:bg-aliexpress-darkgray hover:text-aliexpress-red rounded transition-colors"
                >
                  <Home className="h-5 w-5 mr-3 text-aliexpress-red" />
                  HOME
                </Link>

                <Link 
                  to="/products" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-lg font-display font-bold text-aliexpress-white hover:bg-aliexpress-darkgray hover:text-aliexpress-red rounded transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-3 text-aliexpress-red" />
                  PRODUCTS
                </Link>

                {/* Other Pages */}
                <Link 
                  to="/categories" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-lg font-display font-bold text-aliexpress-white hover:bg-aliexpress-darkgray hover:text-aliexpress-red rounded transition-colors"
                >
                  <Grid className="h-5 w-5 mr-3 text-aliexpress-accent" />
                  CATEGORIES
                </Link>

                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-lg font-display text-aliexpress-white hover:bg-aliexpress-darkgray hover:text-aliexpress-red rounded transition-colors"
                >
                  ABOUT US
                </Link>
                
                <Link 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-lg font-display text-aliexpress-white hover:bg-aliexpress-darkgray hover:text-aliexpress-red rounded transition-colors"
                >
                  CONTACT
                </Link>
              </div>
            </div>

            {/* Bottom User Section */}
            <div className="border-t border-aliexpress-border p-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-display font-bold text-aliexpress-red">
                        {user?.username || user?.email}
                      </div>
                      <div className="text-sm text-aliexpress-accent font-display">
                        {user?.balance ? user.balance.toLocaleString() + '₡' : '0₡'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        to="/cart" 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 border border-aliexpress-accent text-aliexpress-accent rounded hover:bg-aliexpress-accent hover:text-aliexpress-black transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 border border-aliexpress-red text-aliexpress-red rounded hover:bg-aliexpress-red hover:text-aliexpress-black transition-colors"
                      >
                        <User className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-2 border border-aliexpress-accent text-aliexpress-accent text-center rounded hover:bg-aliexpress-accent hover:text-aliexpress-black transition-colors font-display font-bold text-sm"
                      >
                        ADMIN PANEL
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex-1 py-2 border border-aliexpress-medgray text-aliexpress-medgray rounded hover:bg-aliexpress-medgray hover:text-aliexpress-black transition-colors font-display text-sm"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-3 border-2 border-aliexpress-red text-aliexpress-red text-center rounded hover:bg-aliexpress-red hover:text-aliexpress-black transition-colors font-display font-bold"
                  >
                    LOGIN
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-3 bg-aliexpress-red text-aliexpress-black text-center rounded hover:bg-aliexpress-darkred transition-colors font-display font-bold"
                  >
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CyberNavbar;
