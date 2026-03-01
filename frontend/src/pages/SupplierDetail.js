import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Globe, Mail, Phone, Star, ArrowLeft, Package, ExternalLink, Clock } from 'lucide-react';
import { supplierAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const SupplierDetail = () => {
  const { id } = useParams();
  const { t } = useLangStore();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productPagination, setProductPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchSupplier();
    fetchProducts(1);
  }, [id]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const res = await supplierAPI.getSupplier(id);
      setSupplier(res.data.supplier);
    } catch (error) {
      console.error('Error fetching supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      setProductsLoading(true);
      const res = await supplierAPI.getSupplierProducts(id, { page, limit: 12 });
      setProducts(res.data.products || []);
      setProductPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching supplier products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${i <= r ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded w-48 mb-8" />
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-zinc-800 rounded-2xl" />
                <div>
                  <div className="h-8 bg-zinc-800 rounded w-64 mb-3" />
                  <div className="h-5 bg-zinc-800 rounded w-40" />
                </div>
              </div>
              <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <Building2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl text-white font-bold mb-2">{t('suppliers.notFound')}</h2>
          <p className="text-zinc-500 mb-6">{t('suppliers.notFoundDesc')}</p>
          <Link to="/suppliers" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('suppliers.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Link
            to="/suppliers"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('suppliers.backToList')}
          </Link>
        </motion.div>

        {/* Supplier Info Card */}
        <motion.div
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-10"
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 flex-shrink-0">
              {supplier.logo ? (
                <img src={supplier.logo} alt={supplier.name} className="w-20 h-20 object-contain rounded-xl" />
              ) : (
                <Building2 className="w-12 h-12 text-orange-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{supplier.name}</h1>
                  {(supplier.city || supplier.country) && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(supplier.rating)}
                  {supplier.rating > 0 && (
                    <span className="text-zinc-300 font-semibold ml-2 text-lg">
                      {parseFloat(supplier.rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {supplier.description && (
                <p className="text-zinc-400 leading-relaxed mb-6">{supplier.description}</p>
              )}

              {/* Contact / Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {supplier.email && (
                  <a
                    href={`mailto:${supplier.email}`}
                    className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 hover:border-orange-500/30 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-orange-400" />
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">{t('suppliers.email')}</div>
                      <div className="text-zinc-300 text-sm truncate group-hover:text-orange-400 transition-colors">{supplier.email}</div>
                    </div>
                  </a>
                )}
                {supplier.phone && (
                  <a
                    href={`tel:${supplier.phone}`}
                    className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 hover:border-orange-500/30 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-orange-400" />
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">{t('suppliers.phone')}</div>
                      <div className="text-zinc-300 text-sm truncate group-hover:text-orange-400 transition-colors">{supplier.phone}</div>
                    </div>
                  </a>
                )}
                {supplier.website && (
                  <a
                    href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 hover:border-orange-500/30 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-orange-400" />
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">{t('suppliers.website')}</div>
                      <div className="text-zinc-300 text-sm truncate group-hover:text-orange-400 transition-colors flex items-center gap-1">
                        {supplier.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </div>
                    </div>
                  </a>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">{t('suppliers.address')}</div>
                      <div className="text-zinc-300 text-sm truncate">{supplier.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-semibold">{supplier.product_count || 0}</span>
                  <span className="text-zinc-500 text-sm">{t('suppliers.productsCount')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-zinc-500" />
                  <span className="text-zinc-500 text-sm">
                    {t('suppliers.memberSince')} {new Date(supplier.created_at).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supplier Products */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-400" />
              {t('suppliers.supplierProducts')}
              <span className="text-zinc-500 text-lg font-normal">({productPagination.total})</span>
            </h2>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">{t('suppliers.noProducts')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Product Pagination */}
              {productPagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: productPagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => fetchProducts(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === productPagination.page
                          ? 'bg-orange-500 text-black'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500/30 hover:text-orange-400'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SupplierDetail;
