import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const badgeColors: Record<string, string> = {
  "Ko'p sotilgan": 'bg-orange-500 text-black',
  "Yangi": 'bg-emerald-500 text-white',
  "Chegirma": 'bg-red-500 text-white',
  "Premium": 'bg-purple-500 text-white',
  "Mashhur": 'bg-blue-500 text-white',
  "Eng yaxshi": 'bg-yellow-500 text-black',
  "Pro": 'bg-indigo-500 text-white',
  "Hot": 'bg-rose-500 text-white',
  "K Store Maxsus": 'bg-orange-500 text-black',
  "K Store Premium": 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black',
  "Arzon narx": 'bg-green-500 text-white',
  "Pro Tanlov": 'bg-cyan-500 text-black',
  "Eng kuchli": 'bg-red-600 text-white',
};

function formatPrice(price: number) {
  return price.toLocaleString('uz-UZ') + " so'm";
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`}
          />
        ))}
      </div>
      <span className="text-zinc-400 text-xs">({reviews})</span>
    </div>
  );
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
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
          {/* Image */}
          <div className="relative w-40 sm:w-52 shrink-0 bg-zinc-800">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover aspect-square"
            />
            {product.badge && (
              <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-lg ${badgeColors[product.badge] || 'bg-zinc-700 text-white'}`}>
                {product.badge}
              </span>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <p className="text-zinc-500 text-xs mb-1 capitalize">{product.subcategory}</p>
              <h3 className="text-white font-bold text-sm sm:text-base mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <StarRating rating={product.rating} reviews={product.reviews} />
              <p className="text-zinc-400 text-xs mt-2 line-clamp-1 hidden sm:block">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-orange-400 font-black text-lg">{formatPrice(product.price)}</p>
                {product.originalPrice && (
                  <p className="text-zinc-500 text-xs line-through">{formatPrice(product.originalPrice)}</p>
                )}
              </div>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{added ? 'Qo\'shildi!' : 'Savatga'}</span>
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

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
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              added ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
          >
            {added ? <Zap className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {added ? "Qo'shildi!" : "Savatga"}
          </motion.button>
          <Link to={`/products/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-zinc-800/90 hover:bg-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badgeColors[product.badge] || 'bg-zinc-700 text-white'}`}>
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
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-xl transition-colors"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} />
        </motion.button>

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500/90 px-4 py-2 rounded-lg">Tugagan</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-zinc-500 text-xs mb-1 capitalize">{product.subcategory}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white font-bold text-sm mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-zinc-800">
          <div>
            <p className="text-orange-400 font-black text-base">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-zinc-500 text-xs line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            whileHover={product.inStock ? { scale: 1.05 } : {}}
            whileTap={product.inStock ? { scale: 0.95 } : {}}
            className={`p-2 rounded-xl transition-all ${
              !product.inStock
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
          >
            {added ? <Zap className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
