import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Audit Logs API
 * Admin-only endpoints for tracking administrative actions
 */
export const auditLogsApi = createApi({
  reducerPath: "auditLogsApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["AuditLog", "AuditLogStats"],
  endpoints: (builder) => ({
    /**
     * Get all audit logs with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.adminUserId - Filter by admin user ID
     * @param {string} params.action - Filter by action (e.g., "create", "update", "delete")
     * @param {string} params.entityType - Filter by entity type (e.g., "product", "category", "order")
     * @param {string} params.entityId - Filter by entity ID
     * @param {string} params.startDate - Start date filter (ISO format)
     * @param {string} params.endDate - End date filter (ISO format)
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     */
    getAuditLogs: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/audit-logs",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            logs: response.data.logs || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch audit logs");
      },
      providesTags: ["AuditLog"],
    }),

    /**
     * Get audit log by ID
     * @param {number} id - Audit log ID
     */
    getAuditLogById: builder.query({
      query: (id) => `/api/v1/audit-logs/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data.log || response.data;
        }
        throw new Error(response.error || "Failed to fetch audit log");
      },
      providesTags: (result, error, id) => [{ type: "AuditLog", id }],
    }),

    /**
     * Get audit logs for admin user
     * @param {Object} params - Query parameters
     * @param {number} params.adminUserId - Admin user ID (required)
     * @param {string} params.action - Filter by action
     * @param {string} params.entityType - Filter by entity type
     * @param {string} params.startDate - Start date filter
     * @param {string} params.endDate - End date filter
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     */
    getAuditLogsByAdminUser: builder.query({
      query: ({ adminUserId, ...params }) => ({
        url: `/api/v1/audit-logs/admin/${adminUserId}`,
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            logs: response.data.logs || response.data || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(
          response.error || "Failed to fetch audit logs for admin user"
        );
      },
      providesTags: (result, error, { adminUserId }) => [
        { type: "AuditLog", id: `admin-${adminUserId}` },
      ],
    }),

    /**
     * Get audit logs for entity
     * @param {Object} params - Query parameters
     * @param {string} params.entityType - Entity type (e.g., "product", "category", "order")
     * @param {string} params.entityId - Entity ID
     * @param {string} params.action - Filter by action
     * @param {string} params.startDate - Start date filter
     * @param {string} params.endDate - End date filter
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     */
    getAuditLogsByEntity: builder.query({
      query: ({ entityType, entityId, ...params }) => ({
        url: `/api/v1/audit-logs/entity/${entityType}/${entityId}`,
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            logs: response.data.logs || response.data || [],
            meta: response.data.meta || {},
          };
        }
        throw new Error(
          response.error || "Failed to fetch audit logs for entity"
        );
      },
      providesTags: (result, error, { entityType, entityId }) => [
        { type: "AuditLog", id: `${entityType}-${entityId}` },
      ],
    }),

    /**
     * Get audit log statistics
     * @param {Object} params - Query parameters
     * @param {string} params.startDate - Start date for statistics (ISO format)
     * @param {string} params.endDate - End date for statistics (ISO format)
     */
    getAuditLogStats: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/audit-logs/stats/summary",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data.stats || response.data;
        }
        throw new Error(
          response.error || "Failed to fetch audit log statistics"
        );
      },
      providesTags: ["AuditLogStats"],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogByIdQuery,
  useGetAuditLogsByAdminUserQuery,
  useGetAuditLogsByEntityQuery,
  useGetAuditLogStatsQuery,
} = auditLogsApi;
