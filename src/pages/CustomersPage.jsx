import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../store/apis/userApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import CustomerTable from "../components/customer/CustomerTable";
import CustomerForm from "../components/customer/CustomerForm";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";

function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    isEmailVerified: "",
    isPhoneVerified: "",
    isActive: "",
    gender: "",
    ageMin: "",
    ageMax: "",
  });

  // Filter configuration - defines field types and options
  const filterConfig = [
    {
      key: "isEmailVerified",
      type: "boolean",
      label: "Email Verified",
    },
    {
      key: "isPhoneVerified",
      type: "boolean",
      label: "Phone Verified",
    },
    {
      key: "isActive",
      type: "boolean",
      label: "Active Status",
    },
    {
      key: "gender",
      type: "select",
      label: "Gender",
      options: ["Male", "Female", "Other"],
    },
    {
      key: "ageMin",
      type: "number",
      label: "Min Age",
      placeholder: "Minimum age",
      min: 0,
      max: 150,
    },
    {
      key: "ageMax",
      type: "number",
      label: "Max Age",
      placeholder: "Maximum age",
      min: 0,
      max: 150,
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
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery(queryParams);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const customers = response?.users || [];
  const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        await updateUser({ id: selectedCustomer.id, ...data }).unwrap();
        toast.success("Customer updated successfully");
      } else {
        await createUser(data).unwrap();
        toast.success("Customer created successfully");
      }
      setIsFormOpen(false);
      setSelectedCustomer(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to save customer"
      );
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
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
                    Error loading customers. Please try again.
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
                  Customer Management
                </h1>
                <PermissionGuard permission="users.create">
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
                    <span className="ml-2">Add Customer</span>
                  </button>
                </PermissionGuard>
              </div>

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search by name, email, or phone..."
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

              <PermissionGuard permission="users.view" fallback={
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">
                    You don't have permission to view customers.
                  </p>
                </div>
              }>
                <CustomerTable customers={customers} onEdit={handleEdit} isLoading={isLoading} />
              </PermissionGuard>

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
                  setSelectedCustomer(null);
                }}
                title={selectedCustomer ? "Edit Customer" : "Create New Customer"}
                className="w-full max-w-2xl"
              >
                <CustomerForm
                  customer={selectedCustomer}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedCustomer(null);
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

export default CustomersPage;

