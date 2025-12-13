import React, { useState, useMemo } from "react";
import {
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
} from "../store/apis/dashboardApi";
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

  // Fetch all dashboard data
  const { data: kpiStats, isLoading: kpiLoading } = useGetKPIStatsQuery({
    from: dateRange.from,
    to: dateRange.to,
  });

  const { data: salesTrends, isLoading: trendsLoading } = useGetSalesTrendsQuery({
    from: dateRange.from,
    to: dateRange.to,
    groupBy: "day",
  });

  const { data: salesByCategory } = useGetSalesByCategoryQuery({ limit: 5 });
  const { data: salesByProduct } = useGetSalesByProductQuery({ limit: 5 });
  const { data: salesByPaymentMethod } = useGetSalesByPaymentMethodQuery();
  const { data: orderStatusCounts } = useGetOrderStatusCountsQuery();
  const { data: productSummary } = useGetProductSummaryQuery();
  const { data: bestSellers } = useGetBestSellingProductsQuery({ limit: 5 });
  const { data: lowStockProducts } = useGetLowStockProductsQuery({ limit: 10 });
  const { data: customerOverview } = useGetCustomerOverviewQuery({
    from: dateRange.from,
    to: dateRange.to,
  });
  const { data: topCustomers } = useGetTopCustomersQuery({ limit: 5 });
  const { data: alerts } = useGetDashboardAlertsQuery();

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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {/* Dashboard actions */}
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Dashboard
                  </h1>
                <Datepicker align="right" />
              </div>

              <PermissionGuard permission="dashboard.view" fallback={
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">
                    You don't have permission to view the dashboard.
                  </p>
                </div>
              }>
                {/* Alerts */}
                <DashboardAlert alerts={alerts?.alerts} />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <KPICard
                    title="Total Revenue"
                    value={kpiStats?.revenue}
                    isLoading={kpiLoading}
                    prefix="৳"
                    formatter={(val) => val?.toLocaleString()}
                  />
                  <KPICard
                    title="Total Orders"
                    value={kpiStats?.orders}
                    isLoading={kpiLoading}
                  />
                  <KPICard
                    title="Customers"
                    value={kpiStats?.customers}
                    isLoading={kpiLoading}
                  />
                  <KPICard
                    title="Avg Order Value"
                    value={kpiStats?.avgOrderValue}
                    isLoading={kpiLoading}
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
                      isLoading={trendsLoading}
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
