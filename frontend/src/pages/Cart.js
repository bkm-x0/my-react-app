import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = [
    {
      id: 1,
      name: 'Neural Interface MK.II',
      price: 2999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=150',
      sku: 'NI-MKII-256-QS',
      category: 'BIOTECH'
    },
    {
      id: 2,
      name: 'Quantum Processor Q9',
      price: 4599,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150',
      sku: 'QP-Q9-512',
      category: 'HARDWARE'
    },
    {
      id: 3,
      name: 'Data Jack Pro',
      price: 499,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=150',
      sku: 'DJ-PRO-100G',
      category: 'ACCESSORIES'
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-orbitron font-bold mb-4">
            <span className="text-cyber-muted-blue">YOUR</span>
            <span className="text-cyber-muted-pink"> CART</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Review your cybernetic upgrades before proceeding to checkout
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="cyber-card mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ShoppingBag className="h-6 w-6 text-cyber-muted-blue mr-3" />
                  <h2 className="text-2xl font-orbitron font-bold">CART ITEMS ({cartItems.length})</h2>
                </div>
                <Link 
                  to="/products"
                  className="flex items-center text-cyber-muted-purple hover:text-cyber-muted-pink transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  CONTINUE SHOPPING
                </Link>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-cyber-dark border border-cyber-gray/50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-cyber-gray rounded-lg mr-4 flex-shrink-0">
                      {/* Image placeholder */}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-orbitron font-bold text-cyber-muted-blue mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="font-mono">SKU: {item.sku}</span>
                            <span className="px-2 py-1 border border-cyber-muted-purple text-cyber-muted-purple rounded">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-orbitron font-bold text-cyber-muted-green">
                          {item.price}₡
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <button className="p-1 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black">
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            className="w-16 text-center cyber-input border-x-0 rounded-none"
                            readOnly
                          />
                          <button className="p-1 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-orbitron font-bold">
                            TOTAL: <span className="text-cyber-muted-green">{(item.price * item.quantity).toLocaleString()}₡</span>
                          </div>
                          <button className="p-2 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black rounded">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="cyber-card">
              <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyber-muted-pink">PROMO CODE</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  className="cyber-input flex-1 rounded-r-none"
                />
                <button className="px-6 bg-cyber-muted-purple text-cyber-black font-orbitron font-bold hover:bg-cyber-muted-blue transition-colors rounded-r-lg">
                  APPLY
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="cyber-card sticky top-24">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-cyber-muted-blue">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-orbitron font-bold">{subtotal.toLocaleString()}₡</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Shipping</span>
                  <span className={`font-orbitron font-bold ${shipping === 0 ? 'text-cyber-muted-green' : ''}`}>
                    {shipping === 0 ? 'FREE' : `${shipping}₡`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tax</span>
                  <span className="font-orbitron font-bold">{tax.toLocaleString()}₡</span>
                </div>
                
                <div className="border-t border-cyber-gray/50 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-orbitron font-bold">TOTAL</span>
                    <span className="text-3xl font-orbitron font-bold text-cyber-muted-green">
                      {total.toLocaleString()}₡
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full cyber-button py-4 text-lg mb-6">
                <CreditCard className="inline mr-2 h-5 w-5" />
                PROCEED TO CHECKOUT
              </button>

              {/* Payment Methods */}
              <div className="border-t border-cyber-gray/50 pt-6">
                <h3 className="font-orbitron font-bold mb-4 text-cyber-muted-blue">ACCEPTED PAYMENT</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['CRYPTO', 'CREDITS', 'NEURAL', 'BIOMETRIC'].map((method) => (
                    <div 
                      key={method}
                      className="p-2 border border-cyber-muted-purple/30 text-center text-xs font-mono"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-cyber-dark/50 border border-cyber-muted-green/30 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-cyber-muted-green rounded-full animate-pulse-neon"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-300">
                    All transactions are secured with quantum encryption. 
                    Your neural data is never stored or shared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Items */}
        <div className="mt-12">
          <h2 className="text-3xl font-orbitron font-bold mb-6 text-center">
            <span className="text-cyber-muted-blue">RECOMMENDED</span>
            <span className="text-cyber-muted-pink"> UPGRADES</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cyber-card">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-cyber-dark rounded-lg mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-orbitron font-bold text-lg mb-1">Neural OS v2.1</h4>
                    <div className="text-cyber-muted-green font-mono mb-2">899₡</div>
                    <button className="text-sm cyber-button py-1 px-3">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
