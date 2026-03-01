import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
  description: string;
  specs?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

interface User {
  name: string;
  email: string;
}

interface StoreContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  cartTotal: number;
  cartCount: number;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  promoCode: string;
  setPromoCode: (c: string) => void;
  discount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleSetPromoCode = useCallback((code: string) => {
    setPromoCode(code);
    if (code.toUpperCase() === 'KSTORE10') setDiscount(10);
    else if (code.toUpperCase() === 'SALE20') setDiscount(20);
    else setDiscount(0);
  }, []);

  return (
    <StoreContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity,
      cartTotal, cartCount,
      isLoggedIn, setIsLoggedIn,
      user, setUser,
      wishlist, toggleWishlist,
      promoCode, setPromoCode: handleSetPromoCode, discount,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
