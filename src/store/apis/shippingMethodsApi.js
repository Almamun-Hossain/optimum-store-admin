import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Shipping Methods API
 * Endpoints for managing shipping methods
 */
export const shippingMethodsApi = createApi({
  reducerPath: "shippingMethodsApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["ShippingMethod"],
  endpoints: (builder) => ({
    /**
     * Get all shipping methods
     * @param {Object} params - Query parameters
     * @param {boolean} params.isActive - Filter by active status
     * @param {string} params.city - Filter by available cities
     */
    getShippingMethods: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/shipping-methods",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            shippingMethods: response.data.shippingMethods || [],
            total: response.data.total || 0,
          };
        }
        throw new Error(response.error || "Failed to fetch shipping methods");
      },
      providesTags: ["ShippingMethod"],
    }),

    /**
     * Get shipping method by ID
     * @param {number} id - Shipping method ID
     */
    getShippingMethodById: builder.query({
      query: (id) => `/api/v1/shipping-methods/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch shipping method");
      },
      providesTags: (result, error, id) => [{ type: "ShippingMethod", id }],
    }),

    /**
     * Calculate shipping cost
     * @param {Object} data - Calculation data
     * @param {number} data.shippingMethodId - Shipping method ID
     * @param {number} data.totalWeight - Total weight in kg
     */
    calculateShippingCost: builder.mutation({
      query: (data) => ({
        url: "/api/v1/shipping-methods/calculate-cost",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to calculate shipping cost");
      },
    }),

    /**
     * Create shipping method (Admin only)
     * @param {Object} data - Shipping method data
     * @param {string} data.name - Shipping method name
     * @param {string} data.description - Description
     * @param {number} data.baseCost - Base cost
     * @param {number} data.costPerKg - Cost per kg
     * @param {string} data.estimatedDays - Estimated delivery days (e.g., "3-5")
     * @param {boolean} data.isActive - Active status
     * @param {string} data.availableInCities - JSON string array of cities
     * @param {number} data.sortOrder - Sort order
     */
    createShippingMethod: builder.mutation({
      query: (data) => ({
        url: "/api/v1/shipping-methods",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create shipping method");
      },
      invalidatesTags: ["ShippingMethod"],
    }),

    /**
     * Update shipping method (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - Shipping method ID
     * @param {Object} params.data - Shipping method data to update
     */
    updateShippingMethod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/shipping-methods/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update shipping method");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "ShippingMethod", id },
        "ShippingMethod",
      ],
    }),

    /**
     * Delete shipping method (Admin only)
     * @param {number} id - Shipping method ID
     */
    deleteShippingMethod: builder.mutation({
      query: (id) => ({
        url: `/api/v1/shipping-methods/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete shipping method");
      },
      invalidatesTags: ["ShippingMethod"],
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetShippingMethodByIdQuery,
  useCalculateShippingCostMutation,
  useCreateShippingMethodMutation,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
} = shippingMethodsApi;

