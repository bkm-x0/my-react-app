import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Search, Edit, Trash2, Plus, Loader2, AlertTriangle,
  ChevronLeft, ChevronRight, Eye, Star, MapPin, Phone, Mail, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supplierAPI } from '../../services/api';
import useLangStore from '../store/langStore';

const SuppliersManager = () => {
  const { t } = useLangStore();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('newest');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      const { data } = await supplierAPI.getAllAdmin(params);
      setSuppliers(data.suppliers || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || t('adminSupplier.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await supplierAPI.deleteSupplier(id);
      setDeleteModal(null);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || t('adminSupplier.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (supplier) => {
    try {
      await supplierAPI.updateSupplier(supplier.id, { isActive: !supplier.is_active });
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-white font-black text-xl flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-400" />
          {t('adminSupplier.title')}
          <span className="text-zinc-500 text-sm font-normal ml-2">({total} {t('adminSupplier.total')})</span>
        </h2>
        <Link
          to="/admin/suppliers/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('adminSupplier.addNew')}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('adminSupplier.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
        >
          <option value="newest">{t('adminSupplier.sortNewest')}</option>
          <option value="name_asc">{t('adminSupplier.sortNameAsc')}</option>
          <option value="name_desc">{t('adminSupplier.sortNameDesc')}</option>
          <option value="rating">{t('adminSupplier.sortRating')}</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">{t('adminSupplier.noSuppliers')}</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colSupplier')}</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colContact')}</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colLocation')}</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colRating')}</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colStatus')}</th>
                    <th className="text-right text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">{t('adminSupplier.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, i) => (
                    <motion.tr
                      key={supplier.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold line-clamp-1">{supplier.name}</p>
                            <p className="text-zinc-500 text-xs">ID: {supplier.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          {supplier.email && (
                            <div className="flex items-center gap-1 text-zinc-400 text-xs">
                              <Mail className="w-3 h-3" /> {supplier.email}
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center gap-1 text-zinc-400 text-xs">
                              <Phone className="w-3 h-3" /> {supplier.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-zinc-400 text-sm">
                          <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                          <span className="line-clamp-1">
                            {[supplier.city, supplier.country].filter(Boolean).join(', ') || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                          <span className="text-white text-sm font-bold">{parseFloat(supplier.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleActive(supplier)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                            supplier.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {supplier.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {supplier.is_active ? t('adminSupplier.active') : t('adminSupplier.inactive')}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/suppliers/${supplier.id}`}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            title={t('adminSupplier.view')}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/suppliers/edit/${supplier.id}`}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-orange-400 transition-colors"
                            title={t('adminSupplier.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModal(supplier)}
                            className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                            title={t('adminSupplier.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-zinc-500 text-sm">
                {t('adminSupplier.page')} {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-lg">{t('adminSupplier.confirmDelete')}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {t('adminSupplier.confirmDeleteMsg')} <span className="text-orange-400 font-bold">{deleteModal.name}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm font-bold hover:bg-zinc-700 transition-colors"
                >
                  {t('adminSupplier.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('adminSupplier.confirmDeleteBtn')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuppliersManager;
