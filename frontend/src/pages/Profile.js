import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Package, Shield, LogOut, Edit, Save, Bell, Cpu, Fingerprint, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    neuralImplantId: '',
    biometricEnabled: false,
    neuralAuthEnabled: false,
  });
  
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      username: user.username || '',
      email: user.email || '',
      neuralImplantId: user.neuralImplantId || '',
      biometricEnabled: user.biometricEnabled || false,
      neuralAuthEnabled: user.neuralAuthEnabled || false,
    });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: User },
    { id: 'security', label: 'SECURITY', icon: Shield },
    { id: 'orders', label: 'ORDERS', icon: Package },
    { id: 'billing', label: 'BILLING', icon: CreditCard },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-muted-blue mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-orbitron font-bold mb-4">
          <span className="text-cyber-muted-blue">CYBERNETIC</span>
          <span className="text-cyber-muted-pink"> PROFILE</span>
        </h1>
        <p className="text-gray-300">
          Manage your neural connections, security protocols, and transaction history
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-cyber-muted-pink/20 border border-cyber-muted-pink rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-cyber-muted-pink mr-3" />
            <p className="text-cyber-muted-pink">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-cyber-muted-green/20 border border-cyber-muted-green rounded-lg">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-cyber-muted-green rounded-full flex items-center justify-center mr-3">
              <div className="h-2 w-2 bg-cyber-black rounded-full"></div>
            </div>
            <p className="text-cyber-muted-green">{success}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="cyber-card sticky top-24">
            {/* User Profile Summary */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyber-muted-blue to-cyber-muted-pink rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-cyber-black" />
              </div>
              <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue mb-2">
                {user.username}
              </h2>
              <div className="text-sm text-gray-400 mb-4">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="px-3 py-1 bg-cyber-muted-green/20 border border-cyber-muted-green text-cyber-muted-green text-sm font-orbitron inline-block rounded">
                {user.role.toUpperCase()}
              </div>
              
              {/* Balance */}
              <div className="mt-6 p-4 bg-cyber-dark/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">BALANCE</div>
                <div className="text-2xl font-orbitron font-bold text-cyber-muted-green">
                  {user.balance.toLocaleString()}₡
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyber-muted-blue text-cyber-black'
                        : 'text-gray-300 hover:bg-cyber-gray/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-orbitron font-bold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black transition-colors rounded-lg font-orbitron"
            >
              <LogOut className="h-5 w-5 mr-2" />
              LOGOUT
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="cyber-card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">
                    PROFILE INFORMATION
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors"
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? 'SAVE' : 'EDIT'}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-orbitron font-bold mb-2 text-gray-400">
                          USERNAME
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="cyber-input"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-cyber-dark border border-cyber-gray/30 rounded-lg font-mono">
                            {user.username}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-orbitron font-bold mb-2 text-gray-400">
                          EMAIL
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="cyber-input"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-cyber-dark border border-cyber-gray/30 rounded-lg font-mono">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-gray-400">
                        NEURAL IMPLANT ID
                      </label>
                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="text"
                            name="neuralImplantId"
                            value={formData.neuralImplantId}
                            onChange={handleChange}
                            className="cyber-input flex-1"
                          />
                        ) : (
                          <div className="flex-1 px-4 py-3 bg-cyber-dark border border-cyber-muted-purple/30 rounded-lg font-mono">
                            {user.neuralImplantId || 'Not configured'}
                          </div>
                        )}
                        <Cpu className="ml-3 h-5 w-5 text-cyber-muted-purple" />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t border-cyber-gray/30">
                        <button
                          type="submit"
                          className="cyber-button px-6"
                        >
                          UPDATE PROFILE
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="cyber-card text-center">
                  <div className="text-4xl font-orbitron font-bold text-cyber-muted-green mb-2">
                    0
                  </div>
                  <div className="text-gray-400">TOTAL ORDERS</div>
                </div>
                <div className="cyber-card text-center">
                  <div className="text-4xl font-orbitron font-bold text-cyber-muted-blue mb-2">
                    0
                  </div>
                  <div className="text-gray-400">ACTIVE IMPLANTS</div>
                </div>
                <div className="cyber-card text-center">
                  <div className="text-4xl font-orbitron font-bold text-cyber-muted-pink mb-2">
                    0₡
                  </div>
                  <div className="text-gray-400">TOTAL SPENT</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="cyber-card">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                SECURITY SETTINGS
              </h2>
              
              <div className="space-y-6">
                {/* Neural Authentication */}
                <div className="p-4 bg-cyber-dark border border-cyber-muted-purple/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Cpu className="h-6 w-6 text-cyber-muted-purple mr-3" />
                      <div>
                        <h3 className="font-orbitron font-bold text-lg">NEURAL AUTHENTICATION</h3>
                        <p className="text-sm text-gray-400">Direct neural interface login</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="neuralAuthEnabled"
                        checked={formData.neuralAuthEnabled}
                        onChange={handleChange}
                        className="sr-only"
                        id="neural-auth"
                        disabled={!isEditing}
                      />
                      <label
                        htmlFor="neural-auth"
                        className={`block w-14 h-8 rounded-full cursor-pointer ${
                          formData.neuralAuthEnabled ? 'bg-cyber-muted-purple' : 'bg-cyber-gray'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-cyber-black transition-transform ${
                          formData.neuralAuthEnabled ? 'transform translate-x-8' : 'transform translate-x-1'
                        }`}></div>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Connect your neural implant for seamless, thought-based authentication.
                    Reduces login time by 98%.
                  </p>
                </div>

                {/* Biometric Authentication */}
                <div className="p-4 bg-cyber-dark border border-cyber-muted-green/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Fingerprint className="h-6 w-6 text-cyber-muted-green mr-3" />
                      <div>
                        <h3 className="font-orbitron font-bold text-lg">BIOMETRIC SCAN</h3>
                        <p className="text-sm text-gray-400">Fingerprint & retinal recognition</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="biometricEnabled"
                        checked={formData.biometricEnabled}
                        onChange={handleChange}
                        className="sr-only"
                        id="biometric-auth"
                        disabled={!isEditing}
                      />
                      <label
                        htmlFor="biometric-auth"
                        className={`block w-14 h-8 rounded-full cursor-pointer ${
                          formData.biometricEnabled ? 'bg-cyber-muted-green' : 'bg-cyber-gray'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-cyber-black transition-transform ${
                          formData.biometricEnabled ? 'transform translate-x-8' : 'transform translate-x-1'
                        }`}></div>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Enable multi-factor biometric authentication for maximum security.
                    Required for high-value transactions.
                  </p>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-cyber-gray/30">
                    <button
                      onClick={() => {
                        // Save security settings
                        updateProfile(formData);
                        setIsEditing(false);
                      }}
                      className="cyber-button px-6"
                    >
                      SAVE SECURITY SETTINGS
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab !== 'overview' && activeTab !== 'security' && (
            <div className="cyber-card">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                {activeTab.toUpperCase()}
              </h2>
              <p className="text-gray-300">
                {activeTab} features are coming soon. Stay tuned for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
