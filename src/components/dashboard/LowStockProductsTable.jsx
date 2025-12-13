import React from 'react';

/**
 * LowStockProductsTable - Table component for displaying low stock products
 * @param {Array|Object} lowStockProducts - Array of low stock product objects or object containing array
 */
function LowStockProductsTable({ lowStockProducts }) {
  // Handle different response structures - could be array directly or nested in object
  let products = [];
  if (Array.isArray(lowStockProducts)) {
    products = lowStockProducts;
  } else if (lowStockProducts && typeof lowStockProducts === 'object') {
    // Check if it's an object with a products array or data array
    products = lowStockProducts.products || lowStockProducts.data || lowStockProducts.lowStockItems || [];
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col col-span-full lg:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Low Stock Alert
        </h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                SKU
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Available
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Reorder Point
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {product.productName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {product.sku}
                </td>
                <td className="px-4 py-2 text-sm text-right text-red-600 dark:text-red-400 font-medium">
                  {product.available}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-gray-400">
                  {product.reorderPoint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LowStockProductsTable;
