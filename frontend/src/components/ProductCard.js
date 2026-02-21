import React from 'react';
import { Star, ShoppingCart, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, view = 'grid' }) => {
  // Safe defaults
  const category = product?.category_name || product?.category || 'UNKNOWN';
  const features = Array.isArray(product?.features) ? product.features : [];
  const getCategoryColor = (cat) => {
    const colors = { 'biotech': 'pink', 'hardware': 'green', 'visuals': 'purple', 'augmentations': 'yellow', 'software': 'blue', 'accessories': 'pink' };
    return colors[cat?.toLowerCase()] || 'blue';
  };

  if (view === 'list') {
    return (
      <div className="cyber-card">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Product Image */}
          <div className="md:w-48 h-48 bg-cyber-dark border border-cyber-muted-blue/50 rounded-lg overflow-hidden">
            <div className="relative h-full w-full">
              <div className="absolute top-3 left-3">
                <span className={`cyber-badge border-cyber-neon-${getCategoryColor(category)} text-cyber-neon-${getCategoryColor(category)}`}>
                  {String(category).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-orbitron font-bold text-cyber-muted-blue mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
              </div>
              <div className="text-3xl font-orbitron font-bold text-cyber-muted-green">
                {product.price}₡
              </div>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-cyber-dark border border-cyber-muted-purple text-cyber-muted-purple text-sm font-mono rounded"
                >
                  {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                </span>
              ))}
            </div>
            
            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-cyber-muted-taupe fill-cyber-muted-taupe'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-rajdhani">{product.rating}</span>
                </div>
                <div className="text-sm font-mono">
                  <span className="text-cyber-muted-green">STOCK: </span>
                  <span className={product.stock < 10 ? 'text-cyber-muted-pink' : 'text-gray-300'}>
                    {product.stock} UNITS
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link 
                  to={`/products/${product.id}`}
                  className="flex items-center px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  VIEW
                </Link>
                <button className="flex items-center px-4 py-2 bg-cyber-muted-pink text-cyber-black font-orbitron font-bold hover:bg-cyber-muted-blue transition-colors">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="cyber-card">
      {/* Product Image */}
      <div className="relative h-48 mb-4 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyber-black/90"></div>
        <div className="absolute top-3 left-3">
          <span className={`cyber-badge border-cyber-neon-${getCategoryColor(category)} text-cyber-neon-${getCategoryColor(category)}`}>
            {String(category).toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {product.stock < 10 && (
            <span className="px-2 py-1 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink text-xs font-orbitron animate-pulse-neon">
              LOW STOCK
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 text-3xl font-orbitron font-bold text-cyber-muted-green">
          {product.price}₡
        </div>
      </div>
      
      {/* Product Info */}
      <h3 className="text-xl font-orbitron font-bold mb-2 text-cyber-muted-blue">
        {product.name}
      </h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? 'text-cyber-muted-taupe fill-cyber-muted-taupe'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-rajdhani">{product.rating}</span>
        <span className="mx-2 text-gray-600">•</span>
        <span className="text-sm font-mono">
          <span className={product.stock < 10 ? 'text-cyber-muted-pink' : 'text-cyber-muted-green'}>
            {product.stock} IN STOCK
          </span>
        </span>
      </div>
      
      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {features.slice(0, 2).map((feature, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-cyber-dark border border-cyber-muted-purple text-cyber-muted-purple text-xs font-mono rounded"
          >
            {typeof feature === 'string' ? feature : JSON.stringify(feature)}
          </span>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/products/${product.id}`}
          className="flex items-center text-sm text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors"
        >
          <Eye className="h-4 w-4 mr-1" />
          DETAILS
        </Link>
        <button className="flex items-center px-3 py-2 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors text-sm font-orbitron">
          <ShoppingCart className="h-4 w-4 mr-2" />
          CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
