import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Cpu, Fingerprint, AlertCircle, Shield, XCircle } from 'lucide-react';
import useAuthStore from './store/authStore';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    neuralToken: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [enable2FA, setEnable2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const showPasswordTimeoutRef = useRef(null);
  
  const { login, isAuthenticated, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Check lock status on mount
  useEffect(() => {
    const storedLock = localStorage.getItem('loginLockUntil');
    if (storedLock && Date.now() < parseInt(storedLock)) {
      setLockUntil(parseInt(storedLock));
    }
  }, []);

  // Update password strength
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  // Auto-hide password after 3 seconds
  useEffect(() => {
    return () => {
      if (showPasswordTimeoutRef.current) {
        clearTimeout(showPasswordTimeoutRef.current);
      }
    };
  }, []);

  // Display auth store errors
  useEffect(() => {
    if (authError) {
      // Handle specific error cases
      if (authError.code === 'INVALID_CREDENTIALS') {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 5) {
          const lockTime = Date.now() + (15 * 60 * 1000); // 15 minutes
          setLockUntil(lockTime);
          localStorage.setItem('loginLockUntil', lockTime.toString());
          setError('Too many failed attempts. Account locked for 15 minutes');
        } else {
          setError(`${authError.message} (Attempt ${newFailedAttempts}/5)`);
        }
      } else {
        setError(authError.message);
      }
    }
  }, [authError, failedAttempts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        const form = document.querySelector('form');
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (loginMethod === 'password') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (loginMethod === 'neural') {
      if (!formData.neuralToken.trim()) {
        newErrors.neuralToken = 'Neural token is required';
      } else if (formData.neuralToken.length < 12) {
        newErrors.neuralToken = 'Token must be at least 12 characters';
      }
    }
    
    return newErrors;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    if (showPasswordTimeoutRef.current) {
      clearTimeout(showPasswordTimeoutRef.current);
    }
    showPasswordTimeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 3000);
  };


// في مكون Login.js، أضف هذه الوظيفة قبل handleSubmit
const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('Backend connection OK:', data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// تحديث handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setErrors({});
  
  // Validate form
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setLoading(true);
  
  // Test connection first
  const isBackendConnected = await testBackendConnection();
  
  if (!isBackendConnected) {
    setError('Cannot connect to backend server. Please make sure it is running on http://localhost:5000');
    setLoading(false);
    return;
  }
  
  try {
    if (loginMethod === 'password') {
      await login(formData.email, formData.password, undefined, rememberMe);
      
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      localStorage.removeItem('loginLockUntil');
      navigate(redirect);
      
    } else if (loginMethod === 'neural') {
      setError('Neural authentication is currently under development');
      setLoading(false);
    } else {
      setError('Biometric authentication is currently under development');
      setLoading(false);
    }
  } catch (err) {
    // Error is already handled by the auth store
    console.error('Login error:', err);
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
    if (error) setError('');
  };

  // Get lock status message
  const getLockMessage = () => {
    if (!lockUntil) return null;
    const now = Date.now();
    if (now < lockUntil) {
      const minutesLeft = Math.ceil((lockUntil - now) / 60000);
      return `Locked for ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-muted-blue to-cyber-muted-pink rounded-xl mb-4">
            <Lock className="h-8 w-8 text-cyber-black" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-2">
            <span className="text-cyber-muted-blue">NETWORK</span>
            <span className="text-cyber-muted-pink"> ACCESS</span>
          </h1>
          <p className="text-gray-300">
            Authenticate to access your cybernetic profile
          </p>
        </div>

        {/* Lock Status */}
        {getLockMessage() && (
          <div className="mb-6 p-3 bg-cyber-muted-pink/20 border border-cyber-muted-pink rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-cyber-muted-pink mr-2" />
              <p className="text-sm text-cyber-muted-pink">
                {getLockMessage()}
              </p>
            </div>
          </div>
        )}

        {/* Login Method Selector */}
        <div className="flex mb-6 border-b border-cyber-gray/50">
          <button
            onClick={() => setLoginMethod('password')}
            disabled={loading || lockUntil}
            className={`flex-1 py-3 font-orbitron font-bold text-center transition-colors ${
              loginMethod === 'password'
                ? 'text-cyber-muted-blue border-b-2 border-cyber-muted-blue'
                : 'text-gray-400 hover:text-cyber-muted-purple disabled:hover:text-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Password login method"
            aria-current={loginMethod === 'password' ? 'page' : undefined}
          >
            PASSWORD
          </button>
          <button
            onClick={() => {
              setLoginMethod('neural');
              setError('Neural authentication coming soon');
            }}
            disabled={loading || lockUntil}
            className={`flex-1 py-3 font-orbitron font-bold text-center transition-colors ${
              loginMethod === 'neural'
                ? 'text-cyber-muted-blue border-b-2 border-cyber-muted-blue'
                : 'text-gray-400 hover:text-cyber-muted-purple disabled:hover:text-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Neural token login method"
            aria-current={loginMethod === 'neural' ? 'page' : undefined}
          >
            NEURAL
          </button>
          <button
            onClick={() => {
              setLoginMethod('biometric');
              setError('Biometric authentication coming soon');
            }}
            disabled={loading || lockUntil}
            className={`flex-1 py-3 font-orbitron font-bold text-center transition-colors ${
              loginMethod === 'biometric'
                ? 'text-cyber-muted-blue border-b-2 border-cyber-muted-blue'
                : 'text-gray-400 hover:text-cyber-muted-purple disabled:hover:text-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Biometric login method"
            aria-current={loginMethod === 'biometric' ? 'page' : undefined}
          >
            BIOMETRIC
          </button>
        </div>

        {/* Login Form */}
        <div className="cyber-card">
          <form onSubmit={handleSubmit} noValidate>
            {loginMethod === 'password' ? (
              <>
                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`cyber-input pl-10 ${errors.email ? 'border-cyber-muted-pink' : ''}`}
                      required
                      disabled={loading || lockUntil}
                      aria-label="Email address"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-cyber-muted-pink flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`cyber-input pl-10 pr-10 ${errors.password ? 'border-cyber-muted-pink' : ''}`}
                      required
                      disabled={loading || lockUntil}
                      aria-label="Password"
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={loading || lockUntil}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted-purple disabled:opacity-50"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-cyber-muted-pink flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Password strength:</span>
                        <span className={`text-xs font-bold ${
                          passwordStrength === 0 ? 'text-gray-400' :
                          passwordStrength <= 2 ? 'text-cyber-muted-pink' :
                          passwordStrength === 3 ? 'text-cyber-muted-blue' :
                          'text-cyber-muted-green'
                        }`}>
                          {passwordStrength === 0 && 'None'}
                          {passwordStrength === 1 && 'Weak'}
                          {passwordStrength === 2 && 'Fair'}
                          {passwordStrength === 3 && 'Good'}
                          {passwordStrength === 4 && 'Strong'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              passwordStrength >= level 
                                ? passwordStrength === 1 ? 'bg-cyber-muted-pink' :
                                  passwordStrength === 2 ? 'bg-yellow-500' :
                                  passwordStrength === 3 ? 'bg-cyber-muted-blue' :
                                  'bg-cyber-muted-green'
                                : 'bg-gray-600'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2FA Option */}
                <div className="mb-6">
                  <label className="flex items-center mb-3">
                    <input 
                      type="checkbox" 
                      checked={enable2FA}
                      onChange={(e) => setEnable2FA(e.target.checked)}
                      className="mr-2"
                      disabled={loading || lockUntil}
                    />
                    <span className={`text-sm ${loading ? 'text-gray-500' : 'text-gray-300'}`}>
                      Two-Factor Authentication
                    </span>
                  </label>
                  
                  {enable2FA && (
                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                        2FA CODE
                      </label>
                      <input
                        type="text"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="cyber-input"
                        maxLength="6"
                        disabled={loading || lockUntil}
                        aria-label="Two-factor authentication code"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Enter code from your authenticator app
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : loginMethod === 'neural' ? (
              <div className="mb-6">
                <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                  NEURAL TOKEN
                </label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                  <input
                    type="text"
                    name="neuralToken"
                    value={formData.neuralToken}
                    onChange={handleChange}
                    placeholder="Enter neural authentication token"
                    className={`cyber-input pl-10 ${errors.neuralToken ? 'border-cyber-muted-pink' : ''}`}
                    required
                    disabled={loading || lockUntil}
                    aria-label="Neural authentication token"
                    aria-required="true"
                    aria-invalid={!!errors.neuralToken}
                    aria-describedby={errors.neuralToken ? "neural-token-error" : undefined}
                  />
                </div>
                {errors.neuralToken && (
                  <p id="neural-token-error" className="mt-1 text-sm text-cyber-muted-pink flex items-center">
                    <XCircle className="h-3 w-3 mr-1" />
                    {errors.neuralToken}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Generate token from your neural interface device
                </p>
              </div>
            ) : (
              <div className="mb-6 text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 border-2 border-cyber-muted-green rounded-full flex items-center justify-center animate-pulse-neon">
                  <Fingerprint className="h-12 w-12 text-cyber-muted-green" />
                </div>
                <p className="text-gray-300">
                  Place your finger on the biometric scanner
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {loading ? 'Scanning...' : 'Ready to scan'}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div 
                className="mb-6 p-3 bg-cyber-muted-pink/20 border border-cyber-muted-pink rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-cyber-muted-pink mr-2" />
                  <p className="text-sm text-cyber-muted-pink">{error}</p>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                  disabled={loading || lockUntil}
                />
                <span className={`text-sm ${loading ? 'text-gray-500' : 'text-gray-300'}`}>
                  Remember this terminal
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className={`text-sm ${loading || lockUntil ? 'text-gray-500 pointer-events-none' : 'text-cyber-muted-blue hover:text-cyber-muted-pink'}`}
              >
                Forgot credentials?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || lockUntil}
              className="w-full cyber-button py-3 text-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" 
                    aria-hidden="true"
                  />
                  AUTHENTICATING...
                  <span className="sr-only">Authenticating, please wait</span>
                </span>
              ) : (
                'ACCESS NETWORK'
              )}
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyber-gray/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-cyber-gray text-gray-400">OR CONNECT WITH</span>
              </div>
            </div>



{/* Add this somewhere in your Login component JSX */}






            {/* Alternative Login Methods */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('neural');
                  setError('Neural authentication coming soon');
                }}
                disabled={loading || lockUntil}
                className="p-3 border border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple hover:text-cyber-black transition-colors font-orbitron text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Switch to neural authentication"
              >
                <Cpu className="inline mr-2 h-4 w-4" />
                NEURAL
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('biometric');
                  setError('Biometric authentication coming soon');
                }}
                disabled={loading || lockUntil}
                className="p-3 border border-cyber-muted-green text-cyber-muted-green hover:bg-cyber-muted-green hover:text-cyber-black transition-colors font-orbitron text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Switch to biometric authentication"
              >
                <Fingerprint className="inline mr-2 h-4 w-4" />
                BIOMETRIC
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-400">New to the network? </span>
              <Link 
                to="/register" 
                className={`font-orbitron ${loading || lockUntil ? 'text-gray-500 pointer-events-none' : 'text-cyber-muted-pink hover:text-cyber-muted-blue'}`}
              >
                CREATE PROFILE
              </Link>
            </div>
          </form>
        </div>

        {/* Security Status */}
        <div className="mt-6 p-4 bg-cyber-dark/50 border border-cyber-muted-blue/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-300">
              <span className="text-cyber-muted-green">SECURITY STATUS:</span>
            </p>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                lockUntil ? 'bg-cyber-muted-pink animate-pulse' : 
                failedAttempts > 0 ? 'bg-yellow-500' : 'bg-cyber-muted-green'
              }`} />
              <span className="text-xs text-gray-400">
                {lockUntil ? 'LOCKED' : failedAttempts > 0 ? 'WARNING' : 'SECURE'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {lockUntil ? `Account locked. ${getLockMessage()}` :
             failedAttempts > 0 ? `${5 - failedAttempts} attempts remaining before lock` :
             'All systems secure. Quantum encryption active'}
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-cyber-muted-purple hover:text-cyber-muted-pink transition-colors"
          >
            ← Back to CyberStore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
