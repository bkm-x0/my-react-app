import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Zap, CheckCircle, Home } from 'lucide-react';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Home link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors text-sm font-bold group">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </motion.div>

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
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-orange-400" />
                </div>
                <h1 className="text-white font-black text-2xl mb-2">Forgot Password?</h1>
                <p className="text-zinc-400 text-sm">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-orange-400 mb-1.5 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-zinc-500 text-sm mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-orange-400 hover:text-orange-300 font-bold">Log in</Link>
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Check Your Email</h2>
              <p className="text-zinc-400 text-sm mb-6">
                If <strong className="text-white">{email}</strong> is registered, you'll receive a password reset link shortly. Check your spam folder too.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Back to Login →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
