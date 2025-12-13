import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetPreordersQuery,
  useCreatePreorderMutation,
  useUpdatePreorderMutation,
  useDeletePreorderMutation,
} from "../store/apis/preordersApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";
import PreorderForm from "../components/preorder/PreorderForm";

function PreordersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPreorder, setSelectedPreorder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    isActive: "",
    variantId: "",
  });

  const filterConfig = [
    {
      key: "isActive",
      type: "boolean",
      label: "Active Status",
    },
    {
      key: "variantId",
      type: "number",
      label: "Variant ID",
    },
  ];

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value === "true" ? true : value === "false" ? false : value;
      }
    });

    return params;
  }, [currentPage, itemsPerPage, filters]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetPreordersQuery(queryParams);

  const [createPreorder, { isLoading: isCreating }] =
    useCreatePreorderMutation();
  const [updatePreorder, { isLoading: isUpdating }] =
    useUpdatePreorderMutation();
  const [deletePreorder, { isLoading: isDeleting }] =
    useDeletePreorderMutation();

  const preorders = response?.preorders || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };

  const handleCreate = () => {
    setSelectedPreorder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (preorder) => {
    setSelectedPreorder(preorder);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this preorder? This action cannot be undone."
      )
    ) {
      try {
        await deletePreorder(id).unwrap();
        toast.success("Preorder deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          error?.data?.error || error?.message || "Failed to delete preorder"
        );
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Convert date to ISO string
      const submitData = {
        ...data,
        expectedArrivalDate: new Date(data.expectedArrivalDate).toISOString(),
      };

      if (selectedPreorder) {
        await updatePreorder({ id: selectedPreorder.id, ...submitData }).unwrap();
        toast.success("Preorder updated successfully");
      } else {
        await createPreorder(submitData).unwrap();
        toast.success("Preorder created successfully");
      }
      setIsFormOpen(false);
      setSelectedPreorder(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to save preorder"
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
                    Error loading preorders. Please try again.
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
                  Preorders Management
                </h1>
                <PermissionGuard permission="preorders.create">
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
                    <span className="ml-2">Add Preorder</span>
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
                      Loading preorders...
                    </p>
                  </div>
                ) : preorders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No preorders found
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
                            <div className="font-semibold text-left">Variant ID</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Expected Arrival</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Max Quantity</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Current Preorders</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Available Slots</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Price</div>
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
                        {preorders.map((preorder) => (
                          <tr key={preorder.id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.id}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.variantId}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.expectedArrivalDate
                                  ? new Date(
                                      preorder.expectedArrivalDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.maximumQuantity}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.currentPreorders || 0}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                {preorder.availableSlots || 0}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-gray-800 dark:text-gray-100">
                                ৳{preorder.preorderPrice?.toLocaleString() || "0"}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  preorder.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                              >
                                {preorder.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(preorder)}
                                  className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(preorder.id)}
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
                  setSelectedPreorder(null);
                }}
                title={
                  selectedPreorder
                    ? "Edit Preorder"
                    : "Create Preorder"
                }
                className="w-full max-w-2xl"
              >
                <PreorderForm
                  preorder={selectedPreorder}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedPreorder(null);
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

export default PreordersPage;
