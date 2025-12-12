import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Admin Orders API
 * Admin-only endpoints for managing orders
 */
export const adminOrdersApi = createApi({
  reducerPath: "adminOrdersApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Order", "OrderStats"],
  endpoints: (builder) => ({
    /**
     * Get all orders with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     * @param {string} params.status - Filter by order status
     * @param {string} params.paymentStatus - Filter by payment status (pending, paid, failed, cancelled)
     * @param {string} params.paymentMethod - Filter by payment method
     * @param {number} params.userId - Filter by user ID
     * @param {string} params.startDate - Start date filter
     * @param {string} params.endDate - End date filter
     * @param {string} params.search - Search by order ID or user email
     */
    getOrders: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/orders",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            orders: response.data.orders || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch orders");
      },
      providesTags: ["Order"],
    }),

    /**
     * Get order by ID
     * @param {number} id - Order ID
     */
    getOrderById: builder.query({
      query: (id) => `/api/v1/admin/orders/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data.order || response.data;
        }
        throw new Error(response.error || "Failed to fetch order");
      },
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    /**
     * Update order
     * @param {Object} params - Update parameters
     * @param {number} params.id - Order ID
     * @param {Object} params.data - Order data to update
     * @param {string} params.data.deliveryDate - Delivery date (optional)
     * @param {string} params.data.deliveryNotes - Delivery notes (optional)
     * @param {number} params.data.codAmount - COD amount (optional)
     * @param {boolean} params.data.codCollected - COD collected status (optional)
     */
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/orders/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update order");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "Order",
      ],
    }),

    /**
     * Update order status
     * @param {Object} params - Update parameters
     * @param {number} params.id - Order ID
     * @param {Object} params.data - Status update data
     * @param {number} params.data.statusId - New status ID
     * @param {string} params.data.notes - Status change notes (optional)
     */
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/orders/${id}/status`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update order status");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "Order",
        "OrderStats",
      ],
    }),

    /**
     * Get order status history
     * @param {number} id - Order ID
     */
    getOrderHistory: builder.query({
      query: (id) => `/api/v1/admin/orders/${id}/history`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data.history || [];
        }
        throw new Error(response.error || "Failed to fetch order history");
      },
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    /**
     * Get order statistics
     * @param {Object} params - Query parameters
     * @param {string} params.startDate - Start date for statistics
     * @param {string} params.endDate - End date for statistics
     */
    getOrderStats: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/orders/stats",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch order statistics");
      },
      providesTags: ["OrderStats"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrderHistoryQuery,
  useGetOrderStatsQuery,
} = adminOrdersApi;

