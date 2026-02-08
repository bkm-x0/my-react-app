import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, LogIn, LogOut, Menu, X, Search, Settings, 
  ChevronDown, Filter, Home, ChevronLeft, ChevronRight, Grid, List, 
  Monitor, Battery, Keyboard, Mouse, Headphones, Gamepad, 
  Speaker, Mic, Camera, HardDrive, Cpu, Zap,
  TrendingUp, Gift, Shield, Truck, Clock
} from 'lucide-react';
import useAuthStore from '../pages/store/authStore';

const CyberNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showGamingCategories, setShowGamingCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const gamingRef = useRef(null);
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
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      if (gamingRef.current && !gamingRef.current.contains(event.target)) {
        setShowGamingCategories(false);
      }
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

  const categories = [
    { name: 'PC Monitor', icon: Monitor, href: '/category/pc-monitor', count: 24 },
    { name: 'Monitor Stand', icon: Monitor, href: '/category/monitor-stand', count: 12 },
    { name: 'UPS', icon: Battery, href: '/category/ups', count: 8 },
    { name: 'Keyboard', icon: Keyboard, href: '/category/keyboard', count: 45 },
    { name: 'Mouse', icon: Mouse, href: '/category/mouse', count: 38 },
    { name: 'Mouse Pad', icon: Mouse, href: '/category/mouse-pad', count: 22 },
    { name: 'Headset', icon: Headphones, href: '/category/headset', count: 31 },
    { name: 'Headset Stand', icon: Headphones, href: '/category/headset-stand', count: 9 },
    { name: 'Combo', icon: Gift, href: '/category/combo', count: 15 },
    { name: 'CPU & Processors', icon: Cpu, href: '/category/cpu', count: 28 },
  ];

  const gamingCategories = [
    { name: 'Gamepad', icon: Gamepad, href: '/category/gamepad', count: 18 },
    { name: 'Racing Wheel', icon: Gamepad, href: '/category/racing-wheel', count: 6 },
    { name: 'Speaker', icon: Speaker, href: '/category/speaker', count: 25 },
    { name: 'Microphone', icon: Mic, href: '/category/microphone', count: 17 },
    { name: 'Webcam', icon: Camera, href: '/category/webcam', count: 14 },
    { name: 'External Hard Drive', icon: HardDrive, href: '/category/external-hard-drive', count: 32 },
    { name: 'Hard Drive Enclosure', icon: HardDrive, href: '/category/hard-drive-enclosure', count: 7 },
    { name: 'USB Flash Drive', icon: HardDrive, href: '/category/usb-flash-drive', count: 41 },
    { name: 'Decoration', icon: Gift, href: '/category/decoration', count: 23 },
    { name: 'Gaming Chairs', icon: User, href: '/category/gaming-chairs', count: 11 },
  ];

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
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-orbitron ${
            currentPage === 1
              ? 'bg-cyber-muted-pink text-cyber-black'
              : 'border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue/10'
          }`}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-500 px-2">
            ...
          </span>
        );
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-orbitron ${
            currentPage === i
              ? 'bg-cyber-muted-pink text-cyber-black'
              : 'border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue/10'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-500 px-2">
            ...
          </span>
        );
      }
      
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-orbitron ${
            currentPage === totalPages
              ? 'bg-cyber-muted-pink text-cyber-black'
              : 'border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue/10'
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
      <div className="bg-gradient-to-r from-cyber-muted-blue via-cyber-muted-purple to-cyber-muted-pink py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
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
              <Link to="/support" className="hover:text-cyber-black transition-colors">
                24/7 SUPPORT
              </Link>
              <span className="hidden md:inline">|</span>
              <Link to="/track-order" className="hidden md:block hover:text-cyber-black transition-colors">
                TRACK ORDER
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className={`sticky top-0 z-50 bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-muted-blue shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-300 ${isScrolled ? 'shadow-2xl' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-muted-pink to-cyber-muted-blue rounded-lg flex items-center justify-center">
                <span className="font-orbitron font-black text-cyber-black">CS</span>
              </div>
              <div className="font-orbitron text-2xl font-bold tracking-wider">
                <span className="text-cyber-muted-blue">CYBER</span>
                <span className="text-cyber-muted-pink">STORE</span>
              </div>
            </Link>

            {/* Desktop Navigation - FIXED VERSION */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Main Navigation */}
              <div className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="font-rajdhani font-semibold text-lg hover:text-cyber-muted-blue transition-colors flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  HOME
                </Link>
                
                {/* PC Accessories Dropdown */}
                <div className="relative" ref={categoriesRef}>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="font-rajdhani font-semibold text-lg hover:text-cyber-muted-blue transition-colors flex items-center"
                  >
                    PC ACCESSORIES
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 w-96 bg-cyber-dark border border-cyber-muted-blue rounded-lg shadow-xl z-50">
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-orbitron font-bold text-cyber-muted-blue mb-3 pb-2 border-b border-cyber-muted-blue/30">PC ACCESSORIES</h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                  <Link
                                    key={cat.name}
                                    to={cat.href}
                                    className="flex items-center justify-between p-2 hover:bg-cyber-gray/50 rounded-lg transition-colors group"
                                    onClick={() => setShowCategories(false)}
                                  >
                                    <div className="flex items-center">
                                      <Icon className="h-4 w-4 mr-3 text-cyber-muted-green group-hover:text-cyber-muted-pink transition-colors" />
                                      <span className="text-gray-300 group-hover:text-white">{cat.name}</span>
                                    </div>
                                    <span className="text-xs text-cyber-muted-pink bg-cyber-dark px-2 py-1 rounded group-hover:bg-cyber-muted-pink group-hover:text-cyber-black transition-colors">
                                      {cat.count}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-orbitron font-bold text-cyber-muted-pink mb-3 pb-2 border-b border-cyber-muted-pink/30">QUICK LINKS</h3>
                            <div className="space-y-2">
                              {quickLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                  <Link
                                    key={link.name}
                                    to={link.href}
                                    className="flex items-center justify-between p-2 hover:bg-cyber-gray/50 rounded-lg transition-colors group"
                                    onClick={() => setShowCategories(false)}
                                  >
                                    <div className="flex items-center">
                                      <Icon className="h-4 w-4 mr-3 text-cyber-muted-blue" />
                                      <span className="text-gray-300 group-hover:text-white">{link.name}</span>
                                    </div>
                                    <span className="text-xs bg-cyber-muted-blue text-cyber-black px-2 py-1 rounded font-bold">
                                      {link.badge}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Gaming Gear Dropdown */}
                <div className="relative" ref={gamingRef}>
                  <button
                    onClick={() => setShowGamingCategories(!showGamingCategories)}
                    className="font-rajdhani font-semibold text-lg hover:text-cyber-muted-pink transition-colors flex items-center"
                  >
                    GAMING GEAR
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showGamingCategories ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showGamingCategories && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-cyber-dark border border-cyber-muted-pink rounded-lg shadow-xl z-50">
                      <div className="p-4">
                        <h3 className="text-lg font-orbitron font-bold text-cyber-muted-pink mb-3">GAMING GEAR</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {gamingCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <Link
                                key={cat.name}
                                to={cat.href}
                                className="flex items-center justify-between p-2 hover:bg-cyber-gray/50 rounded-lg transition-colors group"
                                onClick={() => setShowGamingCategories(false)}
                              >
                                <div className="flex items-center">
                                  <Icon className="h-4 w-4 mr-3 text-cyber-muted-taupe" />
                                  <span className="text-gray-300 group-hover:text-white">{cat.name}</span>
                                </div>
                                <span className="text-xs text-cyber-muted-taupe bg-cyber-dark px-2 py-1 rounded">
                                  {cat.count}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Pages */}
                <Link 
                  to="/about" 
                  className="font-rajdhani font-semibold text-lg hover:text-cyber-muted-blue transition-colors"
                >
                  ABOUT
                </Link>
                
                <Link 
                  to="/contact" 
                  className="font-rajdhani font-semibold text-lg hover:text-cyber-muted-blue transition-colors"
                >
                  CONTACT
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-blue" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="cyber-input pl-10 pr-24 font-mono w-64"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-cyber-muted-blue text-cyber-black text-sm font-orbitron rounded hover:bg-cyber-muted-pink transition-colors"
                >
                  SEARCH
                </button>
              </form>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 hover:bg-cyber-gray/50 rounded-lg transition-colors group"
              >
                <ShoppingCart className="h-6 w-6 text-cyber-muted-green group-hover:text-cyber-muted-pink transition-colors" />
                <span className="absolute -top-1 -right-1 bg-cyber-muted-pink text-cyber-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-neon">
                  {user?.cartCount || 0}
                </span>
              </Link>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-orbitron font-bold text-cyber-muted-blue">
                        {user?.username || user?.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user?.balance ? user.balance.toLocaleString() + '₡' : '0₡'}
                      </div>
                    </div>
                    <Link to="/profile" className="p-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black rounded-lg transition-colors">
                      <User className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="p-2 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 border border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple hover:text-cyber-black rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="flex items-center space-x-2 text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors">
                    <LogIn className="h-5 w-5" />
                    <span className="font-orbitron font-bold">LOGIN</span>
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
              className="lg:hidden p-2 border border-cyber-muted-blue text-cyber-muted-blue rounded-lg hover:bg-cyber-muted-blue/10 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Updated Products Page Controls */}
        {isProductsPage && (
          <div className="border-t border-cyber-muted-purple/30 py-3 bg-cyber-dark/80">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Side: Filter Controls */}
                <div className="flex items-center gap-4">
                  <div className="relative" ref={filtersRef}>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue/10 rounded-lg transition-colors"
                    >
                      <Filter className="h-4 w-4" />
                      FILTERS
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showFilters && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-cyber-dark border border-cyber-muted-blue rounded-lg shadow-xl z-50 p-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-orbitron font-bold text-cyber-muted-blue">FILTER PRODUCTS</h3>
                          {filters.map((filter) => (
                            <div key={filter.param}>
                              <h4 className="text-sm font-semibold text-gray-300 mb-2">{filter.label}</h4>
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
                                      className={`px-3 py-1 text-xs rounded transition-colors ${
                                        isActive
                                          ? 'bg-cyber-muted-pink text-cyber-black'
                                          : 'border border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple/20'
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
                              className="flex-1 py-2 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black rounded-lg transition-colors text-sm font-orbitron"
                            >
                              CLEAR ALL
                            </button>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="flex-1 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black rounded-lg transition-colors text-sm font-orbitron"
                            >
                              APPLY
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 border border-cyber-muted-blue/50 rounded-lg p-1">
                    <button
                      onClick={() => handleViewChange('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-cyber-muted-blue text-cyber-black' 
                          : 'text-cyber-muted-blue hover:bg-cyber-muted-blue/10'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewChange('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-cyber-muted-blue text-cyber-black' 
                          : 'text-cyber-muted-blue hover:bg-cyber-muted-blue/10'
                      }`}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-400 font-mono hidden md:block">
                    Showing 1-12 of 245 products
                  </div>
                </div>

                {/* Right Side: Pagination */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
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
                      className="p-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-400 font-mono">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu - You need to add this back too */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-cyber-black/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-cyber-muted-blue/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-muted-pink to-cyber-muted-blue rounded-lg flex items-center justify-center">
                  <span className="font-orbitron font-black text-cyber-black">CS</span>
                </div>
                <div className="font-orbitron text-xl font-bold">
                  <span className="text-cyber-muted-blue">CYBER</span>
                  <span className="text-cyber-muted-pink">STORE</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-cyber-muted-pink hover:bg-cyber-muted-pink/10 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Search in Mobile */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-blue" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH PRODUCTS..."
                    className="cyber-input w-full pl-10 font-mono"
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
                      className="p-3 border border-cyber-muted-blue rounded-lg text-center hover:bg-cyber-muted-blue/10 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-cyber-muted-pink mx-auto mb-2" />
                      <div className="text-sm font-orbitron">{link.name}</div>
                      <span className="text-xs text-cyber-muted-green">{link.badge}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Main Navigation */}
              <div className="space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 text-xl font-orbitron font-bold text-cyber-muted-blue hover:bg-cyber-muted-blue/10 rounded-lg"
                >
                  <Home className="mr-3" />
                  HOME
                </Link>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold text-cyber-muted-pink mb-2">PC ACCESSORIES</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          to={cat.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="p-2 border border-cyber-muted-blue/50 rounded text-center hover:bg-cyber-muted-blue/10 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-cyber-muted-green mx-auto mb-1" />
                          <div className="text-xs truncate">{cat.name}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold text-cyber-muted-taupe mb-2">GAMING GEAR</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {gamingCategories.slice(0, 6).map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          to={cat.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="p-2 border border-cyber-muted-purple/50 rounded text-center hover:bg-cyber-muted-purple/10 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-cyber-muted-taupe mx-auto mb-1" />
                          <div className="text-xs truncate">{cat.name}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Other Pages */}
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-3 text-lg font-orbitron text-gray-300 hover:text-cyber-muted-blue hover:bg-cyber-muted-blue/10 rounded-lg"
                >
                  ABOUT US
                </Link>
                
                <Link 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-3 text-lg font-orbitron text-gray-300 hover:text-cyber-muted-blue hover:bg-cyber-muted-blue/10 rounded-lg"
                >
                  CONTACT
                </Link>
              </div>
            </div>

            {/* Bottom User Section */}
            <div className="border-t border-cyber-muted-blue/30 p-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-orbitron font-bold text-cyber-muted-blue">
                        {user?.username || user?.email}
                      </div>
                      <div className="text-sm text-cyber-muted-green font-mono">
                        {user?.balance ? user.balance.toLocaleString() + '₡' : '0₡'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        to="/cart" 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 border border-cyber-muted-green text-cyber-muted-green rounded-lg hover:bg-cyber-muted-green hover:text-cyber-black transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 border border-cyber-muted-blue text-cyber-muted-blue rounded-lg hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors"
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
                        className="flex-1 py-2 border border-cyber-muted-pink text-cyber-muted-pink text-center rounded-lg hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors"
                      >
                        ADMIN
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex-1 py-2 border border-cyber-muted-purple text-cyber-muted-purple rounded-lg hover:bg-cyber-muted-purple hover:text-cyber-black transition-colors"
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
                    className="flex-1 py-3 border border-cyber-muted-blue text-cyber-muted-blue text-center rounded-lg hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors font-orbitron"
                  >
                    LOGIN
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-cyber-muted-blue to-cyber-muted-pink text-cyber-black text-center rounded-lg hover:opacity-90 transition-opacity font-orbitron"
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
