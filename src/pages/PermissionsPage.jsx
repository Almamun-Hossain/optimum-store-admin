import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../store/apis/rolesApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";
import PermissionForm from "../components/permission/PermissionForm";
import PermissionsTable from "../components/permission/PermissionsTable";
import RolesForPermissionModal from "../components/permission/RolesForPermissionModal";
import EmptyState from "../components/shared/EmptyState";

function PermissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filters, setFilters] = useState({
    module: "",
  });

  // Available modules based on the permission list
  // Note: "users" module is displayed as "Customers" in the frontend
  const availableModules = [
    { value: "admin_users", label: "Admin Users" },
    { value: "audit_logs", label: "Audit Logs" },
    { value: "categories", label: "Categories" },
    { value: "dashboard", label: "Dashboard" },
    { value: "inventory", label: "Inventory" },
    { value: "notifications", label: "Notifications" },
    { value: "orders", label: "Orders" },
    { value: "payments", label: "Payments" },
    { value: "permissions", label: "Permissions" },
    { value: "preorders", label: "Preorders" },
    { value: "products", label: "Products" },
    { value: "reports", label: "Reports" },
    { value: "roles", label: "Roles" },
    { value: "settings", label: "Settings" },
    { value: "shipping", label: "Shipping" },
    { value: "users", label: "Customers" }, // "users" module displayed as "Customers"
  ];

  const filterConfig = [
    {
      key: "module",
      type: "select",
      label: "Module",
      options: [{ value: "", label: "All Modules" }, ...availableModules],
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
  } = useGetPermissionsQuery(queryParams);

  const [createPermission, { isLoading: isCreating }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] =
    useUpdatePermissionMutation();
  const [deletePermission, { isLoading: isDeleting }] =
    useDeletePermissionMutation();

  const permissions = response?.permissions || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  };

  const handleCreate = () => {
    setSelectedPermission(null);
    setIsFormOpen(true);
  };

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this permission? This action cannot be undone."
      )
    ) {
      try {
        await deletePermission(id).unwrap();
        toast.success("Permission deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          error?.data?.error || error?.message || "Failed to delete permission"
        );
      }
    }
  };

  const handleViewRoles = (permission) => {
    setSelectedPermission(permission);
    setIsRolesModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedPermission) {
        await updatePermission({ id: selectedPermission.id, ...data }).unwrap();
        toast.success("Permission updated successfully");
      } else {
        await createPermission(data).unwrap();
        toast.success("Permission created successfully");
      }
      setIsFormOpen(false);
      setSelectedPermission(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to save permission"
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

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped = {};
    permissions.forEach((perm) => {
      const module = perm.module || "other";
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(perm);
    });
    return grouped;
  }, [permissions]);

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
                    Error loading permissions. Please try again.
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
                  Permissions Management
                </h1>
                <PermissionGuard permission="permissions.manage">
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
                    <span className="ml-2">Add Permission</span>
                  </button>
                </PermissionGuard>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Permissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {meta.total || permissions.length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Modules</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {Object.keys(permissionsByModule).length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Page</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {permissions.length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Filtered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filters.module ? "Yes" : "No"}
                  </p>
                </div>
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
                      Loading permissions...
                    </p>
                  </div>
                ) : permissions.length === 0 ? (
                  <EmptyState
                    icon="shield"
                    title="No permissions found"
                    message="Get started by creating your first permission or adjust your filters."
                    action={
                      <PermissionGuard permission="permissions.manage">
                        <button
                          onClick={handleCreate}
                          className="btn bg-violet-500 hover:bg-violet-600 text-white"
                        >
                          Create Permission
                        </button>
                      </PermissionGuard>
                    }
                  />
                ) : (
                  <PermissionsTable
                    permissionsByModule={permissionsByModule}
                    onViewRoles={handleViewRoles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
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

              <GlobalModal
                isOpen={isFormOpen}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedPermission(null);
                }}
                title={
                  selectedPermission
                    ? "Edit Permission"
                    : "Create Permission"
                }
                className="w-full max-w-2xl"
              >
                <PermissionForm
                  permission={selectedPermission}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedPermission(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              </GlobalModal>

              {selectedPermission && (
                <RolesForPermissionModal
                  permission={selectedPermission}
                  isOpen={isRolesModalOpen}
                  onClose={() => {
                    setIsRolesModalOpen(false);
                    setSelectedPermission(null);
                    refetch();
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

export default PermissionsPage;
