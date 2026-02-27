// frontend/src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      // Add item to cart
      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.id === product.id);
          
          if (existingItem) {
            // Update quantity if item already in cart
            return {
              cart: state.cart.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            // Add new item to cart
            return {
              cart: [...state.cart, { ...product, quantity: 1 }]
            };
          }
        });
      },
      
      // Remove item from cart
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== productId)
        }));
      },
      
      // Update quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      // Clear entire cart
      clearCart: () => {
        set({ cart: [] });
      },
      
      // Get total items in cart
      getTotalItems: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      // Get total price
      getTotalPrice: () => {
        return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage' // LocalStorage key
    }
  )
);

export default useCartStore;
