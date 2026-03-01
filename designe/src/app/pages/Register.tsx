import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone, ArrowRight, Loader2, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const { setIsLoggedIn, setUser } = useStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ism majburiy";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "To'g'ri email kiriting";
    if (!form.phone.trim()) e.phone = "Telefon raqam majburiy";
    if (form.password.length < 6) e.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
    if (form.password !== form.confirm) e.confirm = "Parollar mos kelmaydi";
    if (!agreed) e.agreed = "Shartlarga rozi bo'lishingiz kerak";
    return e;
  };

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoggedIn(true);
    setUser({ name: form.name, email: form.email });
    setLoading(false);
    navigate('/');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Juda zaif', 'Zaif', "O'rtacha", 'Kuchli', 'Juda kuchli'];

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1695480553563-4db8f08781d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
          alt="bg"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-orange-950/20" />

      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

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
            <h1 className="text-white font-black text-2xl">Hisob yaratish</h1>
            <p className="text-zinc-400 text-sm mt-1">K PC Store oilasiga qo'shiling</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Ism va familiya</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className={`w-full bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className={`w-full bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            {/* Phone */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={`w-full bg-zinc-800 border ${errors.phone ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="Parol kiriting"
                  className={`w-full bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-11 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">{strengthLabels[strength]}</p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </motion.div>

            {/* Confirm */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Parolni tasdiqlang</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => handleChange('confirm', e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className={`w-full bg-zinc-800 border ${errors.confirm ? 'border-red-500' : form.confirm && form.confirm === form.password ? 'border-emerald-500' : 'border-zinc-700 focus:border-orange-500'} text-white text-sm pl-10 pr-11 py-3.5 rounded-xl outline-none transition-colors placeholder:text-zinc-600`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {form.confirm && form.confirm === form.password && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-zinc-500 hover:text-zinc-300">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </motion.div>

            {/* Agreement */}
            <label className={`flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border transition-colors ${errors.agreed ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
              <div
                onClick={() => { setAgreed(!agreed); setErrors(e => ({ ...e, agreed: '' })); }}
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-orange-500' : 'bg-zinc-700 hover:bg-zinc-600'}`}
              >
                {agreed && <Check className="w-3 h-3 text-black" />}
              </div>
              <span className="text-zinc-400 text-xs leading-relaxed">
                K PC Store{' '}
                <button type="button" className="text-orange-400 hover:text-orange-300">foydalanish shartlari</button>{' '}
                va{' '}
                <button type="button" className="text-orange-400 hover:text-orange-300">maxfiylik siyosati</button>
                {' '}bilan tanishdim va roziман.
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 25px rgba(249,115,22,0.35)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black disabled:text-zinc-500 font-black rounded-xl transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Ro'yxatdan o'tmoqda...</>
              ) : (
                <><span>Hisob yaratish</span><ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-zinc-400 text-sm mt-6">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">Kirish</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
