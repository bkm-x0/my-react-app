import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Globe, Mail, Phone, Star, ChevronRight, Package, ArrowUpDown } from 'lucide-react';
import { supplierAPI } from '../services/api';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } })
};

const Suppliers = () => {
  const { t } = useLangStore();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchSuppliers();
  }, [sort]);

  const fetchSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12, sort };
      if (search.trim()) params.search = search.trim();
      const res = await supplierAPI.getSuppliers(params);
      setSuppliers(res.data.suppliers || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSuppliers(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= r ? 'text-orange-400 fill-orange-400' : 'text-zinc-600'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      {/* Hero */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              {t('suppliers.badge')}
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-4 text-white"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t('suppliers.title')} <span className="text-orange-400">{t('suppliers.titleHighlight')}</span>
          </motion.h1>
          <motion.p
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {t('suppliers.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('suppliers.searchPlaceholder')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </form>
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
            >
              <option value="name_asc">{t('suppliers.sortNameAsc')}</option>
              <option value="name_desc">{t('suppliers.sortNameDesc')}</option>
              <option value="rating">{t('suppliers.sortRating')}</option>
              <option value="newest">{t('suppliers.sortNewest')}</option>
            </select>
            <span className="text-zinc-500 text-sm">
              {pagination.total} {t('suppliers.results')}
            </span>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">{t('suppliers.noSuppliers')}</h3>
            <p className="text-zinc-500">{t('suppliers.noSuppliersDesc')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier, index) => (
                <motion.div
                  key={supplier.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={index}
                >
                  <Link
                    to={`/suppliers/${supplier.id}`}
                    className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/30 hover:bg-zinc-900 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-orange-500/30 transition-colors flex-shrink-0">
                        {supplier.logo ? (
                          <img src={supplier.logo} alt={supplier.name} className="w-12 h-12 object-contain rounded-lg" />
                        ) : (
                          <Building2 className="w-8 h-8 text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate group-hover:text-orange-400 transition-colors">
                          {supplier.name}
                        </h3>
                        {(supplier.city || supplier.country) && (
                          <div className="flex items-center gap-1.5 text-zinc-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors flex-shrink-0 mt-1" />
                    </div>

                    {/* Description */}
                    {supplier.description && (
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {supplier.description}
                      </p>
                    )}

                    {/* Footer info */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-1">
                        {renderStars(supplier.rating)}
                        {supplier.rating > 0 && (
                          <span className="text-zinc-400 text-sm ml-1">({parseFloat(supplier.rating).toFixed(1)})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 text-sm">
                        {supplier.website && (
                          <Globe className="w-4 h-4" />
                        )}
                        {supplier.email && (
                          <Mail className="w-4 h-4" />
                        )}
                        {supplier.phone && (
                          <Phone className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => fetchSuppliers(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === pagination.page
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
      </div>
    </div>
  );
};

export default Suppliers;
