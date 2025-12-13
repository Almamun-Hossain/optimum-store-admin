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
import RolesForPermissionModal from "../components/permission/RolesForPermissionModal";

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

  const filterConfig = [
    {
      key: "module",
      type: "text",
      label: "Module",
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
                <PermissionGuard permission="permissions.create">
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
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No permissions found
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                      <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Name</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Module</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Action</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Description</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Roles</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Actions</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {permissions.map((permission) => (
                          <tr key={permission.id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100 font-medium">
                                {permission.name}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {permission.module}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {permission.action}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3">
                              <div className="text-gray-600 dark:text-gray-400">
                                {permission.description || "—"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {permission._count?.roles || 0}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewRoles(permission)}
                                  className="btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                                  title="View/Manage Roles"
                                >
                                  Roles
                                </button>
                                <button
                                  onClick={() => handleEdit(permission)}
                                  className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(permission.id)}
                                  className="btn-xs bg-red-500 hover:bg-red-600 text-white"
                                  disabled={isDeleting}
                                >
                                  Delete
                                </button>
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
