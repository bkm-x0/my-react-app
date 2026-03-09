import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, Zap, CheckCircle, Check, X } from 'lucide-react';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.ok).length;
  const strengthColor = ['bg-zinc-700', 'bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-emerald-500'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (strength < 2) { setError('Please choose a stronger password.'); return; }
    if (!token) { setError('No reset token found. Please click the link from your email.'); return; }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 font-bold mb-2">Invalid reset link</p>
          <Link to="/forgot-password" className="text-orange-400 hover:text-orange-300 text-sm">Request a new one →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-black text-xl tracking-wider">CYBER<span className="text-orange-400">STORE</span></span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-orange-400" />
                </div>
                <h1 className="text-white font-black text-2xl mb-2">Reset Password</h1>
                <p className="text-zinc-400 text-sm">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-xs font-bold text-orange-400 mb-1.5 uppercase">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm rounded-xl outline-none transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-zinc-700'}`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {checks.map((c, i) => (
                          <div key={i} className={`flex items-center gap-1 text-xs ${c.ok ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-bold text-orange-400 mb-1.5 uppercase">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full pl-10 pr-10 py-3 bg-zinc-800 border text-white text-sm rounded-xl outline-none transition-colors ${
                        confirm && confirm !== password ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Reset Password <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Password Reset!</h2>
              <p className="text-zinc-400 text-sm mb-4">Your password has been updated. Redirecting to login…</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Go to Login →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
