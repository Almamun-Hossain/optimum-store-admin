import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Admin Users API
 * Admin-only endpoints for managing admin users
 */
export const adminUsersApi = createApi({
  reducerPath: "adminUsersApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["AdminUser"],
  endpoints: (builder) => ({
    /**
     * Get all admin users with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search by name, email, or phone
     * @param {boolean} params.isActive - Filter by active status
     * @param {string} params.sortBy - Sort field (default: "createdAt")
     * @param {string} params.sortOrder - Sort order (asc/desc, default: "desc")
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     */
    getAdminUsers: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            adminUsers: response.data.users || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch admin users");
      },
      providesTags: ["AdminUser"],
    }),

    /**
     * Create admin user (Admin only)
     * @param {Object} data - Admin user data
     * @param {string} data.fullName - Admin user's full name
     * @param {string} data.phone - Phone number (Bangladeshi format)
     * @param {string} data.email - Email address
     */
    createAdminUser: builder.mutation({
      query: (data) => ({
        url: "/api/v1/admin",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create admin user");
      },
      invalidatesTags: ["AdminUser"],
    }),

    /**
     * Get admin user by ID
     * @param {number} id - Admin user ID
     */
    getAdminUserById: builder.query({
      query: (id) => `/api/v1/admin/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch admin user");
      },
      providesTags: (result, error, id) => [{ type: "AdminUser", id }],
    }),

    /**
     * Update admin user (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - Admin user ID
     * @param {Object} params.data - Admin user data to update
     * @param {string} params.data.fullName - Full name (optional)
     * @param {string} params.data.phone - Phone number (optional)
     * @param {string} params.data.email - Email address (optional)
     * @param {boolean} params.data.isActive - Active status (optional)
     */
    updateAdminUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update admin user");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminUser", id },
        "AdminUser",
      ],
    }),

    /**
     * Delete admin user (Admin only)
     * @param {number} id - Admin user ID
     */
    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete admin user");
      },
      invalidatesTags: ["AdminUser"],
    }),

    /**
     * Assign role to admin user
     * @param {Object} params - Assignment parameters
     * @param {number} params.id - Admin user ID
     * @param {number} params.roleId - Role ID to assign
     */
    assignRoleToAdminUser: builder.mutation({
      query: ({ id, roleId }) => ({
        url: `/api/v1/admin/users/${id}/role`,
        method: "PUT",
        body: { roleId },
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to assign role");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminUser", id },
        "AdminUser",
      ],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useAssignRoleToAdminUserMutation,
} = adminUsersApi;

