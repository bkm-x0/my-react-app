import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone, ArrowRight, Loader2, Check, X, Home } from 'lucide-react';
import useAuthStore from './store/authStore';
import useLangStore from './store/langStore';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const { t } = useLangStore();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const passwordChecks = [
    { ok: form.password.length >= 8 },
    { ok: /[A-Z]/.test(form.password) },
    { ok: /[a-z]/.test(form.password) },
    { ok: /[0-9]/.test(form.password) },
    { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.password) },
  ];
  const strength = passwordChecks.filter(c => c.ok).length;
  const strengthLabels = [t('register.passWeak'), t('register.passWeak'), t('register.passWeak2'), t('register.passMedium'), t('register.passGood'), t('register.passStrong')];
  const strengthLabel = strengthLabels[strength];
  const strengthColor = ['', 'bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-green-500'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError(t('common.required')); return; }
    if (form.password !== form.confirmPassword) { setError(t('register.passMismatch') || 'Passwords do not match'); return; }
    if (!agreed) { setError(t('common.required')); return; }
    setLoading(true);
    try {
      await register({ username: form.name, email: form.email, password: form.password });
      setRegistered(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: t('register.name'), icon: User, type: 'text', placeholder: t('register.name'), delay: 0.25 },
    { key: 'email', label: t('register.email'), icon: Mail, type: 'email', placeholder: 'email@example.com', delay: 0.3, dir: 'ltr' },
    { key: 'phone', label: t('register.phone'), icon: Phone, type: 'tel', placeholder: '+1 555 123 4567', delay: 0.35, dir: 'ltr' },
  ];

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-orange-950/30" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors text-sm font-bold group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t('nav.home')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/50"
        >
          {registered ? (
            <div className="text-center py-4">
              <Check className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-white font-black text-2xl mb-2">Check Your Email!</h2>
              <p className="text-zinc-400 text-sm mb-2">
                We've sent a verification link to{' '}
                <strong className="text-white">{form.email}</strong>.
              </p>
              <p className="text-zinc-500 text-xs mb-6">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
              <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm transition-colors">
                Go to Login →
              </Link>
            </div>
          ) : (<>
          {/* Logo */}
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 mb-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-orange-500 rounded-xl rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black relative z-10" fill="black" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-2xl tracking-tight">K PC</span>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Store</span>
              </div>
            </motion.div>
            <h1 className="text-white font-black text-2xl">{t('register.title')}</h1>
            <p className="text-zinc-400 text-sm mt-1">{t('register.sub')}</p>
          </div>

          {error && (
            <motion.div id="register-error" role="alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={error ? 'register-error' : undefined} noValidate>
            {fields.map(f => (
              <motion.div key={f.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: f.delay }}>
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={set(f.key)}
                    placeholder={f.placeholder}
                    dir={f.dir || 'auto'}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </motion.div>
            ))}

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">{t('register.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder={t('register.passHint')}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-10 pr-11 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength */}
              {form.password && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                  <div className="flex gap-1 mb-1.5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">{strengthLabel}</span>
                    <span className="text-zinc-600">{strength}/5</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">{t('register.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder={t('register.passRepeat')}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-10 pr-11 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirmPassword && (
                  <span className="absolute right-10 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <X className="w-4 h-4 text-red-500" />}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 accent-orange-500 mt-0.5" />
              <span className="text-zinc-400 text-sm">
                <a href="#" className="text-orange-400 hover:text-orange-300 underline-offset-2 hover:underline">{t('register.termsLink')}</a>{' '}
                {t('register.and')}{' '}
                <a href="#" className="text-orange-400 hover:text-orange-300 underline-offset-2 hover:underline">{t('register.privacyLink')}</a>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading || !agreed}
              whileHover={!loading && agreed ? { scale: 1.02, boxShadow: '0 0 25px rgba(249,115,22,0.35)' } : {}}
              whileTap={!loading && agreed ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black disabled:text-zinc-500 font-black rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t('register.loading')}</>
              ) : (
                <><span>{t('register.submit')}</span><ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-zinc-400 text-sm mt-6">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
              {t('register.signIn')}
            </Link>
          </p>
          </>)}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
