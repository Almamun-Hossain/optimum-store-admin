import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetShippingMethodsQuery,
  useCreateShippingMethodMutation,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
} from "../store/apis/shippingMethodsApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import ShippingTable from "../components/shipping/ShippingTable";
import ShippingForm from "../components/shipping/ShippingForm";
import CostCalculator from "../components/shipping/CostCalculator";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";

function ShippingMethodsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    isActive: "",
    city: "",
  });

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.isActive !== "") {
      params.isActive = filters.isActive === "true";
    }
    if (filters.city) {
      params.city = filters.city;
    }
    return params;
  }, [filters]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetShippingMethodsQuery(queryParams);

  const [createMethod, { isLoading: isCreating }] =
    useCreateShippingMethodMutation();
  const [updateMethod, { isLoading: isUpdating }] =
    useUpdateShippingMethodMutation();
  const [deleteMethod, { isLoading: isDeleting }] =
    useDeleteShippingMethodMutation();

  const shippingMethods = response?.shippingMethods || [];
  const total = response?.total || 0;

  const handleCreate = () => {
    setSelectedMethod(null);
    setIsFormOpen(true);
  };

  const handleEdit = (method) => {
    setSelectedMethod(method);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shipping method?")) {
      try {
        await deleteMethod(id).unwrap();
        toast.success("Shipping method deleted successfully");
        refetch();
      } catch (error) {
        toast.error(
          error?.data?.error || error?.message || "Failed to delete shipping method"
        );
      }
    }
  };

  const handleCalculate = (method) => {
    setSelectedMethod(method);
    setIsCalculatorOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedMethod) {
        await updateMethod({ id: selectedMethod.id, ...data }).unwrap();
        toast.success("Shipping method updated successfully");
      } else {
        await createMethod(data).unwrap();
        toast.success("Shipping method created successfully");
      }
      setIsFormOpen(false);
      setSelectedMethod(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to save shipping method"
      );
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
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
                    Error loading shipping methods. Please try again.
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
                  Shipping Methods
                </h1>
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
                  <span className="ml-2">Add Shipping Method</span>
                </button>
              </div>

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search shipping methods..."
                />
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                title="Filters"
              />

              <ShippingTable
                shippingMethods={shippingMethods.filter((method) =>
                  searchTerm
                    ? method.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCalculate={handleCalculate}
                isLoading={isLoading}
              />

              <GlobalModal
                isOpen={isFormOpen}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedMethod(null);
                }}
                title={
                  selectedMethod
                    ? "Edit Shipping Method"
                    : "Create Shipping Method"
                }
                className="w-full max-w-2xl"
              >
                <ShippingForm
                  shippingMethod={selectedMethod}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedMethod(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              </GlobalModal>

              <CostCalculator
                shippingMethod={selectedMethod}
                isOpen={isCalculatorOpen}
                onClose={() => {
                  setIsCalculatorOpen(false);
                  setSelectedMethod(null);
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default ShippingMethodsPage;

