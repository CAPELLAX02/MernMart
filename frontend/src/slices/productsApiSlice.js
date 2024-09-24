import { apiSlice } from './apiSlice';
import { PRODUCTS_URL, UPLOAD_URL } from '../constants';

/**
 * API slice for handling product-related endpoints.
 * Includes endpoints for fetching, creating, updating, and deleting products,
 * as well as uploading product images and creating reviews.
 */
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetches a list of products, optionally filtered by keyword and paginated.
     *
     * @param {object} params - Query parameters including keyword and pageNumber.
     * @returns {object} - API request configuration for retrieving products.
     */
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),

    /**
     * Fetches details of a specific product by its ID.
     *
     * @param {string} productId - The ID of the product to retrieve.
     * @returns {object} - API request configuration for retrieving product details.
     */
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    /**
     * Creates a new product.
     *
     * @returns {object} - API request configuration for creating a product.
     */
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),

    /**
     * Updates an existing product by its ID.
     *
     * @param {object} data - The product data including productId.
     * @returns {object} - API request configuration for updating the product.
     */
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    /**
     * Uploads a product image.
     *
     * @param {object} data - The image data to be uploaded.
     * @returns {object} - API request configuration for uploading the image.
     */
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Deletes a specific product by its ID.
     *
     * @param {string} productId - The ID of the product to delete.
     * @returns {object} - API request configuration for deleting the product.
     */
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),

    /**
     * Creates a new review for a specific product.
     *
     * @param {object} data - Review data including the productId.
     * @returns {object} - API request configuration for creating a review.
     */
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    /**
     * Fetches the top-rated products.
     *
     * @returns {object} - API request configuration for retrieving top products.
     */
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
