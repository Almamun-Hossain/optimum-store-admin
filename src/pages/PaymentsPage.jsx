import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetPaymentsQuery,
  useVerifyCODPaymentMutation,
  useCollectFromCourierMutation,
  useUpdatePaymentStatusMutation,
} from "../store/apis/paymentsApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";

function PaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    method: "",
    status: "",
    orderId: "",
    startDate: "",
    endDate: "",
  });

  const filterConfig = [
    {
      key: "method",
      type: "select",
      label: "Payment Method",
      options: [
        { value: "", label: "All" },
        { value: "cod", label: "Cash on Delivery" },
        { value: "bkash", label: "bKash" },
        { value: "nagad", label: "Nagad" },
        { value: "rocket", label: "Rocket" },
        { value: "card", label: "Card" },
      ],
    },
    {
      key: "status",
      type: "select",
      label: "Payment Status",
      options: [
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    {
      key: "orderId",
      type: "number",
      label: "Order ID",
    },
    {
      key: "startDate",
      type: "date",
      label: "Start Date",
    },
    {
      key: "endDate",
      type: "date",
      label: "End Date",
    },
  ];

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    return params;
  }, [currentPage, itemsPerPage, filters]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetPaymentsQuery(queryParams);

  const [verifyCOD] = useVerifyCODPaymentMutation();
  const [collectFromCourier] = useCollectFromCourierMutation();
  const [updateStatus] = useUpdatePaymentStatusMutation();

  const payments = response?.payments || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };

  const handleVerifyCOD = async (payment) => {
    if (
      !window.confirm(
        "Verify this COD payment? This will mark it as paid if the order is delivered."
      )
    ) {
      return;
    }

    try {
      await verifyCOD({
        id: payment.id,
        collectedBy: "Admin",
        collectedAt: new Date().toISOString(),
      }).unwrap();
      toast.success("Payment verified successfully");
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to verify payment"
      );
    }
  };

  const handleCollectFromCourier = async (payment) => {
    const courierName = prompt("Enter courier name (e.g., SteadFast):");
    if (!courierName) return;

    const trackingNumber = prompt("Enter tracking number:");
    if (!trackingNumber) return;

    try {
      await collectFromCourier({
        id: payment.id,
        courierName,
        courierTrackingNumber: trackingNumber,
        collectedAt: new Date().toISOString(),
      }).unwrap();
      toast.success("Payment collection recorded successfully");
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to record collection"
      );
    }
  };

  const handleUpdateStatus = async (payment, newStatus) => {
    if (
      !window.confirm(
        `Change payment status to ${newStatus.toUpperCase()}?`
      )
    ) {
      return;
    }

    try {
      await updateStatus({
        id: payment.id,
        status: newStatus,
      }).unwrap();
      toast.success("Payment status updated successfully");
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to update status"
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

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
      refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || statusColors.pending
        }`}
      >
        {status?.toUpperCase() || "UNKNOWN"}
      </span>
    );
  };

  if (isError) {
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
                    Error loading payments. Please try again.
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
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Payment Management
                </h1>
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filterConfig={filterConfig}
                title="Filters"
                defaultOpen={false}
              />

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Loading payments...
                    </p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No payments found
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                      <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">ID</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Order ID</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Method</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Amount</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Status</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Actions</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {payment.id}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {payment.orderId}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {payment.method?.toUpperCase() || "N/A"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                ৳{payment.amount?.toLocaleString() || "0"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                {payment.method === "cod" &&
                                  payment.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleVerifyCOD(payment)}
                                        className="btn-xs bg-green-500 hover:bg-green-600 text-white"
                                      >
                                        Verify
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCollectFromCourier(payment)
                                        }
                                        className="btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                                      >
                                        Collect
                                      </button>
                                    </>
                                  )}
                                {payment.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(payment, "paid")
                                    }
                                    className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

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
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default PaymentsPage;
