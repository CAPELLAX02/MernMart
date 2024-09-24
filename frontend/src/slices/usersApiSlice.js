import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

/**
 * API slice for handling user-related endpoints.
 * Includes endpoints for authentication, profile management, and user operations.
 */
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Logs in a user with provided credentials.
     *
     * @param {object} data - The login credentials (email, password).
     * @returns {object} - API request configuration for logging in.
     */
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Registers a new user with provided data.
     *
     * @param {object} data - The registration data (name, email, password).
     * @returns {object} - API request configuration for registering.
     */
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Verifies the user's email with the provided verification token.
     *
     * @param {object} data - The email verification data (token).
     * @returns {object} - API request configuration for verifying a user's email.
     */
    verifyUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-email`,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Logs out the current user.
     *
     * @returns {object} - API request configuration for logging out.
     */
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    /**
     * Updates the profile of the current user.
     *
     * @param {object} data - The new profile data to update.
     * @returns {object} - API request configuration for updating user profile.
     */
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),

    /**
     * Retrieves a list of all users.
     *
     * @returns {object} - API request configuration for fetching users.
     */
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    /**
     * Deletes a specific user by ID.
     *
     * @param {string} userId - The ID of the user to delete.
     * @returns {object} - API request configuration for deleting a user.
     */
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),

    /**
     * Retrieves details of a specific user by ID.
     *
     * @param {string} id - The ID of the user to retrieve.
     * @returns {object} - API request configuration for retrieving user details.
     */
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    /**
     * Updates a specific user's information by ID.
     *
     * @param {object} data - The updated user data including userId.
     * @returns {object} - API request configuration for updating a user.
     */
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Sends a forgot password email to the user.
     *
     * @param {object} data - The email data (email address).
     * @returns {object} - API request configuration for sending a forgot password email.
     */
    sendForgotPasswordEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Resets the user's password with the provided reset token and new password.
     *
     * @param {object} data - The reset password data (token, new password).
     * @returns {object} - API request configuration for resetting password.
     */
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyUserMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useSendForgotPasswordEmailMutation,
  useResetPasswordMutation,
} = usersApiSlice;
