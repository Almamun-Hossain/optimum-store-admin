import React from "react";
import { FiEdit, FiTrash2, FiDollarSign } from "react-icons/fi";
import PermissionGuard from "../PermissionGuard";
import EmptyState from "../shared/EmptyState";

const ShippingTable = ({
  shippingMethods,
  onEdit,
  onDelete,
  onCalculate,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading shipping methods...</p>
      </div>
    );
  }

  if (!shippingMethods || shippingMethods.length === 0) {
    return (
      <EmptyState
        icon="truck"
        title="No shipping methods found"
        message="Get started by creating your first shipping method."
      />
    );
  }

  const parseCities = (citiesString) => {
    try {
      return JSON.parse(citiesString || "[]");
    } catch {
      return [];
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Base Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cost Per Kg
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estimated Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {shippingMethods.map((method) => {
              const cities = parseCities(method.availableInCities);
              return (
                <tr
                  key={method.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {method.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {method.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ৳{method.baseCost?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    ৳{method.costPerKg?.toLocaleString() || "0"}/kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {method.estimatedDays || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {cities.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {cities.length} {cities.length === 1 ? "city" : "cities"}
                      </span>
                    ) : (
                      "All"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {method.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <PermissionGuard permission="shipping.calculate">
                        <button
                          onClick={() => onCalculate(method)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Calculate Cost"
                        >
                          <FiDollarSign className="w-5 h-5" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission="shipping.update">
                        <button
                          onClick={() => onEdit(method)}
                          className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission="shipping.delete">
                        <button
                          onClick={() => onDelete(method.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingTable;

