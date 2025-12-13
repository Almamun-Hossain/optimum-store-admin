import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../store/apis/rolesApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";
import RoleForm from "../components/role/RoleForm";
import PermissionAssignmentModal from "../components/role/PermissionAssignmentModal";

function RolesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    isActive: "",
  });

  const filterConfig = [
    {
      key: "isActive",
      type: "boolean",
      label: "Active Status",
    },
  ];

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value === "true";
      }
    });

    return params;
  }, [currentPage, itemsPerPage, filters]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetRolesQuery(queryParams);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const roles = response?.roles || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this role? This action cannot be undone."
      )
    ) {
      try {
        await deleteRole(id).unwrap();
        toast.success("Role deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          error?.data?.error || error?.message || "Failed to delete role"
        );
      }
    }
  };

  const handleAssignPermissions = (role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedRole) {
        await updateRole({ id: selectedRole.id, ...data }).unwrap();
        toast.success("Role updated successfully");
      } else {
        await createRole(data).unwrap();
        toast.success("Role created successfully");
      }
      setIsFormOpen(false);
      setSelectedRole(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to save role"
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
                    Error loading roles. Please try again.
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
                  Roles Management
                </h1>
                <PermissionGuard permission="roles.create">
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
                    <span className="ml-2">Add Role</span>
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
                      Loading roles...
                    </p>
                  </div>
                ) : roles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No roles found
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
                            <div className="font-semibold text-left">Description</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Users</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Permissions</div>
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
                        {roles.map((role) => (
                          <tr key={role.id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100 font-medium">
                                {role.name}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3">
                              <div className="text-gray-600 dark:text-gray-400">
                                {role.description || "—"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {role._count?.adminUsers || 0}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {role._count?.permissions || 0}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  role.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                              >
                                {role.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(role)}
                                  className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAssignPermissions(role)}
                                  className="btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  Permissions
                                </button>
                                <button
                                  onClick={() => handleDelete(role.id)}
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
                  setSelectedRole(null);
                }}
                title={selectedRole ? "Edit Role" : "Create Role"}
                className="w-full max-w-2xl"
              >
                <RoleForm
                  role={selectedRole}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedRole(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              </GlobalModal>

              {selectedRole && (
                <PermissionAssignmentModal
                  role={selectedRole}
                  isOpen={isPermissionModalOpen}
                  onClose={() => {
                    setIsPermissionModalOpen(false);
                    setSelectedRole(null);
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

export default RolesPage;
