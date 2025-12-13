import React from 'react';

/**
 * TopCustomersTable - Table component for displaying top customers
 * @param {Array|Object} topCustomers - Array of top customer objects or object containing array
 */
function TopCustomersTable({ topCustomers }) {
  // Handle different response structures - could be array directly or nested in object
  let customers = [];
  if (Array.isArray(topCustomers)) {
    customers = topCustomers;
  } else if (topCustomers && typeof topCustomers === 'object') {
    // Check if it's an object with a customers array or data array
    customers = topCustomers.customers || topCustomers.data || [];
  }

  if (!customers || customers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Top Customers
        </h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Orders
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((customer, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {customer.name}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-gray-400">
                  {customer.orders}
                </td>
                <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                  ৳{customer.revenue?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopCustomersTable;
