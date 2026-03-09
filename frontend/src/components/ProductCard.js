import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../pages/store/cartStore';
import useLangStore from '../pages/store/langStore';
import useCurrencyStore from '../pages/store/currencyStore';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function getImageUrl(product) {
  if (!product.image_url && !product.image) return null;
  const img = product.image_url || product.image;
  if (img.startsWith('http')) return img;
  return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
}

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= Math.round(rating || 0) ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`}
          />
        ))}
      </div>
      <span className="text-zinc-400 text-xs">({reviews || 0})</span>
    </div>
  );
}

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { t } = useLangStore();
  const { formatPrice } = useCurrencyStore();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = getImageUrl(product);
  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;
  const inStock = product.stock > 0 || product.stock === undefined;
  const categoryName = product.category_name || product.category || '';
  const rating = product.rating || product.average_rating || 0;
  const reviewCount = product.review_count || product.reviews || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className="group relative bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300"
      >
        <Link to={`/products/${product.id}`} className="flex gap-0">
          <div className="relative w-40 sm:w-52 shrink-0 bg-zinc-800">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover aspect-square" />
            ) : (
              <div className="w-full h-full flex items-center justify-center aspect-square text-zinc-600">
                <ShoppingCart className="w-8 h-8" />
              </div>
            )}
            {product.badge && (
              <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-lg bg-orange-500 text-black">
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <p className="text-zinc-500 text-xs mb-1 capitalize">{categoryName}</p>
              <h3 className="text-white font-bold text-sm sm:text-base mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <StarRating rating={rating} reviews={reviewCount} />
              {product.description && (
                <p className="text-zinc-400 text-xs mt-2 line-clamp-1 hidden sm:block">{product.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-orange-400 font-black text-lg">{formatPrice(product.price)}</p>
                {product.original_price && product.original_price > product.price && (
                  <p className="text-zinc-500 text-xs line-through">{formatPrice(product.original_price)}</p>
                )}
              </div>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  added ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{added ? t('productCard.added') : t('productCard.addToCart')}</span>
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col"
      style={{ boxShadow: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 25px rgba(249, 115, 22, 0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-800 aspect-square">
        <Link to={`/products/${product.id}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
        </Link>

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <motion.button
            onClick={handleAddToCart}
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              added ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
          >
            {added ? <Zap className="w-4 h-4" aria-hidden="true" /> : <ShoppingCart className="w-4 h-4" aria-hidden="true" />}
            {added ? t('productCard.added') : t('productCard.addToCart')}
          </motion.button>
          <Link to={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              tabIndex={-1}
              className="p-2 bg-zinc-800/90 hover:bg-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500 text-black">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          onClick={handleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-xl transition-colors"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} aria-hidden="true" />
        </motion.button>

        {/* Out of stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500/90 px-4 py-2 rounded-lg">{t('productCard.outOfStock')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-zinc-500 text-xs mb-1 capitalize">{categoryName}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white font-bold text-sm mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={rating} reviews={reviewCount} />

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-zinc-800">
          <div>
            <p className="text-orange-400 font-black text-base">{formatPrice(product.price)}</p>
            {product.original_price && product.original_price > product.price && (
              <p className="text-zinc-500 text-xs line-through">{formatPrice(product.original_price)}</p>
            )}
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
            whileHover={inStock ? { scale: 1.05 } : {}}
            whileTap={inStock ? { scale: 0.95 } : {}}
            className={`p-2 rounded-xl transition-all ${
              !inStock
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
          >
            {added ? <Zap className="w-4 h-4" aria-hidden="true" /> : <ShoppingCart className="w-4 h-4" aria-hidden="true" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
