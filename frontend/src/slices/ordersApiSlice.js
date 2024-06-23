import { apiSlice } from './apiSlice';
import { ORDERS_URL, IYZICO_URL } from '../constants';

// NOTE: A query operation can be performed with any data fetching library of your choice, but the general recommendation is that you only use queries for requests that retrieve data. For anything that alters data on the server or will possibly invalidate the cache, it should be used Mutation.

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE ORDER ENDPOINT
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),

    // GET ORDER DETAILS ENDPOINT
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // PAY ORDER ENDPOINT
    payOrder: builder.mutation({
      query: (orderId, details) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: { ...details },
      }),
    }),

    // GET IYZICO CLIENT ID (API KEY) ENDPOINT
    getIyzicoClientId: builder.query({
      query: () => ({
        url: IYZICO_URL,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetIyzicoClientIdQuery,
  usePayOrderMutation,
} = ordersApiSlice;
