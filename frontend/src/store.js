import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';

/**
 * Configures and creates the Redux store with necessary reducers and middleware.
 * Integrates the API slice, cart slice, and auth slice.
 */
const store = configureStore({
  reducer: {
    /**
     * Registers the API slice reducer under its respective path.
     */
    [apiSlice.reducerPath]: apiSlice.reducer,

    /**
     * Registers the cart slice reducer.
     */
    cart: cartSliceReducer,

    /**
     * Registers the auth slice reducer.
     */
    auth: authSliceReducer,
  },
  /**
   * Applies default middleware along with the API slice middleware.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  /**
   * Enables Redux DevTools for development.
   */
  devTools: true,
});

export default store;
