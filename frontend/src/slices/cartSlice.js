import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Adds an item to the cart. If the item already exists, it updates the existing item.
     * Updates the local storage with the current cart state.
     *
     * @param {object} state - The current cart state.
     * @param {object} action - The action containing the new item to add.
     */
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
        // didn't use push, because states are immutable.
      }

      return updateCart(state);
    },

    /**
     * Removes an item from the cart based on its ID.
     * Updates the local storage with the current cart state.
     *
     * @param {object} state - The current cart state.
     * @param {object} action - The action containing the item ID to remove.
     */
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    /**
     * Saves the shipping address in the cart state.
     * Updates the local storage with the current cart state.
     *
     * @param {object} state - The current cart state.
     * @param {object} action - The action containing the shipping address.
     */
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    /**
     * Saves the selected payment method in the cart state.
     * Updates the local storage with the current cart state.
     *
     * @param {object} state - The current cart state.
     * @param {object} action - The action containing the payment method.
     */
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    /**
     * Clears all items from the cart.
     * Updates the local storage with the current cart state.
     *
     * @param {object} state - The current cart state.
     * @param {object} action - The action to clear cart items (optional).
     */
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },

    /**
     * Resets the cart state to its initial value.
     * Ensures the next user doesn't inherit the previous user's cart and shipping details.
     *
     * @param {object} state - The current cart state.
     * @returns {object} - The reset state.
     */
    resetCard: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCard,
} = cartSlice.actions;

export default cartSlice.reducer;
