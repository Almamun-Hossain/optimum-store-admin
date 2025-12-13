import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Roles API
 * Admin-only endpoints for managing roles and permissions
 */
export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Role", "Permission"],
  endpoints: (builder) => ({
    /**
     * Get all roles with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {boolean} params.isActive - Filter by active status
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     */
    getRoles: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/roles",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            roles: response.data.roles || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch roles");
      },
      providesTags: ["Role"],
    }),

    /**
     * Get role by ID
     * @param {number} id - Role ID
     */
    getRoleById: builder.query({
      query: (id) => `/api/v1/admin/roles/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch role");
      },
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    /**
     * Create role
     * @param {Object} data - Role data
     * @param {string} data.name - Role name
     * @param {string} data.description - Role description
     * @param {boolean} data.isActive - Active status
     */
    createRole: builder.mutation({
      query: (data) => ({
        url: "/api/v1/admin/roles",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create role");
      },
      invalidatesTags: ["Role"],
    }),

    /**
     * Update role
     * @param {Object} params - Update parameters
     * @param {number} params.id - Role ID
     * @param {Object} params.data - Role data to update
     */
    updateRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update role");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        "Role",
      ],
    }),

    /**
     * Delete role
     * @param {number} id - Role ID
     */
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/roles/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete role");
      },
      invalidatesTags: ["Role"],
    }),

    /**
     * Assign permissions to role
     * @param {Object} params - Assignment parameters
     * @param {number} params.id - Role ID
     * @param {Array<number>} params.permissionIds - Array of permission IDs
     */
    assignPermissionsToRole: builder.mutation({
      query: ({ id, permissionIds }) => ({
        url: `/api/v1/admin/roles/${id}/permissions`,
        method: "POST",
        body: { permissionIds },
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to assign permissions");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        "Role",
        "Permission",
      ],
    }),

    /**
     * Get all permissions with filtering
     * @param {Object} params - Query parameters
     * @param {string} params.module - Filter by module
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 50)
     */
    getPermissions: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/permissions",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            permissions: response.data.permissions || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch permissions");
      },
      providesTags: ["Permission"],
    }),

    /**
     * Get permission by ID
     * @param {number} id - Permission ID
     */
    getPermissionById: builder.query({
      query: (id) => `/api/v1/admin/permissions/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch permission");
      },
      providesTags: (result, error, id) => [{ type: "Permission", id }],
    }),

    /**
     * Create permission
     * @param {Object} data - Permission data
     * @param {string} data.name - Permission name (e.g., "product:create")
     * @param {string} data.description - Permission description
     * @param {string} data.module - Module name (e.g., "product")
     * @param {string} data.action - Action name (e.g., "create")
     */
    createPermission: builder.mutation({
      query: (data) => ({
        url: "/api/v1/admin/permissions",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create permission");
      },
      invalidatesTags: ["Permission"],
    }),

    /**
     * Update permission
     * @param {Object} params - Update parameters
     * @param {number} params.id - Permission ID
     * @param {Object} params.data - Permission data to update
     */
    updatePermission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/permissions/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update permission");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Permission", id },
        "Permission",
      ],
    }),

    /**
     * Delete permission
     * @param {number} id - Permission ID
     */
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/permissions/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete permission");
      },
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsToRoleMutation,
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = rolesApi;
