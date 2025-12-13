import React from 'react';

/**
 * BestSellingProductsTable - Table component for displaying best selling products
 * @param {Array|Object} bestSellers - Array of best selling product objects or object containing array
 */
function BestSellingProductsTable({ bestSellers }) {
  // Handle different response structures - could be array directly or nested in object
  let products = [];
  if (Array.isArray(bestSellers)) {
    products = bestSellers;
  } else if (bestSellers && typeof bestSellers === 'object') {
    // Check if it's an object with a products array or data array
    products = bestSellers.products || bestSellers.data || [];
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col col-span-full lg:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Best Selling Products
        </h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Product
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Quantity
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-gray-400">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                  ৳{product.revenue?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BestSellingProductsTable;
