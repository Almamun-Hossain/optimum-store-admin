import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Categories API
 * Endpoints for managing categories
 */
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    /**
     * Get all categories with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search in name or description
     * @param {boolean} params.isActive - Filter by active status
     * @param {number|string} params.parent - Filter by parent category ID (use "null" for root categories)
     * @param {string} params.sortBy - Sort field (default: "sortOrder")
     * @param {string} params.sortOrder - Sort order (asc/desc, default: "asc")
     * @param {number} params.page - Page number (optional)
     * @param {number} params.limit - Items per page (optional)
     */
    getCategories: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/category",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          // Return categories array for backward compatibility
          // Total is available in response.data.total if needed
          return response.data.categories || [];
        }
        throw new Error(response.error || "Failed to fetch categories");
      },
      providesTags: ["Category"],
    }),

    /**
     * Get category by ID
     * @param {number} id - Category ID
     */
    getCategoryById: builder.query({
      query: (id) => `/api/v1/category/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch category");
      },
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    /**
     * Create category (Admin only)
     * @param {Object} data - Category data
     * @param {string} data.name - Category name
     * @param {number|null} data.parentId - Parent category ID (null for root)
     * @param {string} data.description - Category description
     * @param {boolean} data.isActive - Active status
     * @param {number} data.sortOrder - Sort order
     */
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/category",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create category");
      },
      invalidatesTags: ["Category"],
    }),

    /**
     * Update category (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - Category ID
     * @param {Object} params.data - Category data to update
     */
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/category/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update category");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    /**
     * Move category (Admin only)
     * @param {Object} params - Move parameters
     * @param {number} params.draggedId - Category ID to move
     * @param {number|null} params.targetId - New parent category ID (null for root)
     */
    moveCategory: builder.mutation({
      query: ({ draggedId, targetId }) => ({
        url: `/api/v1/category/${draggedId}/move`,
        method: "PATCH",
        body: { newParentId: targetId },
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to move category");
      },
      invalidatesTags: (result, error, { draggedId, targetId }) => [
        { type: "Category", id: draggedId },
        { type: "Category", id: targetId },
        "Category",
      ],
    }),

    /**
     * Delete category (Admin only)
     * @param {number} id - Category ID
     */
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/v1/category/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete category");
      },
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useMoveCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
