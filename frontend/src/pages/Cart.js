import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from './store/cartStore';

const Cart = () => {
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                  <h2 className="text-2xl font-orbitron font-bold">CART ITEMS ({cart.length})</h2>
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
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-cyber-gray mx-auto mb-4" />
                    <h3 className="text-xl font-orbitron text-gray-300 mb-4">YOUR CART IS EMPTY</h3>
                    <Link 
                      to="/products"
                      className="inline-block px-6 py-3 bg-cyber-muted-pink text-cyber-black font-orbitron font-bold hover:bg-cyber-muted-blue transition-colors"
                    >
                      START SHOPPING
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
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
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center cyber-input border-x-0 rounded-none"
                            min="1"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-cyber-muted-blue text-cyber-muted-blue hover:bg-cyber-muted-blue hover:text-cyber-black transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-orbitron font-bold">
                            TOTAL: <span className="text-cyber-muted-green">{(item.price * item.quantity).toLocaleString()}₡</span>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black rounded transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )))}
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

              {/* Payment Method Selection */}
              <div className="border-t border-cyber-gray/50 pt-6 mb-6">
                <h3 className="font-orbitron font-bold mb-4 text-cyber-muted-blue">PAYMENT METHOD</h3>
                <div className="space-y-3">
                  {/* Prepaid */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      borderColor: paymentMethod === 'prepaid' ? '#6db3c8' : '#4a4a5e',
                      backgroundColor: paymentMethod === 'prepaid' ? 'rgba(109, 179, 200, 0.1)' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="prepaid"
                      checked={paymentMethod === 'prepaid'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-orbitron font-bold text-cyber-muted-blue">PREPAID PAYMENT</div>
                      <div className="text-sm text-gray-400">Pay Now - Credit Card, Wallet, Bank Transfer, Crypto</div>
                    </div>
                  </label>
                  
                  {/* Cash on Delivery */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      borderColor: paymentMethod === 'cod' ? '#c9988b' : '#4a4a5e',
                      backgroundColor: paymentMethod === 'cod' ? 'rgba(201, 152, 139, 0.1)' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-orbitron font-bold text-cyber-muted-pink">CASH ON DELIVERY</div>
                      <div className="text-sm text-gray-400">Pay Upon Receipt - No Advance Payment Required</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full cyber-button py-4 text-lg mb-6">
                <CreditCard className="inline mr-2 h-5 w-5" />
                {paymentMethod === 'prepaid' ? 'PROCEED TO PAYMENT' : 'CONFIRM ORDER'}
              </button>

              {/* Payment Methods */}
              <div className="border-t border-cyber-gray/50 pt-6">
                <h3 className="font-orbitron font-bold mb-4 text-cyber-muted-blue">AVAILABLE PAYMENT GATEWAYS</h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethod === 'prepaid' ? (
                    ['CREDIT CARD', 'CRYPTO', 'E-WALLET', 'BANK'].map((method) => (
                      <div 
                        key={method}
                        className="p-3 border border-cyber-muted-blue/50 text-center text-xs font-mono bg-cyber-dark/50 rounded hover:bg-cyber-muted-blue/10 transition-colors cursor-pointer"
                      >
                        {method}
                      </div>
                    ))
                  ) : (
                    <div 
                      className="col-span-2 p-4 border border-cyber-muted-pink/50 text-center font-mono bg-cyber-dark/50 rounded"
                    >
                      💵 Pay Cash at Delivery
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-cyber-dark/50 border border-cyber-muted-green/30 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-cyber-muted-green rounded-full animate-pulse-neon"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-300">
                    {paymentMethod === 'prepaid' 
                      ? '✓ Secure Payment - All transactions are encrypted and protected.'
                      : '✓ Cash on Delivery - Pay when you receive your order. No payment required now.'}
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
            {[
              { id: 101, name: 'Neural OS v2.1', price: 899, category: 'SOFTWARE' },
              { id: 102, name: 'Quantum Shield Pro', price: 1299, category: 'SECURITY' },
              { id: 103, name: 'Data Jack Module', price: 599, category: 'ACCESSORIES' }
            ].map((product) => {
              const isAdded = addedProducts[product.id];
              
              const handleAddRecommended = () => {
                addToCart(product);
                setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
                setTimeout(() => {
                  setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
                }, 2000);
              };
              
              return (
                <div key={product.id} className="cyber-card">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-cyber-dark border border-cyber-muted-blue/30 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-orbitron font-bold text-lg mb-1 text-cyber-muted-blue">{product.name}</h4>
                      <div className="text-xs font-mono text-gray-400 mb-2">{product.category}</div>
                      <div className="text-cyber-muted-green font-mono font-bold mb-3">{product.price}₡</div>
                      <button 
                        onClick={handleAddRecommended}
                        className={`w-full text-sm font-orbitron font-bold py-2 px-3 transition-colors ${
                          isAdded
                            ? 'bg-cyber-muted-green text-cyber-black'
                            : 'bg-cyber-muted-pink/20 border border-cyber-muted-pink text-cyber-muted-pink hover:bg-cyber-muted-pink hover:text-cyber-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="inline h-4 w-4 mr-1" />
                            ADDED
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="inline h-4 w-4 mr-1" />
                            ADD TO CART
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
