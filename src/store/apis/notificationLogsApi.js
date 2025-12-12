import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Notification Logs API
 * Admin-only endpoints for managing notification logs
 */
export const notificationLogsApi = createApi({
  reducerPath: "notificationLogsApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["NotificationLog", "NotificationStats"],
  endpoints: (builder) => ({
    /**
     * Get all notification logs with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.userId - Filter by user ID
     * @param {string} params.type - Filter by type (email/sms)
     * @param {string} params.template - Filter by template name
     * @param {string} params.status - Filter by status (sent/failed/pending)
     * @param {string} params.startDate - Start date filter
     * @param {string} params.endDate - End date filter
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     */
    getNotificationLogs: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/notification-logs",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            logs: response.data.logs || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch notification logs");
      },
      providesTags: ["NotificationLog"],
    }),

    /**
     * Get notification log by ID
     * @param {number} id - Notification log ID
     */
    getNotificationLogById: builder.query({
      query: (id) => `/api/v1/notification-logs/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch notification log");
      },
      providesTags: (result, error, id) => [{ type: "NotificationLog", id }],
    }),

    /**
     * Create notification log (Admin only)
     * @param {Object} data - Notification log data
     * @param {number} data.userId - User ID (optional)
     * @param {string} data.type - Type ("email" or "sms")
     * @param {string} data.template - Template name
     * @param {string} data.recipient - Recipient (email or phone)
     * @param {string} data.subject - Subject (optional)
     * @param {string} data.status - Status ("sent", "failed", "pending")
     * @param {string} data.errorMessage - Error message (optional)
     * @param {string} data.metadata - JSON string metadata (optional)
     * @param {string} data.sentAt - Sent at timestamp (optional)
     */
    createNotificationLog: builder.mutation({
      query: (data) => ({
        url: "/api/v1/notification-logs",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create notification log");
      },
      invalidatesTags: ["NotificationLog", "NotificationStats"],
    }),

    /**
     * Update notification log (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - Notification log ID
     * @param {Object} params.data - Notification log data to update
     */
    updateNotificationLog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/notification-logs/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update notification log");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "NotificationLog", id },
        "NotificationLog",
        "NotificationStats",
      ],
    }),

    /**
     * Delete notification log (Admin only)
     * @param {number} id - Notification log ID
     */
    deleteNotificationLog: builder.mutation({
      query: (id) => ({
        url: `/api/v1/notification-logs/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete notification log");
      },
      invalidatesTags: ["NotificationLog", "NotificationStats"],
    }),

    /**
     * Get notification statistics (Admin only)
     * @param {Object} params - Query parameters
     * @param {string} params.startDate - Start date for statistics
     * @param {string} params.endDate - End date for statistics
     */
    getNotificationStats: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/notification-logs/stats/summary",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data.stats || response.data;
        }
        throw new Error(
          response.error || "Failed to fetch notification statistics"
        );
      },
      providesTags: ["NotificationStats"],
    }),

    /**
     * Get user notification logs (Admin only)
     * @param {number} userId - User ID
     */
    getUserNotificationLogs: builder.query({
      query: (userId) => `/api/v1/notification-logs/user/${userId}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(
          response.error || "Failed to fetch user notification logs"
        );
      },
      providesTags: (result, error, userId) => [
        { type: "NotificationLog", id: `user-${userId}` },
      ],
    }),
  }),
});

export const {
  useGetNotificationLogsQuery,
  useGetNotificationLogByIdQuery,
  useCreateNotificationLogMutation,
  useUpdateNotificationLogMutation,
  useDeleteNotificationLogMutation,
  useGetNotificationStatsQuery,
  useGetUserNotificationLogsQuery,
} = notificationLogsApi;

