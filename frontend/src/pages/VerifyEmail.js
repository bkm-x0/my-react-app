import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Mail, Zap } from 'lucide-react';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const verifyAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in link.');
      return;
    }
    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

    authAPI.verifyEmail(token)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired verification link.');
      });
  }, [token, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendMsg('');
    try {
      const res = await authAPI.resendVerification(resendEmail);
      setResendMsg(res.data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-400" />
            <span className="text-white font-black text-xl tracking-wider">CYBER<span className="text-orange-400">STORE</span></span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Verifying your email…</h2>
              <p className="text-zinc-400 text-sm">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Email Verified!</h2>
              <p className="text-zinc-400 text-sm mb-6">{message}</p>
              <p className="text-zinc-500 text-xs mb-4">Redirecting to login in 3 seconds…</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Go to Login →
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Verification Failed</h2>
              <p className="text-zinc-400 text-sm mb-8">{message}</p>

              {/* Resend form */}
              <div className="border-t border-zinc-800 pt-6">
                <p className="text-zinc-400 text-sm font-bold mb-3">Resend verification email</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={e => setResendEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors"
                  >
                    {resending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Resend Verification Email'}
                  </button>
                </form>
                {resendMsg && (
                  <p className="mt-3 text-sm text-emerald-400">{resendMsg}</p>
                )}
              </div>
              <div className="mt-4">
                <Link to="/login" className="text-orange-400 hover:text-orange-300 text-sm">← Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
