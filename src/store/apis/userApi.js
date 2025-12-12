import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * User Management API
 * Admin-only endpoints for managing users
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    /**
     * Get all users with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search by name, email, or phone
     * @param {boolean} params.isEmailVerified - Filter by email verification status
     * @param {boolean} params.isPhoneVerified - Filter by phone verification status
     * @param {boolean} params.isActive - Filter by active status
     * @param {string} params.gender - Filter by gender (male/female)
     * @param {number} params.ageMin - Minimum age
     * @param {number} params.ageMax - Maximum age
     * @param {string} params.sortBy - Sort field (default: "createdAt")
     * @param {string} params.sortOrder - Sort order (asc/desc, default: "desc")
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     */
    getUsers: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/user",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            users: response.data.users || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch users");
      },
      providesTags: ["User"],
    }),

    /**
     * Create a new user (Admin only)
     * @param {Object} userData - User data
     * @param {string} userData.fullName - User's full name
     * @param {string} userData.phone - Phone number (Bangladeshi format)
     * @param {string} userData.email - Email address (optional)
     * @param {string} userData.gender - Gender (male/female, optional)
     * @param {string} userData.dateOfBirth - Date of birth (optional)
     */
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/user",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create user");
      },
      invalidatesTags: ["User"],
    }),

    /**
     * Update a user (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - User ID
     * @param {Object} params.data - User data to update
     */
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/user/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update user");
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi;

