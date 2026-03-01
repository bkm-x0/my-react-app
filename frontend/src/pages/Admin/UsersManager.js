import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Loader2, AlertTriangle, Edit, Trash2, Shield, User,
  ChevronLeft, ChevronRight, Mail, Calendar, Save, X
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 15 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.users || data);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openEdit = (user) => {
    setEditModal(user);
    setEditData({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user',
      is_active: user.is_active !== false
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateUser(editModal.id, editData);
      setEditModal(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(id);
      setDeleteModal(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-white font-black text-xl flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          Users Management
          <span className="text-zinc-500 text-sm font-normal ml-2">({total} total)</span>
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </form>
        <div className="flex gap-2">
          {['all', 'user', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                roleFilter === r
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
              }`}
            >
              {r === 'all' ? 'All' : r === 'admin' ? 'Admins' : 'Users'}
            </button>
          ))}
        </div>
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
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No users found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">User</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Email</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Role</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Joined</th>
                    <th className="text-right text-zinc-500 text-xs font-bold uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            user.role === 'admin' ? 'bg-orange-500/10' : 'bg-zinc-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <Shield className="w-4 h-4 text-orange-400" />
                            ) : (
                              <User className="w-4 h-4 text-zinc-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{user.username || 'Unknown'}</p>
                            <p className="text-zinc-500 text-xs">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-zinc-400 text-sm flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          user.is_active !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {user.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-zinc-500 text-sm flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-2 bg-zinc-800 hover:bg-orange-500/20 rounded-lg text-zinc-400 hover:text-orange-400 transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(user)}
                            className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                            title="Deactivate User"
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
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-zinc-400 text-sm px-3">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => !saving && setEditModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">Edit User</h3>
                <button onClick={() => setEditModal(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-zinc-400 text-sm font-bold block mb-1.5">Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData(d => ({ ...d, username: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(d => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold block mb-1.5">Role</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData(d => ({ ...d, role: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold block mb-1.5">Status</label>
                  <select
                    value={editData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setEditData(d => ({ ...d, is_active: e.target.value === 'active' }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditModal(null)}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">Deactivate User</h3>
              <p className="text-zinc-400 text-sm text-center mb-6">
                Are you sure you want to deactivate <span className="text-white font-bold">"{deleteModal.username}"</span>? The user will no longer be able to log in.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Deactivate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersManager;
