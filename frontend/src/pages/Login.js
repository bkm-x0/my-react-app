import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from './store/authStore';
import useLangStore from './store/langStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useLangStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError("Barcha maydonlarni to'ldiring"); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200" alt="bg" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-orange-950/30" />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/50"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 mb-4"
            >
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
            <h1 className="text-white font-black text-2xl">{t('login.title')}</h1>
            <p className="text-zinc-400 text-sm mt-1">{t('login.sub')}</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">{t('login.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  dir="ltr"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">{t('login.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('login.password')}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm pl-10 pr-11 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                <span className="text-zinc-400 text-sm">{t('login.remember')}</span>
              </label>
              <button type="button" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                Parolni unutdingizmi?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 25px rgba(249,115,22,0.35)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black disabled:text-zinc-500 font-black rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t('login.loading')}</>
              ) : (
                <><span>{t('login.submit')}</span><ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-xs">{t('login.or')}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Demo login */}
          <motion.button
            onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }}
            className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/30 text-zinc-300 font-bold rounded-xl transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('login.demo')}
          </motion.button>

          <p className="text-center text-zinc-400 text-sm mt-6">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
              {t('login.signUp')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
