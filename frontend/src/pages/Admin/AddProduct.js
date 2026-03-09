import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Plus, Trash2, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { productAPI, supplierAPI } from '../../services/api';
import useLangStore from '../store/langStore';

const inputClasses = "w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { t } = useLangStore();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'desktops',
    stock: '',
    sku: '',
    manufacturer: '',
    warranty: '1 year',
    features: [''],
    specifications: {},
    tags: [],
    isFeatured: false,
    image: null,
    supplierId: ''
  });

  // Fetch existing product data for edit mode
  useEffect(() => {
    // Fetch suppliers list
    const fetchSuppliers = async () => {
      try {
        const { data } = await supplierAPI.getSuppliers({ limit: 100 });
        setSuppliers(data.suppliers || []);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      }
    };
    fetchSuppliers();

    if (!isEditMode) return;
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const { data } = await productAPI.getProduct(id);
        const imgBase = `http://${window.location.hostname}:5000`;
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price != null ? String(data.price) : '',
          category: data.category_slug || data.category || data.category_name || 'desktops',
          stock: data.stock != null ? String(data.stock) : '',
          sku: data.sku || '',
          manufacturer: data.manufacturer || '',
          warranty: data.warranty || '1 year',
          features: (data.features && data.features.length > 0) ? data.features : [''],
          specifications: data.specifications || {},
          tags: data.tags || [],
          isFeatured: data.is_featured || data.isFeatured || false,
          image: data.image ? (data.image.startsWith('http') ? data.image : `${imgBase}${data.image}`) : null,
          supplierId: data.supplier_id ? String(data.supplier_id) : ''
        });
      } catch (err) {
        setError('Failed to load product data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

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
    { value: 'desktops', label: 'Gaming Desktops' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'components', label: 'Components' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'monitors', label: 'Monitors' },
    { value: 'peripherals', label: 'Peripherals' },
    { value: 'storage', label: 'Storage' },
    { value: 'networking', label: 'Networking' },
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

      const productData = {
        name: formData.name,
        description: formData.description || 'No description',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        sku: formData.sku,
        isFeatured: formData.isFeatured,
        features: formData.features.filter(f => f.trim() !== ''),
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : null
      };

      if (formData.image) {
        productData.image = formData.image;  // base64 or URL
      }

      console.log(`${isEditMode ? 'Updating' : 'Sending'} product data:`, productData);

      const response = isEditMode
        ? await productAPI.updateProduct(id, productData)
        : await productAPI.createProduct(productData);
      
      if (response.status === 201 || response.status === 200) {
        navigate('/admin/dashboard?tab=products');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, error);
      let errorMessage = `Error ${isEditMode ? 'updating' : 'adding'} product`;
      
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in as admin';
      } else if (error.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have admin permissions';
      } else if (error.response?.status === 400) {
        errorMessage = `Bad request: ${error.response.data?.message || 'Invalid data'}`;
      } else if (error.response?.status === 500) {
        errorMessage = `Server error: ${error.response.data?.error || error.response.data?.message || 'Check backend logs'}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
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

  const handleImageUrl = (e) => {
    const url = e.target.value.trim();
    setFormData(prev => ({ ...prev, image: url || null }));
  };

  const clearImage = () => setFormData(prev => ({ ...prev, image: null }));

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
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-orange-400">{isEditMode ? 'EDIT' : 'ADD'}</span>
              <span className="text-white"> PRODUCT</span>
            </h1>
            <p className="text-zinc-400">{isEditMode ? 'Edit existing product details' : 'Add a new product to the store'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard?tab=products')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-bold rounded-xl px-4 py-2 transition-colors"
            >
              <X className="h-4 w-4 mr-2 inline" />
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || loadingProduct}
              className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl px-4 py-2 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              {loading ? 'SAVING...' : isEditMode ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
            </button>
          </div>
        </div>

        {loadingProduct && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}

        {!loadingProduct && <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-orange-400">
                  BASIC INFORMATION
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-orange-400">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                      placeholder="e.g., Neural Interface MK.III"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-orange-400">
                      DESCRIPTION *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`${inputClasses} min-h-[150px]`}
                      required
                      placeholder="Detailed description of the product..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-orange-400">
                        PRICE ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                        min="0"
                        step="0.01"
                        placeholder="2999.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-orange-400">
                        STOCK QUANTITY *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                        min="0"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-orange-400">
                        SKU *
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                        placeholder="NI-MKIII-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-orange-400">
                        MANUFACTURER
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Manufacturer name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-400">
                    FEATURES
                  </h2>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl px-3 py-2 transition-colors"
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
                        className={`${inputClasses} flex-1 mr-3`}
                        placeholder="e.g., 256-Channel Neural Sensors"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
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
                    <h3 className="text-lg font-bold text-orange-400">SPECIFICATIONS</h3>
                    <button type="button" onClick={addSpec} className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl px-3 py-2 transition-colors text-sm">Add spec</button>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(formData.specifications || {}).length === 0 && (
                      <div className="text-sm text-zinc-400">No specifications added yet.</div>
                    )}
                    {Object.entries(formData.specifications || {}).map(([k, v], idx) => (
                      <div key={String(k) + idx} className="flex gap-2 items-center">
                        <input className={`${inputClasses} w-1/3`} value={k} onChange={(e) => updateSpecKey(k, e.target.value)} placeholder="Spec name" />
                        <input className={`${inputClasses} flex-1`} value={v} onChange={(e) => updateSpecValue(k, e.target.value)} placeholder="Spec value" />
                        <button type="button" onClick={() => removeSpec(k)} className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Product Image Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-orange-400">
                  PRODUCT IMAGE
                </h2>

                <div className="space-y-4">
                  {/* Preview */}
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-xl border border-zinc-700"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center">
                      <span className="text-zinc-600 text-sm">No image selected</span>
                    </div>
                  )}

                  {/* File Upload */}
                  <label className="block">
                    <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-orange-400 mb-2" />
                      <p className="text-sm text-zinc-400">Click to upload image file</p>
                      <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-zinc-700" />
                    <span className="text-zinc-500 text-xs">OR</span>
                    <div className="flex-1 h-px bg-zinc-700" />
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">IMAGE URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image && formData.image.startsWith('http') ? formData.image : ''}
                      onChange={handleImageUrl}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Category & Status Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-orange-400">
                  CATEGORY & STATUS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-orange-400">
                      CATEGORY *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClasses}
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
                    <label className="block text-sm font-bold mb-2 text-orange-400">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      {t('addProduct.supplier') || 'SUPPLIER'}
                    </label>
                    <select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">{t('addProduct.noSupplier') || '-- No Supplier --'}</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-orange-400">
                      WARRANTY
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleChange}
                      className={inputClasses}
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
                      className="mr-3 accent-orange-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-bold text-orange-400">
                      MARK AS FEATURED PRODUCT
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-orange-400">
                  PREVIEW
                </h2>

                <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="w-full h-40 object-cover rounded-xl mb-4"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="h-40 bg-zinc-700 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-zinc-500 text-xs">No image</span>
                    </div>
                  )}
                  <div className="font-bold text-white mb-2">
                    {formData.name || 'Product Name'}
                  </div>
                  <div className="text-emerald-400 font-mono mb-2">
                    {formData.price ? `$${formData.price}` : '$0'}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {formData.category ? categories.find(c => c.value === formData.category)?.label : 'Category'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>}
      </div>
    </div>
  );
};

export default AddProduct;
