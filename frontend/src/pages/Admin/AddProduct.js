import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'neural',
    stock: '',
    sku: '',
    manufacturer: '',
    warranty: '1 year',
    features: [''],
    specifications: {},
    tags: [],
    isFeatured: false,
    image: null
  });

  const addSpec = () => setFormData(f => ({ ...f, specifications: { ...f.specifications, '': '' } }));
  const updateSpecKey = (oldKey, newKey) => {
    setFormData(f => {
      const specs = { ...f.specifications };
      const val = specs[oldKey];
      delete specs[oldKey];
      if (newKey) specs[newKey] = val;
      return { ...f, specifications: specs };
    });
  };
  const updateSpecValue = (key, value) => setFormData(f => ({ ...f, specifications: { ...f.specifications, [key]: value } }));
  const removeSpec = (key) => setFormData(f => { const s = { ...f.specifications }; delete s[key]; return { ...f, specifications: s }; });

  const categories = [
    { value: 'neural', label: 'Neural Tech' },
    { value: 'cybernetic', label: 'Cybernetic Limbs' },
    { value: 'quantum', label: 'Quantum Hardware' },
    { value: 'holographic', label: 'Holographic Tech' },
    { value: 'software', label: 'Software' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.sku || !formData.price || !formData.stock) {
        setError('Please fill all required fields: Name, SKU, Price, Stock');
        setLoading(false);
        return;
      }

      // Get token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated. Please log in as admin.');
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description || 'No description',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        sku: formData.sku,
        isFeatured: formData.isFeatured,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (formData.image && formData.image.startsWith('data:')) {
        productData.image = formData.image;
      }

      console.log('Sending product data:', productData);

      const response = await axios.post(
        'http://localhost:5000/api/products', 
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        navigate('/admin/dashboard?tab=products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      let errorMessage = 'Error adding product';
      
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in as admin';
      } else if (error.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have admin permissions';
      } else if (error.response?.status === 400) {
        errorMessage = `Bad request: ${error.response.data?.message || 'Invalid data'}`;
      } else if (error.response?.status === 500) {
        errorMessage = `Server error: ${error.response.data?.error || error.response.data?.message || 'Check backend logs'}`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Backend is not responding';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error - Make sure backend is running on http://localhost:5000';
      } else {
        errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Unknown error';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-cyber-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold">
              <span className="text-cyber-muted-blue">ADD</span>
              <span className="text-cyber-muted-pink"> PRODUCT</span>
            </h1>
            <p className="text-gray-300">Add new cybernetic product to store</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard?tab=products')}
              className="px-4 py-2 border border-cyber-muted-purple text-cyber-muted-purple hover:bg-cyber-muted-purple hover:text-cyber-black rounded-lg"
            >
              <X className="h-4 w-4 mr-2 inline" />
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cyber-button"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              {loading ? 'SAVING...' : 'SAVE PRODUCT'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-cyber-muted-pink/20 border border-cyber-muted-pink rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-cyber-muted-pink mr-3" />
              <span className="text-cyber-muted-pink">{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  BASIC INFORMATION
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                      placeholder="e.g., Neural Interface MK.III"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                      DESCRIPTION *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="cyber-input min-h-[150px]"
                      required
                      placeholder="Detailed description of the product..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                        PRICE (₡) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="cyber-input"
                        required
                        min="0"
                        step="0.01"
                        placeholder="2999.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                        STOCK QUANTITY *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="cyber-input"
                        required
                        min="0"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                        SKU *
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="cyber-input"
                        required
                        placeholder="NI-MKIII-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                        MANUFACTURER
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="cyber-input"
                        placeholder="Cybernet Corporation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Card */}
              <div className="cyber-card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">
                    FEATURES
                  </h2>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center px-3 py-2 border border-cyber-muted-green text-cyber-muted-green hover:bg-cyber-muted-green hover:text-cyber-black rounded-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    ADD FEATURE
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="cyber-input flex-1 mr-3"
                        placeholder="e.g., 256-Channel Neural Sensors"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Specifications editor */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-orbitron font-bold text-cyber-muted-blue">SPECIFICATIONS</h3>
                    <button type="button" onClick={addSpec} className="px-3 py-2 border border-cyber-muted-green text-cyber-muted-green rounded-lg">Add spec</button>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(formData.specifications || {}).length === 0 && (
                      <div className="text-sm text-gray-400">No specifications added yet.</div>
                    )}
                    {Object.entries(formData.specifications || {}).map(([k, v], idx) => (
                      <div key={String(k) + idx} className="flex gap-2 items-center">
                        <input className="cyber-input w-1/3" value={k} onChange={(e) => updateSpecKey(k, e.target.value)} placeholder="Spec name" />
                        <input className="cyber-input flex-1" value={v} onChange={(e) => updateSpecValue(k, e.target.value)} placeholder="Spec value" />
                        <button type="button" onClick={() => removeSpec(k)} className="p-2 border border-cyber-muted-pink text-cyber-muted-pink rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Product Image Card */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  PRODUCT IMAGE
                </h2>

                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative">
                      <img src={formData.image} alt="Product preview" className="w-full h-48 object-cover rounded-lg border border-cyber-muted-blue" />
                    </div>
                  )}
                  <label className="block">
                    <div className="border-2 border-dashed border-cyber-muted-blue rounded-lg p-4 text-center cursor-pointer hover:border-cyber-muted-pink transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-cyber-muted-blue mb-2" />
                      <p className="text-sm text-gray-300">Click to upload image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category & Status Card */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  CATEGORY & STATUS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                      CATEGORY *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-orbitron font-bold mb-2 text-cyber-muted-blue">
                      WARRANTY
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleChange}
                      className="cyber-input"
                      placeholder="1 year"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-orbitron font-bold text-cyber-muted-blue">
                      MARK AS FEATURED PRODUCT
                    </label>
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  PRODUCT IMAGES
                </h2>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-cyber-muted-blue/50 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-cyber-muted-blue mx-auto mb-4" />
                    <div className="font-orbitron font-bold mb-2">UPLOAD IMAGES</div>
                    <p className="text-sm text-gray-400 mb-4">
                      Drag & drop or click to upload
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black rounded-lg"
                    >
                      BROWSE FILES
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 bg-cyber-muted-green rounded-full mr-2"></div>
                      <span>Recommended size: 800x600px</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-cyber-muted-green rounded-full mr-2"></div>
                      <span>Max file size: 5MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="cyber-card">
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">
                  PREVIEW
                </h2>

                <div className="p-4 bg-cyber-dark border border-cyber-gray/30 rounded-lg">
                  <div className="h-40 bg-cyber-gray rounded-lg mb-4"></div>
                  <div className="font-orbitron font-bold mb-2">
                    {formData.name || 'Product Name'}
                  </div>
                  <div className="text-cyber-muted-green font-mono mb-2">
                    {formData.price ? `${formData.price}₡` : '0₡'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formData.category ? categories.find(c => c.value === formData.category)?.label : 'Category'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
