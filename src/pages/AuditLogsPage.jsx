import React, { useState, useMemo } from "react";
import {
  useGetAuditLogsQuery,
  useGetAuditLogByIdQuery,
  useGetAuditLogStatsQuery,
} from "../store/apis/auditLogsApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import AuditLogTable from "../components/audit/AuditLogTable";
import AuditLogDetailModal from "../components/audit/AuditLogDetailModal";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";

function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    adminUserId: "",
    action: "",
    entityType: "",
    entityId: "",
    startDate: "",
    endDate: "",
  });

  // Filter configuration
  const filterConfig = [
    {
      key: "adminUserId",
      type: "text",
      label: "Admin User ID",
      placeholder: "Filter by admin user ID",
    },
    {
      key: "action",
      type: "select",
      label: "Action",
      options: [
        { value: "create", label: "Create" },
        { value: "update", label: "Update" },
        { value: "delete", label: "Delete" },
        { value: "move", label: "Move" },
        { value: "assign_permissions", label: "Assign Permissions" },
        { value: "assign_role", label: "Assign Role" },
        { value: "verify_payment", label: "Verify Payment" },
        { value: "refund_payment", label: "Refund Payment" },
        { value: "adjust_inventory", label: "Adjust Inventory" },
        { value: "update_order_status", label: "Update Order Status" },
      ],
    },
    {
      key: "entityType",
      type: "select",
      label: "Entity Type",
      options: [
        { value: "product", label: "Product" },
        { value: "category", label: "Category" },
        { value: "order", label: "Order" },
        { value: "payment", label: "Payment" },
        { value: "adminUser", label: "Admin User" },
        { value: "role", label: "Role" },
        { value: "permission", label: "Permission" },
        { value: "preorder", label: "Preorder" },
        { value: "shippingMethod", label: "Shipping Method" },
        { value: "inventory", label: "Inventory" },
      ],
    },
    {
      key: "entityId",
      type: "text",
      label: "Entity ID",
      placeholder: "Filter by entity ID",
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

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    return params;
  }, [currentPage, itemsPerPage, filters]);

  const {
    data: logsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAuditLogsQuery(queryParams);

  const { data: statsResponse, isLoading: statsLoading } =
    useGetAuditLogStatsQuery({});

  const { data: logDetail, isLoading: isLogDetailLoading } = useGetAuditLogByIdQuery(selectedLog?.id, {
    skip: !selectedLog?.id,
  });

  const logs = logsResponse?.logs || [];
  const meta = logsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };
  const stats = statsResponse || {};

  const handleView = (log) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
    setCurrentPage(1);
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
                    Error loading audit logs. Please try again.
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
                  Audit Logs
                </h1>
              </div>

              {/* Stats Summary */}
              {stats && Object.keys(stats).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Logs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.total || 0}
                    </p>
                  </div>
                  {stats.byAction && stats.byAction.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Actions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.byAction.length}
                      </p>
                    </div>
                  )}
                  {stats.byEntityType && stats.byEntityType.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Entity Types</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.byEntityType.length}
                      </p>
                    </div>
                  )}
                  {stats.byAdminUser && stats.byAdminUser.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.byAdminUser.length}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search audit logs..."
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

              <AuditLogTable
                logs={logs.filter((log) =>
                  searchTerm
                    ? log.entityType
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      log.action
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      log.adminUser?.fullName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      log.adminUser?.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true
                )}
                onView={handleView}
                isLoading={isLoading}
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

              {/* Detail Modal */}
              <GlobalModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                  setIsDetailModalOpen(false);
                  setSelectedLog(null);
                }}
                title="Audit Log Details"
                className="w-full max-w-4xl mx-4"
              >
                <AuditLogDetailModal
                  logDetail={logDetail}
                  isLoading={isLogDetailLoading}
                />
              </GlobalModal>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default AuditLogsPage;
