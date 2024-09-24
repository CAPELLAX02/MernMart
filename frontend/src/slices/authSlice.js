import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials in the state and localStorage.
     *
     * @param {object} state - Current state.
     * @param {object} action - The action containing user credentials.
     */
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },

    /**
     * Logs out the user by clearing the state and localStorage.
     *
     * @param {object} state - Current state.
     * @param {object} action - The action for logout (optional).
     */
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
