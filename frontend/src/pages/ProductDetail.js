import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Package, Shield, Zap, CreditCard, Truck, RotateCcw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('standard');

  // Mock product data
  const product = {
    id: 1,
    name: 'Neural Interface MK.II',
    description: 'The Neural Interface MK.II represents the pinnacle of brain-computer interface technology. Featuring 256-channel neural sensors, quantum-safe encryption, and AI-assisted calibration, this device allows for seamless interaction with digital systems through thought alone.',
    price: 2999,
    category: 'biotech',
    rating: 4.8,
    reviews: 128,
    stock: 15,
    sku: 'NI-MKII-256-QS',
    features: [
      '256-Channel Neural Sensors',
      'Quantum-Safe Encryption',
      'AI-Assisted Calibration',
      'Wireless Data Transfer (10Gb/s)',
      'Biometric Security',
      'Multi-Platform Compatibility',
      'Real-Time Neural Monitoring',
      'Self-Healing Firmware'
    ],
    specifications: {
      'Neural Channels': '256',
      'Data Rate': '10 Gb/s',
      'Latency': '< 2ms',
      'Battery Life': '72 hours',
      'Encryption': 'Quantum-Safe AES-512',
      'Compatibility': 'All major OS',
      'Warranty': '5 years',
      'Weight': '45g'
    }
  };

  const relatedProducts = [
    { id: 2, name: 'Neural OS v2.1', price: 899, category: 'software' },
    { id: 3, name: 'Data Jack Pro', price: 499, category: 'accessories' },
    { id: 4, name: 'Cybernetic Eye Sigma', price: 3499, category: 'augmentations' },
  ];

  const options = [
    { id: 'standard', name: 'Standard Package', price: product.price },
    { id: 'pro', name: 'Pro Package', price: 3499, includes: ['Interface', 'Neural OS', 'Installation Kit'] },
    { id: 'enterprise', name: 'Enterprise Package', price: 4999, includes: ['Interface', 'Neural OS', 'Priority Support', 'Training'] }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/products" className="inline-flex items-center text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          BACK TO PRODUCTS
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Product Images & Info */}
        <div>
          {/* Product Image */}
          <div className="cyber-card mb-6">
            <div className="h-96 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg mb-4 relative">
              <div className="absolute top-4 left-4">
                <span className="cyber-badge border-cyber-muted-pink text-cyber-muted-pink">
                  {product.category.toUpperCase()}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-cyber-muted-green/20 border border-cyber-muted-green text-cyber-muted-green text-sm font-orbitron">
                  {product.stock} IN STOCK
                </span>
              </div>
              <div className="absolute bottom-4 right-4 text-5xl font-orbitron font-bold text-cyber-muted-green">
                {product.price}₡
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="cyber-card mb-6">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-blue">FEATURES</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Zap className="h-4 w-4 text-cyber-muted-taupe mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="cyber-card">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-blue">SPECIFICATIONS</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-cyber-gray/30">
                  <span className="text-gray-400 font-mono">{key}:</span>
                  <span className="font-orbitron font-bold text-cyber-muted-green">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details & Purchase */}
        <div>
          {/* Product Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-cyber-muted-taupe fill-cyber-muted-taupe'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-rajdhani">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <span className="px-3 py-1 bg-cyber-dark border border-cyber-muted-purple text-cyber-muted-purple text-sm font-mono rounded">
                SKU: {product.sku}
              </span>
            </div>
            
            <h1 className="text-4xl font-orbitron font-bold mb-4 text-cyber-muted-blue">
              {product.name}
            </h1>
            <p className="text-gray-300 text-lg mb-6">{product.description}</p>
          </div>

          {/* Package Options */}
          <div className="cyber-card mb-6">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-pink">SELECT PACKAGE</h3>
            <div className="space-y-3">
              {options.map((option) => (
                <label 
                  key={option.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-cyber-muted-blue bg-cyber-muted-blue/10'
                      : 'border-cyber-gray hover:border-cyber-muted-purple'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <input
                        type="radio"
                        name="package"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-orbitron font-bold">{option.name}</span>
                      {option.includes && (
                        <div className="ml-6 mt-2">
                          <span className="text-sm text-gray-400">Includes:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {option.includes.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 bg-cyber-dark text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-orbitron font-bold text-cyber-muted-green">
                      {option.price}₡
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="cyber-card mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-lg font-orbitron font-bold mb-2 text-cyber-muted-blue">
                  QUANTITY
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center cyber-input border-x-0 rounded-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-orbitron font-bold text-cyber-muted-green mb-2">
                  TOTAL: {(product.price * quantity).toLocaleString()}₡
                </div>
                <button className="cyber-button text-lg py-3 px-8">
                  <ShoppingCart className="inline mr-2 h-5 w-5" />
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-cyber-dark border border-cyber-muted-green/30 rounded-lg text-center">
              <Package className="h-8 w-8 text-cyber-muted-green mx-auto mb-2" />
              <div className="font-orbitron font-bold mb-1">FREE SHIPPING</div>
              <div className="text-sm text-gray-400">On orders over 1000₡</div>
            </div>
            <div className="p-4 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg text-center">
              <Shield className="h-8 w-8 text-cyber-muted-blue mx-auto mb-2" />
              <div className="font-orbitron font-bold mb-1">5-YEAR WARRANTY</div>
              <div className="text-sm text-gray-400">Full coverage</div>
            </div>
            <div className="p-4 bg-cyber-dark border border-cyber-muted-purple/30 rounded-lg text-center">
              <RotateCcw className="h-8 w-8 text-cyber-muted-purple mx-auto mb-2" />
              <div className="font-orbitron font-bold mb-1">30-DAY RETURNS</div>
              <div className="text-sm text-gray-400">No questions asked</div>
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-blue">RELATED PRODUCTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((related) => (
                <Link 
                  key={related.id}
                  to={`/products/${related.id}`}
                  className="p-4 bg-cyber-gray border border-cyber-muted-purple/30 rounded-lg hover:border-cyber-muted-blue transition-colors"
                >
                  <div className="font-orbitron font-bold text-cyber-muted-blue mb-1">
                    {related.name}
                  </div>
                  <div className="text-cyber-muted-green font-mono">{related.price}₡</div>
                  <div className="text-xs text-gray-400 mt-1">{related.category.toUpperCase()}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
