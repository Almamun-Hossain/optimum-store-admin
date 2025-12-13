import React from 'react';

/**
 * ProductSummaryCard - Product summary statistics card
 * @param {Object} productSummary - Product summary data object
 */
function ProductSummaryCard({ productSummary }) {
  if (!productSummary) {
    return null;
  }

  const metrics = [
    {
      label: "Total Products",
      value: productSummary.totalProducts || "0",
      color: "text-gray-900 dark:text-gray-100"
    },
    {
      label: "Out of Stock",
      value: productSummary.outOfStock || "0",
      color: "text-red-600 dark:text-red-400"
    },
    {
      label: "Low Stock",
      value: productSummary.lowStock || "0",
      color: "text-yellow-600 dark:text-yellow-400"
    },
    {
      label: "Inventory Value",
      value: `৳${productSummary.inventoryValue?.toLocaleString() || "0"}`,
      color: "text-gray-900 dark:text-gray-100"
    }
  ];

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 mb-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Product Summary
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {metric.label}
            </div>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSummaryCard;
