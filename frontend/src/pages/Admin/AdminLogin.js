import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Eye, EyeOff, Mail } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      
      // Get the updated user from the store after login
      const currentUser = useAuthStore.getState().user;
      
      // Check if user has admin role
      if (currentUser?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        // Logout non-admin user
        useAuthStore.getState().logout();
        return;
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-2xl mb-4">
            <Shield className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-orange-400">ADMIN</span>
            <span className="text-white"> ACCESS</span>
          </h1>
          <p className="text-zinc-400">
            Restricted area — Authorized personnel only
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-orange-400">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 pl-10 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-orange-400">
                ADMIN PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 pl-10 pr-10 rounded-xl outline-none transition-colors placeholder:text-zinc-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl px-4 py-3 text-lg mb-6 transition-colors disabled:opacity-50"
            >
              {loading ? 'ACCESSING...' : 'ENTER ADMIN PANEL'}
            </button>

            <div className="text-center text-sm text-zinc-400">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                <span>Secure connection active</span>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">NOTE:</span> Unauthorized access will be logged and reported
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
