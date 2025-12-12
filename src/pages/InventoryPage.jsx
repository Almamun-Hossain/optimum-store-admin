import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetLowStockItemsQuery,
  useAdjustInventoryMutation,
} from "../store/apis/inventoryApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import LowStockTable from "../components/inventory/LowStockTable";
import InventoryAdjustForm from "../components/inventory/InventoryAdjustForm";
import ToasterWrapper from "../layout/ToasterWrapper";

function InventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isAdjustFormOpen, setIsAdjustFormOpen] = useState(false);

  const {
    data: lowStockResponse,
    isLoading,
    isError,
    refetch,
  } = useGetLowStockItemsQuery({ limit: 50 });

  const [adjustInventory, { isLoading: isAdjusting }] =
    useAdjustInventoryMutation();

  const lowStockItems = lowStockResponse?.lowStockItems || [];
  const alert = lowStockResponse?.alert || "";

  const handleAdjust = (item) => {
    setSelectedInventory(item);
    setIsAdjustFormOpen(true);
  };

  const handleAdjustSubmit = async (data) => {
    try {
      await adjustInventory({
        variantId: selectedInventory.variantId,
        ...data,
      }).unwrap();
      toast.success("Inventory adjusted successfully");
      setIsAdjustFormOpen(false);
      setSelectedInventory(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to adjust inventory"
      );
    }
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
                    Error loading inventory. Please try again.
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
                  Inventory Management
                </h1>
              </div>

              {alert && (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {alert}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Low Stock Items
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Items below reorder point
                  </p>
                </div>
                <LowStockTable
                  items={lowStockItems}
                  onAdjust={handleAdjust}
                  isLoading={isLoading}
                />
              </div>

              <InventoryAdjustForm
                inventory={selectedInventory}
                isOpen={isAdjustFormOpen}
                onClose={() => {
                  setIsAdjustFormOpen(false);
                  setSelectedInventory(null);
                }}
                onSubmit={handleAdjustSubmit}
                isLoading={isAdjusting}
              />
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default InventoryPage;

