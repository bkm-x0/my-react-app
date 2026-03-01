import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function formatPrice(price: number) {
  return price.toLocaleString('uz-UZ') + " so'm";
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white font-bold text-xl mb-2">Mahsulot topilmadi</p>
          <Link to="/products" className="text-orange-400 hover:text-orange-300 text-sm">← Mahsulotlarga qaytish</Link>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const related = products.filter(p => p.subcategory === product.subcategory && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-orange-400 transition-colors">Bosh sahifa</Link>
          <span className="text-zinc-600">/</span>
          <Link to="/products" className="text-zinc-400 hover:text-orange-400 transition-colors">Mahsulotlar</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 line-clamp-1">{product.name}</span>
        </div>

        <Link to="/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-6 text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Orqaga
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-square relative group">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-xl bg-orange-500 text-black`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-xl bg-red-500 text-white">
                  -{discount}%
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold bg-red-500/90 px-5 py-2.5 rounded-xl">Tugagan</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{product.subcategory}</p>
            <h1 className="text-white font-black text-2xl sm:text-3xl mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`} />
                ))}
              </div>
              <span className="text-orange-400 font-bold">{product.rating}</span>
              <span className="text-zinc-400 text-sm">({product.reviews} ta sharh)</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <div className="flex items-end gap-3">
                <span className="text-orange-400 font-black text-4xl">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-zinc-500 text-lg line-through mb-1">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-emerald-400 text-sm mt-1 font-medium">
                  {formatPrice(product.originalPrice - product.price)} tejaysiz!
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm mb-5 leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="mb-6">
                <p className="text-white font-bold text-sm mb-3">Asosiy xususiyatlar:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                      <Check className="w-4 h-4 text-orange-400 shrink-0" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-zinc-400 text-sm">Miqdor:</span>
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors font-bold">−</button>
                <span className="px-4 py-2 text-white font-bold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors font-bold">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                whileHover={product.inStock ? { scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.3)' } : {}}
                whileTap={product.inStock ? { scale: 0.97 } : {}}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base transition-all ${
                  !product.inStock ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : added ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                {added ? <Zap className="w-5 h-5" fill="currentColor" /> : <ShoppingCart className="w-5 h-5" />}
                {!product.inStock ? 'Tugagan' : added ? "Savatga qo'shildi!" : "Savatga qo'shish"}
              </motion.button>
              <motion.button
                onClick={() => toggleWishlist(product.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-zinc-800 border border-zinc-700 hover:border-red-500/40 rounded-xl transition-all"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} />
              </motion.button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, text: '1-3 yil kafolat' },
                { icon: Truck, text: '24 soat yetkazib berish' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                  <item.icon className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-zinc-300 text-xs">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-white font-black text-xl mb-6">O'xshash mahsulotlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
