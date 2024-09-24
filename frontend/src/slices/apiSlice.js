import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice';

/**
 * Base query for API requests.
 * Handles 401 errors by dispatching the logout action.
 *
 * @param {object} args - The query arguments.
 * @param {object} api - The Redux API.
 * @param {object} extra - Additional options for the query.
 * @returns {Promise<object>} - The result of the query.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

/**
 * Custom base query with authentication handling.
 * Dispatches a logout if the server returns a 401 Unauthorized status.
 *
 * @param {object} args - The query arguments.
 * @param {object} api - The Redux API.
 * @param {object} extra - Additional options for the query.
 * @returns {Promise<object>} - The result of the query with authentication handling.
 */
async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

/**
 * Creates a Redux API slice with customized base query.
 * Defines API endpoints and tag types for caching and invalidation.
 */
export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
