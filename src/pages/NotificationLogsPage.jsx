import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetNotificationLogsQuery,
  useGetNotificationStatsQuery,
  useCreateNotificationLogMutation,
  useUpdateNotificationLogMutation,
  useDeleteNotificationLogMutation,
} from "../store/apis/notificationLogsApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import NotificationTable from "../components/notification/NotificationTable";
import NotificationStats from "../components/notification/NotificationStats";
import NotificationForm from "../components/notification/NotificationForm";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";

function NotificationLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    userId: "",
    type: "",
    template: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Filter configuration
  const filterConfig = [
    {
      key: "userId",
      type: "text",
      label: "User ID",
      placeholder: "Filter by user ID",
    },
    {
      key: "type",
      type: "select",
      label: "Notification Type",
      options: [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push Notification" },
      ],
    },
    {
      key: "template",
      type: "text",
      label: "Template",
      placeholder: "Filter by template name",
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "sent", label: "Sent" },
        { value: "failed", label: "Failed" },
        { value: "pending", label: "Pending" },
        { value: "delivered", label: "Delivered" },
      ],
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
  } = useGetNotificationLogsQuery(queryParams);

  const { data: statsResponse, isLoading: statsLoading } =
    useGetNotificationStatsQuery({});

  const [createLog, { isLoading: isCreating }] =
    useCreateNotificationLogMutation();
  const [updateLog, { isLoading: isUpdating }] =
    useUpdateNotificationLogMutation();
  const [deleteLog, { isLoading: isDeleting }] =
    useDeleteNotificationLogMutation();

  const logs = logsResponse?.logs || [];
  const meta = logsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };
  const stats = statsResponse || {};

  const handleCreate = () => {
    setSelectedNotification(null);
    setIsFormOpen(true);
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification log?")) {
      try {
        await deleteLog(id).unwrap();
        toast.success("Notification log deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          error?.data?.error ||
          error?.message ||
          "Failed to delete notification log"
        );
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedNotification) {
        await updateLog({ id: selectedNotification.id, ...data }).unwrap();
        toast.success("Notification log updated successfully");
      } else {
        await createLog(data).unwrap();
        toast.success("Notification log created successfully");
      }
      setIsFormOpen(false);
      setSelectedNotification(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error ||
        error?.message ||
        "Failed to save notification log"
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
                    Error loading notification logs. Please try again.
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
                  Notification Logs
                </h1>
                <PermissionGuard permission="notifications.send">
                  <button
                    onClick={handleCreate}
                    className="btn bg-violet-500 hover:bg-violet-600 text-white mt-4 sm:mt-0"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Notification Log</span>
                  </button>
                </PermissionGuard>
              </div>

              <NotificationStats stats={stats} isLoading={statsLoading} />

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search notification logs..."
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

              <NotificationTable
                logs={logs.filter((log) =>
                  searchTerm
                    ? log.recipient
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    log.template
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                    : true
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
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

              <GlobalModal
                isOpen={isFormOpen}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedNotification(null);
                }}
                title={
                  selectedNotification
                    ? "Edit Notification Log"
                    : "Create Notification Log"
                }
                className="w-full max-w-2xl"
              >
                <NotificationForm
                  notification={selectedNotification}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedNotification(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              </GlobalModal>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default NotificationLogsPage;

