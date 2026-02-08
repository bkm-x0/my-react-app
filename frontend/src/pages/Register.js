import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, Cpu, Scan, Shield, AlertCircle } from 'lucide-react';
import useAuthStore from './store/authStore';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    neuralImplantId: '',
    biometricConsent: false,
    termsAccepted: false,
  });

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        neuralImplantId: formData.neuralImplantId || ''
      };

      await register(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return false;
      }
    } else if (step === 2) {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep(step + 1);
      setError('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyber-muted-pink to-cyber-muted-blue rounded-xl mb-4">
            <UserPlus className="h-10 w-10 text-cyber-black" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-2">
            <span className="text-cyber-muted-blue">JOIN THE</span>
            <span className="text-cyber-muted-pink"> NETWORK</span>
          </h1>
          <p className="text-gray-300">
            Create your cybernetic profile in {4 - step} simple step{4 - step !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-cyber-gray/50 -z-10"></div>
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step >= stepNum
                  ? 'bg-cyber-muted-blue text-cyber-black'
                  : 'bg-cyber-gray text-gray-400'
              } font-orbitron font-bold`}>
                {stepNum}
              </div>
              <span className={`text-sm font-orbitron ${
                step >= stepNum ? 'text-cyber-muted-blue' : 'text-gray-400'
              }`}>
                {stepNum === 1 ? 'BASIC INFO' : stepNum === 2 ? 'SECURITY' : 'CONFIRM'}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-cyber-muted-pink/20 border border-cyber-muted-pink rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-cyber-muted-pink mr-3" />
              <p className="text-cyber-muted-pink">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="cyber-card">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  BASIC INFORMATION
                </h2>
                
                {/* Username */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    USERNAME *
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your network handle"
                      className="cyber-input pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    This will be your public identity in the network
                  </p>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@cyberstore.com"
                      className="cyber-input pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Quantum-encrypted communication only
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-pink">
                  SECURITY SETUP
                </h2>
                
                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    PASSWORD *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="cyber-input pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted-purple disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      {['WEAK', 'MEDIUM', 'STRONG', 'QUANTUM'].map((level, index) => (
                        <div
                          key={level}
                          className={`flex-1 h-2 rounded ${
                            formData.password.length >= index * 3 + 3 
                              ? 'bg-cyber-muted-green' 
                              : 'bg-cyber-gray'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Password strength: <span className="text-cyber-muted-green">
                        {formData.password.length < 6 ? 'WEAK' : 
                         formData.password.length < 9 ? 'MEDIUM' : 
                         formData.password.length < 12 ? 'STRONG' : 'QUANTUM'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    CONFIRM PASSWORD *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="cyber-input pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted-purple disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Neural Implant ID (Optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                    NEURAL IMPLANT ID (OPTIONAL)
                  </label>
                  <div className="relative">
                    <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-muted-purple" />
                    <input
                      type="text"
                      name="neuralImplantId"
                      value={formData.neuralImplantId}
                      onChange={handleChange}
                      placeholder="For neural authentication"
                      className="cyber-input pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Link your neural interface for enhanced security
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-green">
                  CONFIRM & ACTIVATE
                </h2>
                
                {/* Summary */}
                <div className="mb-6 p-4 bg-cyber-dark/50 border border-cyber-muted-blue/30 rounded-lg">
                  <h3 className="font-orbitron font-bold mb-3 text-cyber-muted-blue">PROFILE SUMMARY</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Username:</span>
                      <span className="font-mono text-cyber-muted-green">{formData.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="font-mono text-cyber-muted-green">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Security:</span>
                      <span className="font-mono text-cyber-muted-green">Quantum-Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mr-3 mt-1"
                      required
                      disabled={loading}
                    />
                    <span className={`text-sm ${loading ? 'text-gray-500' : 'text-gray-300'}`}>
                      I accept the{' '}
                      <Link to="/terms" className="text-cyber-muted-blue hover:text-cyber-muted-pink">
                        Neural Network Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-cyber-muted-blue hover:text-cyber-muted-pink">
                        Quantum Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Biometric Consent */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="biometricConsent"
                      checked={formData.biometricConsent}
                      onChange={handleChange}
                      className="mr-3 mt-1"
                      disabled={loading}
                    />
                    <span className={`text-sm ${loading ? 'text-gray-500' : 'text-gray-300'}`}>
                      I consent to biometric authentication for enhanced security.
                      <span className="block text-xs text-gray-400 mt-1">
                        (Optional) Allows fingerprint and retinal scanning
                      </span>
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="px-6 py-3 border border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple hover:text-cyber-black transition-colors font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BACK
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  className={`${step > 1 ? 'ml-auto' : 'w-full'} cyber-button py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  CONTINUE
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`${step > 1 ? 'ml-auto' : 'w-full'} cyber-button py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      ACTIVATING...
                    </span>
                  ) : (
                    'ACTIVATE PROFILE'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-gray-400">Already have a profile? </span>
          <Link 
            to="/login" 
            className="text-cyber-muted-pink hover:text-cyber-muted-blue font-orbitron"
          >
            ACCESS NETWORK
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-cyber-dark/50 border border-cyber-muted-green/30 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-5 w-5 text-cyber-muted-green mr-2" />
            <span className="font-orbitron font-bold text-cyber-muted-green">QUANTUM-SECURE REGISTRATION</span>
          </div>
          <p className="text-sm text-gray-300">
            All data is encrypted end-to-end. Your neural patterns are never stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
