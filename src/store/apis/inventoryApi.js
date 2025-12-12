import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Inventory Management API
 * Admin-only endpoints for managing inventory
 */
export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Inventory", "Product"],
  endpoints: (builder) => ({
    /**
     * Get inventory by variant ID
     * @param {number} variantId - Variant ID
     */
    getInventoryByVariant: builder.query({
      query: (variantId) => `/api/v1/inventory/${variantId}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data.inventory || response.data;
        }
        throw new Error(response.error || "Failed to fetch inventory");
      },
      providesTags: (result, error, variantId) => [
        { type: "Inventory", id: variantId },
      ],
    }),

    /**
     * Get low stock items (Admin only)
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Maximum items to return (default: 50)
     */
    getLowStockItems: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/inventory/low-stock",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            lowStockItems: response.data.lowStockItems || [],
            count: response.data.count || 0,
            alert: response.data.alert || "",
          };
        }
        throw new Error(response.error || "Failed to fetch low stock items");
      },
      providesTags: ["Inventory"],
    }),

    /**
     * Adjust inventory (Admin only)
     * @param {Object} data - Adjustment data
     * @param {number} data.variantId - Variant ID
     * @param {number} data.quantity - Quantity adjustment (positive to add, negative to subtract)
     * @param {string} data.notes - Adjustment notes (optional)
     * @param {string} data.reason - Reason for adjustment (optional: "manual_adjustment", "restock", "damage", "return")
     */
    adjustInventory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/inventory/adjust",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to adjust inventory");
      },
      invalidatesTags: (result, error, { variantId }) => [
        { type: "Inventory", id: variantId },
        "Inventory",
        "Product",
      ],
    }),
  }),
});

export const {
  useGetInventoryByVariantQuery,
  useGetLowStockItemsQuery,
  useAdjustInventoryMutation,
} = inventoryApi;

