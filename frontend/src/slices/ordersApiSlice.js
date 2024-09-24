import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

/**
 * API slice for handling order-related endpoints.
 * Includes endpoints for creating, fetching, and updating orders.
 */
export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Creates a new order.
     *
     * @param {object} order - The order details to be sent to the server.
     * @returns {object} - API request configuration for creating an order.
     */
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),

    /**
     * Fetches the details of a specific order by its ID.
     *
     * @param {string} orderId - The ID of the order to retrieve.
     * @returns {object} - API request configuration for retrieving order details.
     */
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    /**
     * Marks an order as paid.
     *
     * @param {object} params - Object containing orderId and paymentResult.
     * @param {string} params.orderId - The ID of the order to mark as paid.
     * @param {object} params.paymentResult - The payment result details.
     * @returns {object} - API request configuration for paying an order.
     */
    payOrder: builder.mutation({
      query: ({ orderId, paymentResult }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
    }),

    /**
     * Retrieves the list of orders made by the current user.
     *
     * @returns {object} - API request configuration for retrieving user's orders.
     */
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    /**
     * Retrieves the list of all orders.
     *
     * @returns {object} - API request configuration for retrieving all orders.
     */
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    /**
     * Marks an order as delivered.
     *
     * @param {string} orderId - The ID of the order to mark as delivered.
     * @returns {object} - API request configuration for delivering an order.
     */
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
