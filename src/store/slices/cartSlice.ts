import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  guestCart: CartItem[];
  isAuthenticated: boolean;
}

const initialState: CartState = {
  items: [],
  guestCart: [],
  isAuthenticated: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const targetCart = state.isAuthenticated ? state.items : state.guestCart;
      const existingItem = targetCart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        targetCart.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const targetCart = state.isAuthenticated ? state.items : state.guestCart;
      const index = targetCart.findIndex(item => item.id === productId);
      
      if (index !== -1) {
        targetCart.splice(index, 1);
      }
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const targetCart = state.isAuthenticated ? state.items : state.guestCart;
      const item = targetCart.find(item => item.id === id);

      if (item) {
        item.quantity = Math.max(0, quantity);
        
        // Remove item if quantity becomes 0
        if (item.quantity === 0) {
          const index = targetCart.findIndex(cartItem => cartItem.id === id);
          if (index !== -1) {
            targetCart.splice(index, 1);
          }
        }
      }
    },

    clearCart: (state) => {
      if (state.isAuthenticated) {
        state.items = [];
      } else {
        state.guestCart = [];
      }
    },

    clearGuestCart: (state) => {
      state.guestCart = [];
    },

    setAuthenticationStatus: (state, action: PayloadAction<boolean>) => {
      const wasAuthenticated = state.isAuthenticated;
      state.isAuthenticated = action.payload;

      // When user logs in, merge guest cart with user cart
      if (!wasAuthenticated && action.payload && state.guestCart.length > 0) {
        // Merge guest cart items into user cart
        state.guestCart.forEach(guestItem => {
          const existingItem = state.items.find(item => item.id === guestItem.id);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            state.items.push({ ...guestItem });
          }
        });
        
        // Clear guest cart after merging
        state.guestCart = [];
      }
      
      // When user logs out, clear user cart but keep guest cart
      if (wasAuthenticated && !action.payload) {
        state.items = [];
      }
    },

    // Restore cart from persistence after login
    restoreUserCart: (state, action: PayloadAction<CartItem[]>) => {
      if (state.isAuthenticated) {
        state.items = action.payload;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearGuestCart,
  setAuthenticationStatus,
  restoreUserCart,
} = cartSlice.actions;

export default cartSlice.reducer;
