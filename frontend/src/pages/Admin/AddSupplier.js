import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Save, ArrowLeft, Loader2, AlertTriangle, CheckCircle,
  User, Phone, Mail, Globe, MapPin, FileText, DollarSign, CreditCard
} from 'lucide-react';
import { supplierAPI } from '../../services/api';
import useLangStore from '../store/langStore';

const currencies = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD', 'IQD', 'TRY', 'CNY', 'JPY', 'INR'];

const AddSupplier = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLangStore();

  const [form, setForm] = useState({
    name: '',
    description: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_person: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    country: '',
    city: '',
    street: '',
    address: '',
    commercial_register: '',
    tax_number: '',
    currency: 'USD',
    opening_balance: '',
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchSupplier();
    }
  }, [id]);

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const { data } = await supplierAPI.getSupplier(id);
      const s = data.supplier;
      setForm({
        name: s.name || '',
        description: s.description || '',
        contact_first_name: s.contact_first_name || '',
        contact_last_name: s.contact_last_name || '',
        contact_person: s.contact_person || '',
        email: s.email || '',
        phone: s.phone || '',
        mobile: s.mobile || '',
        website: s.website || '',
        country: s.country || '',
        city: s.city || '',
        street: s.street || '',
        address: s.address || '',
        commercial_register: s.commercial_register || '',
        tax_number: s.tax_number || '',
        currency: s.currency || 'USD',
        opening_balance: s.opening_balance || '',
      });
    } catch (err) {
      setError(t('adminSupplier.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError(t('adminSupplier.nameRequired'));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        opening_balance: parseFloat(form.opening_balance) || 0,
      };

      if (isEdit) {
        await supplierAPI.updateSupplier(id, payload);
        setSuccess(t('adminSupplier.updateSuccess'));
      } else {
        await supplierAPI.createSupplier(payload);
        setSuccess(t('adminSupplier.createSuccess'));
        setTimeout(() => navigate('/admin/dashboard?tab=suppliers'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('adminSupplier.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const InputField = ({ label, name, icon: Icon, type = 'text', placeholder, required, dir }) => (
    <div>
      <label className="text-zinc-400 text-sm font-bold mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          dir={dir || 'auto'}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600`}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard?tab=suppliers"
              className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-white font-black text-lg leading-none flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                {isEdit ? t('adminSupplier.editTitle') : t('adminSupplier.addTitle')}
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                {isEdit ? t('adminSupplier.editSubtitle') : t('adminSupplier.addSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t('adminSupplier.saving') : t('adminSupplier.save')}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-sm">{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-400" />
              {t('adminSupplier.sectionBasic')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <InputField
                  label={t('adminSupplier.businessName')}
                  name="name"
                  icon={Building2}
                  placeholder={t('adminSupplier.businessNamePh')}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-zinc-400 text-sm font-bold mb-1.5 block">{t('adminSupplier.description')}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  dir="auto"
                  placeholder={t('adminSupplier.descriptionPh')}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Contact Person */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-400" />
              {t('adminSupplier.sectionContact')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label={t('adminSupplier.firstName')}
                name="contact_first_name"
                icon={User}
                placeholder={t('adminSupplier.firstNamePh')}
              />
              <InputField
                label={t('adminSupplier.lastName')}
                name="contact_last_name"
                icon={User}
                placeholder={t('adminSupplier.lastNamePh')}
              />
              <InputField
                label={t('adminSupplier.phone')}
                name="phone"
                icon={Phone}
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
              <InputField
                label={t('adminSupplier.mobile')}
                name="mobile"
                icon={Phone}
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
              <InputField
                label={t('adminSupplier.email')}
                name="email"
                icon={Mail}
                type="email"
                placeholder="supplier@example.com"
              />
              <InputField
                label={t('adminSupplier.website')}
                name="website"
                icon={Globe}
                placeholder="https://www.example.com"
              />
            </div>
          </motion.div>

          {/* Section 3: Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              {t('adminSupplier.sectionAddress')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label={t('adminSupplier.country')}
                name="country"
                icon={Globe}
                placeholder={t('adminSupplier.countryPh')}
              />
              <InputField
                label={t('adminSupplier.city')}
                name="city"
                icon={MapPin}
                placeholder={t('adminSupplier.cityPh')}
              />
              <InputField
                label={t('adminSupplier.street')}
                name="street"
                icon={MapPin}
                placeholder={t('adminSupplier.streetPh')}
              />
              <InputField
                label={t('adminSupplier.address')}
                name="address"
                icon={MapPin}
                placeholder={t('adminSupplier.addressPh')}
              />
            </div>
          </motion.div>

          {/* Section 4: Financial & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              {t('adminSupplier.sectionFinancial')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label={t('adminSupplier.commercialRegister')}
                name="commercial_register"
                icon={FileText}
                placeholder={t('adminSupplier.commercialRegisterPh')}
              />
              <InputField
                label={t('adminSupplier.taxNumber')}
                name="tax_number"
                icon={FileText}
                placeholder={t('adminSupplier.taxNumberPh')}
              />
              <div>
                <label className="text-zinc-400 text-sm font-bold mb-1.5 block">{t('adminSupplier.currency')}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <InputField
                label={t('adminSupplier.openingBalance')}
                name="opening_balance"
                icon={DollarSign}
                type="number"
                placeholder="0.00"
              />
            </div>
          </motion.div>

          {/* Submit Button (Mobile) */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/admin/dashboard?tab=suppliers"
              className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm font-bold hover:bg-zinc-700 transition-colors"
            >
              {t('adminSupplier.cancel')}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? t('adminSupplier.saving') : (isEdit ? t('adminSupplier.saveChanges') : t('adminSupplier.addNew'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
