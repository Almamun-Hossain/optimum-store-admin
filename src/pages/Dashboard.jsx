import React, { useState, useMemo } from "react";
import { useGetAllDashboardDataQuery } from "../store/apis/dashboardApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Datepicker from "../components/Datepicker";
import ToasterWrapper from "../layout/ToasterWrapper";
import LineChart01 from "../charts/LineChart01";
import DoughnutChart from "../charts/DoughnutChart";
import { tailwindConfig } from "../utils/Utils";
import PermissionGuard from "../components/PermissionGuard";
import KPICard from "../components/dashboard/KPICard";
import DashboardAlert from "../components/dashboard/DashboardAlert";
import ProductSummaryCard from "../components/dashboard/ProductSummaryCard";
import ChartCard from "../components/dashboard/ChartCard";
import OrderStatusCard from "../components/dashboard/OrderStatusCard";
import CustomerOverviewCard from "../components/dashboard/CustomerOverviewCard";
import BestSellingProductsTable from "../components/dashboard/BestSellingProductsTable";
import LowStockProductsTable from "../components/dashboard/LowStockProductsTable";
import TopCustomersTable from "../components/dashboard/TopCustomersTable";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Fetch all dashboard data in a single request
  const { data: dashboardData, isLoading: dashboardLoading } = useGetAllDashboardDataQuery({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Extract data from the single response
  const kpiStats = dashboardData?.kpis;
  const salesTrends = dashboardData?.salesTrends;
  const salesByCategory = dashboardData?.salesByCategory;
  const salesByProduct = dashboardData?.salesByProduct;
  const salesByPaymentMethod = dashboardData?.salesByPaymentMethod;
  const orderStatusCounts = dashboardData?.orderStatusCounts;
  const productSummary = dashboardData?.productsSummary;
  const bestSellers = dashboardData?.bestSellers;
  const lowStockProducts = dashboardData?.lowStockProducts;
  const customerOverview = dashboardData?.customersOverview;
  const topCustomers = dashboardData?.topCustomers;
  const alerts = dashboardData?.alerts;

  // Prepare chart data
  const salesTrendsData = useMemo(() => {
    if (!salesTrends) return null;
    return {
      labels: salesTrends.labels || [],
      datasets: [
        {
          label: "Revenue",
          data: salesTrends.revenue || [],
          fill: false,
          borderColor: tailwindConfig().theme.colors.violet[500],
          backgroundColor: tailwindConfig().theme.colors.violet[500],
          tension: 0.4,
        },
        {
          label: "Orders",
          data: salesTrends.orders || [],
          fill: false,
          borderColor: tailwindConfig().theme.colors.sky[500],
          backgroundColor: tailwindConfig().theme.colors.sky[500],
          tension: 0.4,
        },
      ],
    };
  }, [salesTrends]);

  const salesByCategoryData = useMemo(() => {
    if (!salesByCategory || !Array.isArray(salesByCategory)) return null;
    return {
      labels: salesByCategory.map((item) => item.name),
      datasets: [
        {
          label: "Revenue",
          data: salesByCategory.map((item) => item.revenue),
          backgroundColor: [
            tailwindConfig().theme.colors.violet[500],
            tailwindConfig().theme.colors.sky[500],
            tailwindConfig().theme.colors.emerald[500],
            tailwindConfig().theme.colors.amber[500],
            tailwindConfig().theme.colors.rose[500],
          ],
        },
      ],
    };
  }, [salesByCategory]);

  const paymentMethodData = useMemo(() => {
    if (!salesByPaymentMethod || !Array.isArray(salesByPaymentMethod)) return null;
    return {
      labels: salesByPaymentMethod.map((item) => item.method.toUpperCase()),
      datasets: [
        {
          label: "Revenue",
          data: salesByPaymentMethod.map((item) => item.revenue),
          backgroundColor: [
            tailwindConfig().theme.colors.violet[500],
            tailwindConfig().theme.colors.sky[500],
            tailwindConfig().theme.colors.emerald[500],
            tailwindConfig().theme.colors.amber[500],
            tailwindConfig().theme.colors.rose[500],
          ],
        },
      ],
    };
  }, [salesByPaymentMethod]);

  return (
    <ToasterWrapper>
      <div className="flex overflow-hidden h-screen">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="flex overflow-y-auto overflow-x-hidden relative flex-col flex-1">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="grow">
            <div className="px-4 py-8 mx-auto w-full sm:px-6 lg:px-8 max-w-9xl">
              {/* Dashboard actions */}
              <div className="mb-8 sm:flex sm:justify-between sm:items-center">
                  <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                    Dashboard
                  </h1>
                <Datepicker 
                  align="right" 
                  value={dateRange}
                  onDateChange={setDateRange}
                />
              </div>

              <PermissionGuard permission="dashboard.view" fallback={
                <div className="py-12 text-center">
                  <p className="text-red-600 dark:text-red-400">
                    You don't have permission to view the dashboard.
                  </p>
                </div>
              }>
                {/* Alerts */}
                <DashboardAlert alerts={alerts?.alerts} />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Total Revenue"
                    value={kpiStats?.revenue}
                    isLoading={dashboardLoading}
                    prefix="৳"
                    formatter={(val) => val?.toLocaleString()}
                  />
                  <KPICard
                    title="Total Orders"
                    value={kpiStats?.orders}
                    isLoading={dashboardLoading}
                  />
                  <KPICard
                    title="Customers"
                    value={kpiStats?.customers}
                    isLoading={dashboardLoading}
                  />
                  <KPICard
                    title="Avg Order Value"
                    value={kpiStats?.avgOrderValue}
                    isLoading={dashboardLoading}
                    prefix="৳"
                    formatter={(val) => val?.toFixed(2)}
                  />
                </div>

                {/* Product Summary */}
                <ProductSummaryCard productSummary={productSummary} />

                {/* Charts and Tables */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Sales Trends */}
                  {salesTrendsData && salesTrendsData.labels && salesTrendsData.labels.length > 0 && (
                    <ChartCard
                      title="Sales Trends"
                      isLoading={dashboardLoading}
                      colSpan="col-span-full lg:col-span-8"
                    >
                      <LineChart01 data={salesTrendsData} width={800} height={256} />
                    </ChartCard>
                  )}

                  {/* Order Status Counts */}
                  <OrderStatusCard orderStatusCounts={orderStatusCounts} />

                  {/* Sales by Category */}
                  {salesByCategoryData && salesByCategoryData.labels && salesByCategoryData.labels.length > 0 && (
                    <ChartCard title="Sales by Category" colSpan="col-span-full sm:col-span-6">
                      <DoughnutChart data={salesByCategoryData} width={400} height={200} />
                    </ChartCard>
                  )}

                  {/* Sales by Payment Method */}
                  {paymentMethodData && paymentMethodData.labels && paymentMethodData.labels.length > 0 && (
                    <ChartCard title="Sales by Payment Method" colSpan="col-span-full sm:col-span-6">
                      <DoughnutChart data={paymentMethodData} width={400} height={200} />
                    </ChartCard>
                  )}

                  {/* Best Selling Products */}
                  <BestSellingProductsTable bestSellers={bestSellers} />

                  {/* Low Stock Products */}
                  <LowStockProductsTable lowStockProducts={lowStockProducts} />

                  {/* Customer Overview */}
                  <CustomerOverviewCard customerOverview={customerOverview} />

                  {/* Top Customers */}
                  <TopCustomersTable topCustomers={topCustomers} />
                </div>
              </PermissionGuard>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default Dashboard;
