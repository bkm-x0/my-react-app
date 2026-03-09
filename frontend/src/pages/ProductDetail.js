import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, Check, Zap, Loader2, MessageSquare, Send, User, Building2 } from 'lucide-react';
import useCartStore from './store/cartStore';
import useAuthStore from './store/authStore';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useLangStore from './store/langStore';
import useCurrencyStore from './store/currencyStore';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function getImageUrl(product) {
  if (!product?.image_url && !product?.image) return null;
  const img = product.image_url || product.image;
  if (img.startsWith('http')) return img;
  return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
}

const ProductDetail = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t } = useLangStore();
  const { formatPrice } = useCurrencyStore();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.getProduct(id);
        setProduct(res.data || null);
        
        // Fetch related products
        if (res.data) {
          try {
            const relRes = await productAPI.getProducts({ limit: 4 });
            const all = Array.isArray(relRes.data) ? relRes.data : relRes.data.products || [];
            setRelatedProducts(all.filter(p => p.id !== Number(id)).slice(0, 4));
          } catch (e) { /* ignore */ }
        }
      } catch (err) {
        console.error('Failed to load product', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await productAPI.getReviews(id, { page: 1, limit: 10 });
        const data = res.data;
        setReviews(data.reviews || []);
        setHasMoreReviews((data.reviews || []).length >= 10);
        setReviewPage(1);
      } catch (e) { /* ignore */ }
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [id]);

  const loadMoreReviews = async () => {
    const nextPage = reviewPage + 1;
    try {
      const res = await productAPI.getReviews(id, { page: nextPage, limit: 10 });
      const newReviews = res.data.reviews || [];
      setReviews(prev => [...prev, ...newReviews]);
      setReviewPage(nextPage);
      setHasMoreReviews(newReviews.length >= 10);
    } catch (e) { /* ignore */ }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewMsg({ type: 'error', text: t('product.ratingRequired') });
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg({ type: '', text: '' });
    try {
      const res = await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment });
      setReviews(prev => [res.data, ...prev]);
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
      setReviewMsg({ type: 'success', text: t('product.reviewSuccess') });
      // Update product rating display
      setProduct(prev => prev ? {
        ...prev,
        rating: ((prev.rating * (prev.review_count || 0) + reviewRating) / ((prev.review_count || 0) + 1)).toFixed(2),
        review_count: (prev.review_count || 0) + 1
      } : prev);
      setTimeout(() => setReviewMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setReviewMsg({ type: 'error', text: t('product.reviewError') });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white font-bold text-xl mb-2">{t('products.noProducts')}</p>
          <Link to="/products" className="text-orange-400 hover:text-orange-300 text-sm">← {t('product.back')}</Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product);
  const rating = product.rating || product.average_rating || 0;
  const reviewCount = product.review_count || product.reviews || 0;
  const inStock = product.stock > 0 || product.stock === undefined;
  const categoryName = product.category_name || product.category || '';
  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-orange-400 transition-colors">{t('nav.home')}</Link>
          <span className="text-zinc-600">/</span>
          <Link to="/products" className="text-zinc-400 hover:text-orange-400 transition-colors">{t('products.title')}</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 line-clamp-1">{product.name}</span>
        </div>

        <Link to="/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-6 text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('product.back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-square relative group">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-xl bg-orange-500 text-black">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-xl bg-red-500 text-white">
                  -{discount}%
                </span>
              )}
              {!inStock && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold bg-red-500/90 px-5 py-2.5 rounded-xl">{t('product.outOfStock')}</span>
                  </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{categoryName}</p>
            <h1 className="text-white font-black text-2xl sm:text-3xl mb-3">{product.name}</h1>

            {/* Supplier */}
            {product.supplier_name && (
              <Link
                to={`/suppliers/${product.supplier_id}`}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-orange-400 transition-colors text-sm mb-3 group"
              >
                <Building2 className="w-4 h-4 text-orange-400" />
                <span className="group-hover:underline">{product.supplier_name}</span>
              </Link>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(rating) ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`} />
                ))}
              </div>
              <span className="text-orange-400 font-bold">{Number(rating).toFixed(1)}</span>
              <span className="text-zinc-400 text-sm">({reviewCount} {t('product.reviews')})</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <div className="flex items-end gap-3">
                <span className="text-orange-400 font-black text-4xl">{formatPrice(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-zinc-500 text-lg line-through mb-1">{formatPrice(product.original_price)}</span>
                )}
              </div>
              {product.original_price && product.original_price > product.price && (
                <p className="text-emerald-400 text-sm mt-1 font-medium">
                  {t('product.save')} {formatPrice(product.original_price - product.price)}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm mb-5 leading-relaxed">{product.description}</p>

            {/* Stock info */}
            {product.stock !== undefined && (
              <div className="mb-4">
                <p className={`text-sm font-medium ${inStock ? 'text-emerald-400' : 'text-red-400'}`}>
                  {inStock
                    ? `✓ ${t('product.inStock')} (${product.stock})`
                    : `✕ ${t('product.outOfStock')}`}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-zinc-400 text-sm">{t('product.qty')}:</span>
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
                disabled={!inStock}
                whileHover={inStock ? { scale: 1.03, boxShadow: '0 0 25px rgba(249,115,22,0.3)' } : {}}
                whileTap={inStock ? { scale: 0.97 } : {}}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base transition-all ${
                  !inStock ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : added ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                {added ? <Zap className="w-5 h-5" fill="currentColor" /> : <ShoppingCart className="w-5 h-5" />}
                {!inStock
                  ? t('product.outOfStock')
                  : added
                  ? t('product.added')
                  : t('product.addToCart')}
              </motion.button>
              <motion.button
                onClick={() => setIsWishlisted(!isWishlisted)}
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
                { icon: Shield, text: t('product.guarantee') },
                { icon: Truck, text: t('product.delivery') },
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
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-white font-black text-xl mb-6">{t('product.related')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          {/* Reviews Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                {t('product.reviewsSection')}
              </h2>
              {reviews.length > 0 && (
                <p className="text-zinc-400 text-sm mt-1">
                  {t('product.basedOn')} {reviews.length} {t('product.reviewsCount')}
                </p>
              )}
            </div>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                <Star className="w-4 h-4" />
                {t('product.writeReview')}
              </motion.button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 border border-zinc-700 hover:border-orange-500 text-zinc-300 hover:text-orange-400 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                {t('product.loginToReview')}
              </Link>
            )}
          </div>

          {/* Review Status Message */}
          <AnimatePresence>
            {reviewMsg.text && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
                  reviewMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {reviewMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitReview}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 overflow-hidden"
              >
                <h3 className="text-white font-bold text-lg mb-5">{t('product.writeReview')}</h3>

                {/* Star Rating Input */}
                <div className="mb-5">
                  <label className="text-zinc-400 text-sm mb-2 block">{t('product.yourRating')}</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= (reviewHover || reviewRating)
                              ? 'text-orange-400 fill-orange-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="text-orange-400 font-bold text-lg ml-2">{reviewRating}/5</span>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mb-5">
                  <label className="text-zinc-400 text-sm mb-2 block">{t('product.yourComment')}</label>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder={t('product.commentPlaceholder')}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={reviewSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {reviewSubmitting ? t('product.submittingReview') : t('product.submitReview')}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Overall Rating Summary */}
          {reviews.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-orange-400">{Number(rating).toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`} />
                    ))}
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{reviewCount} {t('product.reviewsCount')}</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-400 w-3 text-right">{star}</span>
                        <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-zinc-500 w-8 text-right text-xs">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{review.username || t('product.anonymous')}</p>
                        <p className="text-zinc-500 text-xs">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-orange-400 fill-orange-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-zinc-300 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </motion.div>
              ))}

              {/* Load More */}
              {hasMoreReviews && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMoreReviews}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                  >
                    {t('product.loadMore')} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">{t('product.noReviews')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
