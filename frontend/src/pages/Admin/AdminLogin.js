import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Cpu, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyber-muted-blue to-cyber-muted-pink rounded-xl mb-4">
            <Shield className="h-10 w-10 text-cyber-black" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-2">
            <span className="text-cyber-muted-blue">ADMIN</span>
            <span className="text-cyber-muted-pink"> ACCESS</span>
          </h1>
          <p className="text-gray-300">
            Restricted area - Authorized personnel only
          </p>
        </div>

        <div className="cyber-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cyberstore.com"
                  className="cyber-input pl-10"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                ADMIN PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="cyber-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted-purple"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-button py-3 text-lg mb-6"
            >
              {loading ? 'ACCESSING...' : 'ENTER ADMIN PANEL'}
            </button>

            <div className="text-center text-sm text-gray-400">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-cyber-muted-green rounded-full animate-pulse mr-2"></div>
                <span>Quantum encryption active</span>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-cyber-dark/50 border border-cyber-muted-blue/30 rounded-lg text-center">
          <p className="text-sm text-gray-300">
            <span className="text-cyber-muted-green">WARNING:</span> Unauthorized access will be logged and reported
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
