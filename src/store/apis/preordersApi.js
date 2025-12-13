import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Preorders API
 * Admin-only endpoints for managing preorders
 */
export const preordersApi = createApi({
  reducerPath: "preordersApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Preorder"],
  endpoints: (builder) => ({
    /**
     * Get all preorders (Admin)
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     * @param {boolean} params.isActive - Filter by active status
     * @param {number} params.variantId - Filter by variant ID
     */
    getPreorders: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/preorders",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            preorders: response.data.preorders || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch preorders");
      },
      providesTags: ["Preorder"],
    }),

    /**
     * Get preorder by ID
     * @param {number} id - Preorder ID
     */
    getPreorderById: builder.query({
      query: (id) => `/api/v1/admin/preorders/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch preorder");
      },
      providesTags: (result, error, id) => [{ type: "Preorder", id }],
    }),

    /**
     * Create preorder
     * @param {Object} data - Preorder data
     * @param {number} data.variantId - Variant ID
     * @param {string} data.expectedArrivalDate - Expected arrival date (ISO string)
     * @param {number} data.maximumQuantity - Maximum quantity available for preorder
     * @param {number} data.preorderPrice - Preorder price
     * @param {boolean} data.isActive - Active status
     */
    createPreorder: builder.mutation({
      query: (data) => ({
        url: "/api/v1/admin/preorders",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create preorder");
      },
      invalidatesTags: ["Preorder"],
    }),

    /**
     * Update preorder
     * @param {Object} params - Update parameters
     * @param {number} params.id - Preorder ID
     * @param {Object} params.data - Preorder data to update
     */
    updatePreorder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/preorders/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update preorder");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Preorder", id },
        "Preorder",
      ],
    }),

    /**
     * Delete preorder
     * @param {number} id - Preorder ID
     */
    deletePreorder: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/preorders/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete preorder");
      },
      invalidatesTags: ["Preorder"],
    }),
  }),
});

export const {
  useGetPreordersQuery,
  useGetPreorderByIdQuery,
  useCreatePreorderMutation,
  useUpdatePreorderMutation,
  useDeletePreorderMutation,
} = preordersApi;
