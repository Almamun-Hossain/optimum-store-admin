import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Dashboard API
 * Admin-only endpoints for dashboard analytics and insights
 */
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Dashboard", "KPIs", "Sales", "Products", "Customers", "Alerts"],
  endpoints: (builder) => ({
    /**
     * Get KPI Stats
     * @param {Object} params - Query parameters
     * @param {string} params.from - Start date (ISO format, e.g., "2025-12-01"). Defaults to today if not provided.
     * @param {string} params.to - End date (ISO format, e.g., "2025-12-12"). Defaults to today if not provided.
     */
    getKPIStats: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/kpis",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch KPI stats");
      },
      providesTags: ["KPIs"],
    }),

    /**
     * Get Sales Trends
     * @param {Object} params - Query parameters
     * @param {string} params.groupBy - Grouping period: "day", "week", or "month" (default: "day")
     * @param {string} params.from - Start date (ISO format). Defaults to 30 days ago if not provided.
     * @param {string} params.to - End date (ISO format). Defaults to today if not provided.
     */
    getSalesTrends: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/sales/trends",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch sales trends");
      },
      providesTags: ["Sales"],
    }),

    /**
     * Get Sales by Category
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of top categories to return (default: 10)
     */
    getSalesByCategory: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/sales/by-category",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(response.error || "Failed to fetch sales by category");
      },
      providesTags: ["Sales"],
    }),

    /**
     * Get Sales by Product
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of top products to return (default: 10)
     */
    getSalesByProduct: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/sales/by-product",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(response.error || "Failed to fetch sales by product");
      },
      providesTags: ["Sales"],
    }),

    /**
     * Get Sales by Payment Method
     */
    getSalesByPaymentMethod: builder.query({
      query: () => ({
        url: "/api/v1/admin/dashboard/sales/by-payment-method",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(
          response.error || "Failed to fetch sales by payment method"
        );
      },
      providesTags: ["Sales"],
    }),

    /**
     * Get Order Status Counts
     */
    getOrderStatusCounts: builder.query({
      query: () => ({
        url: "/api/v1/admin/dashboard/orders/status-count",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(
          response.error || "Failed to fetch order status counts"
        );
      },
      providesTags: ["Dashboard"],
    }),

    /**
     * Get Product Summary
     */
    getProductSummary: builder.query({
      query: () => ({
        url: "/api/v1/admin/dashboard/products/summary",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch product summary");
      },
      providesTags: ["Products"],
    }),

    /**
     * Get Best Selling Products
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of products to return (default: 10)
     */
    getBestSellingProducts: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/products/best-sellers",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(
          response.error || "Failed to fetch best selling products"
        );
      },
      providesTags: ["Products"],
    }),

    /**
     * Get Low Stock Products
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of products to return (default: 20)
     */
    getLowStockProducts: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/products/low-stock",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(response.error || "Failed to fetch low stock products");
      },
      providesTags: ["Products"],
    }),

    /**
     * Get Customer Overview
     * @param {Object} params - Query parameters
     * @param {string} params.from - Start date for new customer calculation (ISO format). Defaults to 30 days ago.
     * @param {string} params.to - End date (ISO format). Defaults to today.
     */
    getCustomerOverview: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/customers/overview",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(
          response.error || "Failed to fetch customer overview"
        );
      },
      providesTags: ["Customers"],
    }),

    /**
     * Get Top Customers
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of top customers to return (default: 10)
     */
    getTopCustomers: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/customers/top",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data || [];
        }
        throw new Error(response.error || "Failed to fetch top customers");
      },
      providesTags: ["Customers"],
    }),

    /**
     * Get Dashboard Alerts
     */
    getDashboardAlerts: builder.query({
      query: () => ({
        url: "/api/v1/admin/dashboard/alerts",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch dashboard alerts");
      },
      providesTags: ["Alerts"],
    }),

    /**
     * Get All Dashboard Data
     * Single endpoint that returns all dashboard data to avoid D1 overload from concurrent requests
     * @param {Object} params - Query parameters
     * @param {string} params.from - Start date (ISO format, e.g., "2025-12-01")
     * @param {string} params.to - End date (ISO format, e.g., "2025-12-12")
     */
    getAllDashboardData: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/dashboard/all",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch dashboard data");
      },
      providesTags: ["Dashboard", "KPIs", "Sales", "Products", "Customers", "Alerts"],
    }),
  }),
});

export const {
  useGetKPIStatsQuery,
  useGetSalesTrendsQuery,
  useGetSalesByCategoryQuery,
  useGetSalesByProductQuery,
  useGetSalesByPaymentMethodQuery,
  useGetOrderStatusCountsQuery,
  useGetProductSummaryQuery,
  useGetBestSellingProductsQuery,
  useGetLowStockProductsQuery,
  useGetCustomerOverviewQuery,
  useGetTopCustomersQuery,
  useGetDashboardAlertsQuery,
  useGetAllDashboardDataQuery,
} = dashboardApi;
