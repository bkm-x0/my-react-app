import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Package, Shield, LogOut, Edit, Save, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from './store/authStore';
import useLangStore from './store/langStore';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useLangStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
    });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || t('profile.updateFail'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'overview', label: t('profile.tabOverview'), icon: User },
    { id: 'security', label: t('profile.tabSecurity'), icon: Shield },
    { id: 'orders', label: t('profile.tabOrders'), icon: Package },
    { id: 'billing', label: t('profile.tabBilling'), icon: CreditCard },
    { id: 'settings', label: t('profile.tabSettings'), icon: Settings },
  ];

  /* ─── Loading / Auth guard ─── */
  if (!user) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-zinc-400">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  /* ─── Tab content renderers ─── */

  const renderOverview = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Information Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t('profile.profileInfo')}</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-colors text-sm"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? t('common.cancel') : t('profile.edit')}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.username')}</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-orange-500 focus:outline-none text-white rounded-xl transition-colors"
                  required
                />
              ) : (
                <div className="px-4 py-2.5 bg-zinc-800/60 border border-zinc-800 rounded-xl text-white">
                  {user.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.email')}</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-orange-500 focus:outline-none text-white rounded-xl transition-colors"
                  required
                />
              ) : (
                <div className="px-4 py-2.5 bg-zinc-800/60 border border-zinc-800 rounded-xl text-white">
                  {user.email}
                </div>
              )}
            </div>
          </div>

          {/* Role & Joined */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.role')}</label>
              <div className="px-4 py-2.5 bg-zinc-800/60 border border-zinc-800 rounded-xl text-orange-400 capitalize">
                {user.role || 'user'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.joined')}</label>
              <div className="px-4 py-2.5 bg-zinc-800/60 border border-zinc-800 rounded-xl text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                {t('profile.saveChanges')}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: t('profile.totalOrders'), value: '0', accent: 'text-orange-400' },
          { label: t('profile.wishlistItems'), value: '0', accent: 'text-white' },
          { label: t('profile.totalSpent'), value: '$0', accent: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className={`text-3xl font-bold mb-1 ${stat.accent}`}>{stat.value}</div>
            <div className="text-zinc-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{t('profile.changePassword')}</h2>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.currentPassword')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-orange-500 focus:outline-none text-white rounded-xl transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.newPassword')}</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-orange-500 focus:outline-none text-white rounded-xl transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">{t('profile.confirmNewPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-orange-500 focus:outline-none text-white rounded-xl transition-colors"
            />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-xl transition-colors mt-2">
            {t('profile.updatePassword')}
          </button>
        </div>
      </div>

      {/* Two-Factor */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Lock className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t('profile.twoFactor')}</h3>
              <p className="text-zinc-400 text-sm">{t('profile.twoFactorDesc')}</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-colors text-sm">
            {t('profile.enable')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{t('profile.orderHistory')}</h2>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 mb-4">{t('profile.noOrders')}</p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            {t('profile.browseProducts')}
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const renderBilling = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{t('profile.paymentMethods')}</h2>
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 mb-4">{t('profile.noPaymentMethods')}</p>
          <button className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-xl transition-colors">
            {t('profile.addPaymentMethod')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{t('profile.preferences')}</h2>

        <div className="space-y-5">
          {[
            { label: t('profile.emailNotifications'), description: t('profile.emailNotificationsDesc') },
            { label: t('profile.marketingEmails'), description: t('profile.marketingEmailsDesc') },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-zinc-400 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-6">
        <h3 className="text-red-400 font-bold mb-2">{t('profile.dangerZone')}</h3>
        <p className="text-zinc-400 text-sm mb-4">{t('profile.dangerZoneDesc')}</p>
        <button className="px-5 py-2.5 rounded-xl border border-red-800 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold">
          {t('profile.deleteAccount')}
        </button>
      </div>
    </motion.div>
  );

  const tabContent = {
    overview: renderOverview,
    security: renderSecurity,
    orders: renderOrders,
    billing: renderBilling,
    settings: renderSettings,
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{t('profile.myAccount')}</h1>
          <p className="text-zinc-400">{t('profile.myAccountDesc')}</p>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3"
            >
              <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <div className="h-2 w-2 bg-zinc-950 rounded-full" />
              </div>
              <p className="text-emerald-400 text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── Sidebar ─── */}
          <motion.aside
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-64 shrink-0"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:sticky lg:top-24">
              {/* Avatar + Name */}
              <div className="flex lg:flex-col items-center lg:text-center gap-4 lg:gap-0 mb-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center lg:mb-3 shrink-0">
                  <User className="h-8 w-8 lg:h-10 lg:w-10 text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{user.username}</h2>
                  <p className="text-zinc-400 text-sm">{user.email}</p>
                </div>
              </div>

              {/* Tab Nav — horizontal scroll on mobile, vertical on desktop */}
              <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 scrollbar-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-black'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                {t('profile.logOut')}
              </button>
            </div>
          </motion.aside>

          {/* ─── Content ─── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <React.Fragment key={activeTab}>{tabContent[activeTab]()}</React.Fragment>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
