import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../pages/store/cartStore';

const ProductCard = ({ product, view = 'grid' }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Safe defaults
  const category = product?.category_name || product?.category || 'UNKNOWN';
  const features = Array.isArray(product?.features) ? product.features : [];
  
  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  
  if (view === 'list') {
    return (
      <div className="card card-gradient group">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Product Image */}
          <div className="md:w-48 h-48 bg-aliexpress-black border-2 border-aliexpress-red rounded overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10">
              <span className="badge">
                {String(category).toUpperCase()}
              </span>
            </div>
            {product.stock < 10 && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2 py-1 bg-aliexpress-accent text-aliexpress-black text-xs font-bold rounded animate-pulse">
                  LOW STOCK
                </span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-aliexpress-white mb-2">
                  {product.name}
                </h3>
                <p className="text-aliexpress-medgray mb-4 line-clamp-2">{product.description}</p>
              </div>
              <div className="text-3xl font-bold text-aliexpress-red ml-4">
                {product.price}₡
              </div>
            </div>
            
            {/* Rating and Stock */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-aliexpress-red fill-aliexpress-red'
                        : 'text-aliexpress-border'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-aliexpress-white">{product.rating}</span>
              </div>
              <div className="text-sm font-semibold">
                <span className="text-aliexpress-white">STOCK: </span>
                <span className={product.stock < 10 ? 'text-aliexpress-accent' : 'text-aliexpress-medgray'}>
                  {product.stock} UNITS
                </span>
              </div>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-aliexpress-black border border-aliexpress-accent text-aliexpress-accent text-sm font-semibold rounded"
                >
                  {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                </span>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link 
                to={`/products/${product.id}`}
                className="flex items-center px-4 py-2 border-2 border-aliexpress-white text-aliexpress-white hover:bg-aliexpress-white hover:text-aliexpress-black transition-colors font-semibold rounded"
              >
                <Eye className="h-4 w-4 mr-2" />
                VIEW
              </Link>
              <button 
                onClick={handleAddToCart}
                className={`flex items-center px-4 py-2 font-bold transition-colors rounded ${
                  addedToCart
                    ? 'bg-aliexpress-accent text-aliexpress-black'
                    : 'bg-aliexpress-red text-aliexpress-black hover:bg-aliexpress-darkred'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    ADDED
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    ADD TO CART
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="card card-gradient group hover:-translate-y-2 transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-56 bg-aliexpress-black border-b-2 border-aliexpress-red overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          <span className="badge">
            {String(category).toUpperCase()}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 z-10">
          {product.stock < 10 && (
            <span className="px-2 py-1 bg-aliexpress-accent text-aliexpress-black text-xs font-bold rounded animate-pulse">
              LOW STOCK
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 right-3 text-3xl font-bold text-aliexpress-red z-10">
          {product.price}₡
        </div>
      </div>
      
      <div className="p-5">
        {/* Product Info */}
        <h3 className="text-lg font-bold mb-2 text-aliexpress-white group-hover:text-aliexpress-red transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-aliexpress-medgray text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-aliexpress-red fill-aliexpress-red'
                    : 'text-aliexpress-border'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-bold text-aliexpress-white">{product.rating}</span>
          <span className="mx-2 text-aliexpress-border">•</span>
          <span className="text-xs font-semibold">
            <span className={product.stock < 10 ? 'text-aliexpress-accent' : 'text-aliexpress-medgray'}>
              {product.stock} UNITS
            </span>
          </span>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 2).map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-aliexpress-black border border-aliexpress-accent text-aliexpress-accent text-xs font-semibold rounded"
            >
              {typeof feature === 'string' ? feature : JSON.stringify(feature)}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <Link 
            to={`/products/${product.id}`}
            className="flex items-center text-sm text-aliexpress-white hover:text-aliexpress-red transition-colors font-semibold"
          >
            <Eye className="h-4 w-4 mr-1" />
            VIEW
          </Link>
          <button 
            onClick={handleAddToCart}
            className={`flex items-center px-4 py-2 transition-all text-sm font-bold rounded ${
              addedToCart
                ? 'bg-aliexpress-accent text-aliexpress-black'
                : 'bg-aliexpress-red text-aliexpress-black hover:bg-aliexpress-darkred hover:scale-105'
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                ADDED
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                ADD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
