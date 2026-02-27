import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Package, Shield, Zap, Truck, RotateCcw, ChevronLeft, MessageSquare, User, ThumbsUp } from 'lucide-react';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import { productAPI } from '../services/api';

/* ───── Interactive Star Rating Component ───── */
const StarRating = ({ value = 0, onChange, size = 'md', readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly ? star <= Math.round(value) : star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'} transition-transform`}
          >
            <Star
              className={`${sizeClass} transition-colors ${
                filled
                  ? 'text-aliexpress-red fill-aliexpress-red'
                  : 'text-aliexpress-border'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

/* ───── Rating Distribution Bar ───── */
const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 text-aliexpress-medgray font-display text-right">{stars}★</span>
      <div className="flex-1 h-2 bg-aliexpress-black rounded-full overflow-hidden">
        <div className="h-full bg-aliexpress-red rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-aliexpress-medgray font-display">{count}</span>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [activeTab, setActiveTab] = useState('reviews');

  const { user, isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productAPI.getProduct(id);
      setProduct(res.data || null);
    } catch (err) {
      console.error('Failed to load product', err);
      setError('فشل تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await productAPI.getReviews(id, { limit: 50 });
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0) {
      setReviewError('يرجى اختيار تقييم');
      return;
    }
    try {
      setSubmittingReview(true);
      setReviewError('');
      setReviewSuccess('');
      await productAPI.addReview(id, reviewForm);
      setReviewForm({ rating: 0, comment: '' });
      setReviewSuccess('تم إرسال تقييمك بنجاح! شكراً لك');
      await fetchReviews();
      await fetchProduct();
      setTimeout(() => setReviewSuccess(''), 4000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'فشل إرسال التقييم');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ─── Rating distribution from reviews ───
  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { const s = Math.round(r.rating); if (dist[s] !== undefined) dist[s]++; });
    return dist;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-aliexpress-black flex items-center justify-center">
        <div className="animate-pulse text-aliexpress-red font-display text-xl">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-aliexpress-black flex items-center justify-center">
        <div className="text-aliexpress-red font-display text-xl">{error}</div>
      </div>
    );
  }
  if (!product) return null;

  const ratingDist = getRatingDistribution();

  return (
    <div className="min-h-screen bg-aliexpress-black">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-aliexpress-medgray hover:text-aliexpress-red transition-colors font-display text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            BACK TO PRODUCTS
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ═══ Left Column ═══ */}
          <div>
            {/* Product Image */}
            <div className="card mb-6">
              <div className="h-96 bg-aliexpress-black border-2 border-aliexpress-border rounded relative overflow-hidden">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="badge">
                    {String(product.category_name || product.category || '').toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-sm font-display font-bold rounded ${
                    product.stock > 0
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-red-500/20 border border-red-500 text-red-400'
                  }`}>
                    {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 text-4xl font-display font-bold text-aliexpress-red">
                  {Number(product.price).toLocaleString()}₡
                </div>
              </div>
            </div>

            {/* Features */}
            {(Array.isArray(product.features) ? product.features : []).length > 0 && (
              <div className="card mb-6">
                <h3 className="text-xl font-display font-bold mb-4 text-aliexpress-red">FEATURES</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Zap className="h-4 w-4 text-aliexpress-accent mr-2 mt-1 flex-shrink-0" />
                      <span className="text-aliexpress-white text-sm">{String(feature || '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="card mb-6">
              <h3 className="text-xl font-display font-bold mb-4 text-aliexpress-red">SPECIFICATIONS</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications || {}).length === 0 ? (
                  <div className="text-sm text-aliexpress-medgray">No specifications provided.</div>
                ) : (
                  Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-aliexpress-border">
                      <span className="text-aliexpress-medgray text-sm">{key}</span>
                      <span className="font-display font-bold text-aliexpress-white">{value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ═══ Right Column ═══ */}
          <div>
            {/* Product Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-aliexpress-white">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-4 mb-4">
                <StarRating value={product.rating || 0} readonly size="md" />
                <span className="text-lg font-display font-bold text-aliexpress-red">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
                <span className="text-aliexpress-medgray text-sm">
                  ({product.reviews_count || reviews.length} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="badge">{String(product.category_name || '').toUpperCase()}</span>
                {product.sku && (
                  <span className="px-3 py-1 bg-aliexpress-black border border-aliexpress-border text-aliexpress-medgray text-xs font-display rounded">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <p className="text-aliexpress-medgray text-base mb-6 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="text-4xl font-display font-bold text-aliexpress-red mb-6">
                {Number(product.price).toLocaleString()}₡
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-display font-bold mb-2 text-aliexpress-white uppercase">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-red hover:text-aliexpress-black hover:border-aliexpress-red transition-colors font-bold rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-2 bg-aliexpress-black border-y border-aliexpress-border text-aliexpress-white font-display outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border border-aliexpress-border text-aliexpress-white hover:bg-aliexpress-red hover:text-aliexpress-black hover:border-aliexpress-red transition-colors font-bold rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-aliexpress-red mb-2">
                    TOTAL: {(product.price * quantity).toLocaleString()}₡
                  </div>
                  <button
                    onClick={() => addToCart({ ...product, quantity })}
                    disabled={product.stock <= 0}
                    className="btn-primary text-lg py-3 px-8 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="inline mr-2 h-5 w-5" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-aliexpress-darkgray border border-aliexpress-border rounded text-center">
                <Package className="h-7 w-7 text-aliexpress-red mx-auto mb-2" />
                <div className="font-display font-bold text-sm text-aliexpress-white mb-1">FREE SHIPPING</div>
                <div className="text-xs text-aliexpress-medgray">On orders over 1000₡</div>
              </div>
              <div className="p-4 bg-aliexpress-darkgray border border-aliexpress-border rounded text-center">
                <Shield className="h-7 w-7 text-aliexpress-red mx-auto mb-2" />
                <div className="font-display font-bold text-sm text-aliexpress-white mb-1">2-YEAR WARRANTY</div>
                <div className="text-xs text-aliexpress-medgray">Full coverage</div>
              </div>
              <div className="p-4 bg-aliexpress-darkgray border border-aliexpress-border rounded text-center">
                <RotateCcw className="h-7 w-7 text-aliexpress-red mx-auto mb-2" />
                <div className="font-display font-bold text-sm text-aliexpress-white mb-1">30-DAY RETURNS</div>
                <div className="text-xs text-aliexpress-medgray">No questions asked</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ Reviews & Ratings Section ═══════════ */}
        <div className="mt-16 border-t border-aliexpress-border pt-12">
          {/* Tab Buttons */}
          <div className="flex gap-4 mb-8 border-b border-aliexpress-border">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-2 font-display font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-aliexpress-red text-aliexpress-red'
                  : 'border-transparent text-aliexpress-medgray hover:text-aliexpress-white'
              }`}
            >
              <MessageSquare className="inline h-5 w-5 mr-2" />
              REVIEWS ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('write')}
              className={`pb-3 px-2 font-display font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'write'
                  ? 'border-aliexpress-red text-aliexpress-red'
                  : 'border-transparent text-aliexpress-medgray hover:text-aliexpress-white'
              }`}
            >
              <Star className="inline h-5 w-5 mr-2" />
              WRITE A REVIEW
            </button>
          </div>

          {/* ─── Tab: Reviews ─── */}
          {activeTab === 'reviews' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Rating Overview */}
              <div className="card">
                <div className="text-center mb-6">
                  <div className="text-5xl font-display font-bold text-aliexpress-red mb-2">
                    {Number(product.rating || 0).toFixed(1)}
                  </div>
                  <StarRating value={product.rating || 0} readonly size="lg" />
                  <div className="text-aliexpress-medgray text-sm mt-2 font-display">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <RatingBar key={s} stars={s} count={ratingDist[s]} total={reviews.length} />
                  ))}
                </div>

                {/* Write review CTA */}
                <button
                  onClick={() => setActiveTab('write')}
                  className="w-full mt-6 btn-primary"
                >
                  <Star className="inline h-4 w-4 mr-2" />
                  WRITE A REVIEW
                </button>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <div className="card text-center py-12">
                    <MessageSquare className="h-12 w-12 text-aliexpress-border mx-auto mb-4" />
                    <p className="text-aliexpress-medgray text-lg font-display">No reviews yet</p>
                    <p className="text-aliexpress-medgray text-sm mt-1">Be the first to review this product!</p>
                    <button onClick={() => setActiveTab('write')} className="btn-primary mt-4">
                      WRITE THE FIRST REVIEW
                    </button>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-aliexpress-red rounded-full flex items-center justify-center text-aliexpress-black font-display font-bold">
                            {(r.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-display font-bold text-aliexpress-white">
                              {r.username || 'Anonymous'}
                            </div>
                            <div className="text-xs text-aliexpress-medgray">
                              {new Date(r.created_at).toLocaleDateString('ar-SA', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <StarRating value={r.rating} readonly size="sm" />
                      </div>
                      {r.comment && (
                        <p className="text-aliexpress-white text-sm leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─── Tab: Write a Review ─── */}
          {activeTab === 'write' && (
            <div className="max-w-2xl mx-auto">
              <div className="card">
                <h3 className="text-2xl font-display font-bold text-aliexpress-white mb-6">
                  Rate this product
                </h3>

                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-aliexpress-border mx-auto mb-4" />
                    <p className="text-aliexpress-medgray mb-4 font-display">يجب تسجيل الدخول لإضافة تقييم</p>
                    <div className="flex justify-center gap-3">
                      <Link to={`/login?next=/products/${id}`} className="btn-secondary">
                        LOG IN
                      </Link>
                      <Link to="/register" className="btn-primary">
                        CREATE ACCOUNT
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Star Selection */}
                    <div>
                      <label className="block text-sm font-display font-bold text-aliexpress-white mb-3 uppercase">
                        Your Rating <span className="text-aliexpress-red">*</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <StarRating
                          value={reviewForm.rating}
                          onChange={(val) => setReviewForm((prev) => ({ ...prev, rating: val }))}
                          size="lg"
                        />
                        <span className="text-aliexpress-medgray font-display text-sm">
                          {reviewForm.rating === 0 && 'Click to rate'}
                          {reviewForm.rating === 1 && 'Poor'}
                          {reviewForm.rating === 2 && 'Fair'}
                          {reviewForm.rating === 3 && 'Good'}
                          {reviewForm.rating === 4 && 'Very Good'}
                          {reviewForm.rating === 5 && 'Excellent'}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-display font-bold text-aliexpress-white mb-3 uppercase">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-4 py-3 bg-aliexpress-black border border-aliexpress-border rounded text-aliexpress-white placeholder-aliexpress-medgray focus:outline-none focus:border-aliexpress-red focus:ring-1 focus:ring-aliexpress-red/30 font-display resize-none"
                        rows={5}
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    {/* Success / Error Messages */}
                    {reviewSuccess && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm font-display flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {reviewSuccess}
                      </div>
                    )}
                    {reviewError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-display">
                        {reviewError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || reviewForm.rating === 0}
                      className="btn-primary w-full py-3 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
