import React from 'react';

/**
 * KPICard - Reusable KPI metric card component
 * @param {string} title - The title/label of the KPI
 * @param {string|number} value - The value to display
 * @param {boolean} isLoading - Loading state
 * @param {string} prefix - Optional prefix (e.g., "৳")
 * @param {function} formatter - Optional formatter function for the value
 */
function KPICard({ title, value, isLoading = false, prefix = "", formatter = null }) {
  const displayValue = formatter ? formatter(value) : value;
  const formattedValue = prefix ? `${prefix}${displayValue}` : displayValue;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
        ) : (
          formattedValue || "0"
        )}
      </div>
    </div>
  );
}

export default KPICard;
