import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Payments API
 * Admin-only endpoints for managing payments
 */
export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    /**
     * Get all payments with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     * @param {string} params.method - Filter by payment method (cod, bkash, nagad, rocket, card)
     * @param {string} params.status - Filter by payment status (pending, paid, failed, cancelled, refunded)
     * @param {number} params.orderId - Filter by order ID
     * @param {string} params.startDate - Start date filter
     * @param {string} params.endDate - End date filter
     */
    getPayments: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/payments",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            payments: response.data.payments || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch payments");
      },
      providesTags: ["Payment"],
    }),

    /**
     * Get payment by ID
     * @param {number} id - Payment ID
     */
    getPaymentById: builder.query({
      query: (id) => `/api/v1/admin/payments/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch payment");
      },
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    /**
     * Get payment by order ID
     * @param {number} orderId - Order ID
     */
    getPaymentByOrderId: builder.query({
      query: (orderId) => `/api/v1/admin/payments/order/${orderId}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch payment");
      },
      providesTags: (result, error, orderId) => [
        { type: "Payment", id: `order-${orderId}` },
      ],
    }),

    /**
     * Verify COD payment
     * @param {Object} params - Verification parameters
     * @param {number} params.id - Payment ID
     * @param {string} params.collectedBy - Who collected the payment (e.g., "SteadFast")
     * @param {string} params.collectedAt - Collection date (ISO string)
     * @param {string} params.notes - Optional notes
     */
    verifyCODPayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/payments/${id}/verify`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to verify payment");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        "Payment",
      ],
    }),

    /**
     * Mark payment as collected from courier (bulk collection)
     * @param {Object} params - Collection parameters
     * @param {number} params.id - Payment ID
     * @param {string} params.courierName - Courier name (e.g., "SteadFast")
     * @param {string} params.courierTrackingNumber - Tracking number
     * @param {string} params.collectedAt - Collection date (ISO string)
     * @param {string} params.notes - Optional notes
     */
    collectFromCourier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/payments/${id}/collect-from-courier`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to collect payment");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        "Payment",
      ],
    }),

    /**
     * Update payment status
     * @param {Object} params - Update parameters
     * @param {number} params.id - Payment ID
     * @param {string} params.status - New status (paid, failed, cancelled, refunded)
     * @param {string} params.notes - Optional notes
     * @param {string} params.transactionId - Optional transaction ID
     * @param {string} params.senderNumber - Optional sender number
     */
    updatePaymentStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/payments/${id}/status`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update payment status");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        "Payment",
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentByOrderIdQuery,
  useVerifyCODPaymentMutation,
  useCollectFromCourierMutation,
  useUpdatePaymentStatusMutation,
} = paymentsApi;
