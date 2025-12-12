import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} from "../store/apis/adminOrdersApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import OrderTable from "../components/order/OrderTable";
import OrderDetailModal from "../components/order/OrderDetailModal";
import OrderStatusModal from "../components/order/OrderStatusModal";
import OrderStats from "../components/order/OrderStats";
import ToasterWrapper from "../layout/ToasterWrapper";

function AdminOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      type: "select",
      label: "Order Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    {
      key: "paymentStatus",
      type: "select",
      label: "Payment Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    {
      key: "paymentMethod",
      type: "select",
      label: "Payment Method",
      options: [
        { value: "credit_card", label: "Credit Card" },
        { value: "debit_card", label: "Debit Card" },
        { value: "paypal", label: "PayPal" },
        { value: "bank_transfer", label: "Bank Transfer" },
        { value: "cash_on_delivery", label: "Cash on Delivery" },
      ],
    },
    {
      key: "userId",
      type: "text",
      label: "User ID",
      placeholder: "Filter by user ID",
    },
    {
      key: "startDate",
      type: "text",
      label: "Start Date",
      placeholder: "YYYY-MM-DD",
    },
    {
      key: "endDate",
      type: "text",
      label: "End Date",
      placeholder: "YYYY-MM-DD",
    },
  ];

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    return params;
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch,
  } = useGetOrdersQuery(queryParams);

  const { data: statsResponse, isLoading: statsLoading } = useGetOrderStatsQuery({});

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const orders = ordersResponse?.orders || [];
  const meta = ordersResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };
  const stats = statsResponse || {};

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (data) => {
    try {
      await updateOrderStatus(data).unwrap();
      toast.success("Order status updated successfully");
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to update order status"
      );
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  if (ordersError) {
    return (
      <ToasterWrapper>
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">
                    Error loading orders. Please try again.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ToasterWrapper>
    );
  }

  return (
    <ToasterWrapper>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Orders Management
                </h1>
              </div>

              <OrderStats stats={stats} isLoading={statsLoading} />

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search by order number or customer email..."
                />
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filterConfig={filterConfig}
                title="Filters"
                defaultOpen={false}
              />

              <OrderTable
                orders={orders}
                onView={handleView}
                onUpdateStatus={handleUpdateStatus}
                isLoading={ordersLoading}
              />

              {meta.totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  totalItems={meta.total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newLimit) => {
                    setItemsPerPage(newLimit);
                    setCurrentPage(1);
                  }}
                />
              )}

              <OrderDetailModal
                order={selectedOrder}
                isOpen={isDetailModalOpen}
                onClose={() => {
                  setIsDetailModalOpen(false);
                  setSelectedOrder(null);
                }}
              />

              <OrderStatusModal
                order={selectedOrder}
                isOpen={isStatusModalOpen}
                onClose={() => {
                  setIsStatusModalOpen(false);
                  setSelectedOrder(null);
                }}
                onSubmit={handleStatusSubmit}
                isLoading={isUpdatingStatus}
              />
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default AdminOrdersPage;

