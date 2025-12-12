import React, { useState } from "react";

const FilterPanel = ({ filters, onFilterChange, onClearFilters, title = "Filters" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach((key) => {
      clearedFilters[key] = "";
    });
    onClearFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null && value !== undefined
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {title}
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-violet-500 rounded-full">
              {Object.values(filters).filter(
                (v) => v !== "" && v !== null && v !== undefined
              ).length}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  value={value || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  placeholder={`Filter by ${key}`}
                  className="form-input w-full"
                />
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearAll}
                className="btn btn-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

