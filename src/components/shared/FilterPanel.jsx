import React, { useState, useMemo } from "react";

/**
 * FilterPanel - A flexible and interactive filter component
 * 
 * Supports multiple field types: boolean, checkbox, select, multiSelect, checkboxGroup, number, text
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filters change (receives new filters object)
 * @param {Function} onClearFilters - Callback to clear all filters (receives cleared filters object)
 * @param {Array} filterConfig - Configuration array defining filter fields
 * @param {String} title - Panel title (default: "Filters")
 * @param {Boolean} defaultOpen - Whether panel should be open by default (default: false)
 * 
 * @example
 * const filterConfig = [
 *   {
 *     key: "isActive",
 *     type: "boolean", // Shows dropdown with All/Yes/No
 *     label: "Active Status",
 *   },
 *   {
 *     key: "status",
 *     type: "select", // Dropdown with options
 *     label: "Status",
 *     options: ["Active", "Inactive", "Pending"],
 *   },
 *   {
 *     key: "categories",
 *     type: "multiSelect", // Multiple checkboxes in scrollable area
 *     label: "Categories",
 *     options: [
 *       { value: "cat1", label: "Category 1" },
 *       { value: "cat2", label: "Category 2" },
 *     ],
 *   },
 *   {
 *     key: "age",
 *     type: "number", // Number input
 *     label: "Age",
 *     min: 0,
 *     max: 150,
 *   },
 * ];
 */
const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  filterConfig = [],
  title = "Filters",
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    const clearedFilters = {};
    filterConfig.forEach((config) => {
      if (config.type === 'multiSelect' || config.type === 'checkboxGroup') {
        clearedFilters[config.key] = [];
      } else if (config.type === 'boolean' || config.type === 'checkbox') {
        clearedFilters[config.key] = "";
      } else {
        clearedFilters[config.key] = "";
      }
    });
    onClearFilters(clearedFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return filterConfig.some((config) => {
      const value = filters[config.key];
      if (config.type === 'multiSelect' || config.type === 'checkboxGroup') {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== "" && value !== null && value !== undefined;
    });
  }, [filters, filterConfig]);

  const activeFilterCount = useMemo(() => {
    return filterConfig.filter((config) => {
      const value = filters[config.key];
      if (config.type === 'multiSelect' || config.type === 'checkboxGroup') {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== "" && value !== null && value !== undefined;
    }).length;
  }, [filters, filterConfig]);

  const renderFilterField = (config) => {
    const { key, type, label, placeholder, options = [], min, max, step } = config;
    const value = filters[key] || (type === 'multiSelect' || type === 'checkboxGroup' ? [] : "");

    switch (type) {
      case 'boolean':
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <select
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="form-select w-full"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={value === "true" || value === true}
              onChange={(e) => handleFilterChange(key, e.target.checked ? "true" : "")}
              className="form-checkbox w-4 h-4 text-violet-500 rounded focus:ring-violet-500"
            />
            <label htmlFor={key} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
          </div>
        );

      case 'select':
      case 'dropdown':
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <select
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="form-select w-full"
            >
              <option value="">All</option>
              {options.map((option) => {
                if (typeof option === 'object') {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                }
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'multiSelect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
              {options.map((option) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                const isChecked = selectedValues.includes(optionValue);
                
                return (
                  <label key={optionValue} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, optionValue]
                          : selectedValues.filter((v) => v !== optionValue);
                        handleFilterChange(key, newValues);
                      }}
                      className="form-checkbox w-4 h-4 text-violet-500 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{optionLabel}</span>
                  </label>
                );
              })}
            </div>
            {selectedValues.length > 0 && (
              <button
                onClick={() => handleFilterChange(key, [])}
                className="mt-2 text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400"
              >
                Clear selection
              </button>
            )}
          </div>
        );

      case 'checkboxGroup':
        const groupValues = Array.isArray(value) ? value : [];
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <div className="space-y-2">
              {options.map((option) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                const isChecked = groupValues.includes(optionValue);
                
                return (
                  <label key={optionValue} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...groupValues, optionValue]
                          : groupValues.filter((v) => v !== optionValue);
                        handleFilterChange(key, newValues);
                      }}
                      className="form-checkbox w-4 h-4 text-violet-500 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{optionLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'number':
      case 'range':
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              placeholder={placeholder || `Enter ${label || key}`}
              min={min}
              max={max}
              step={step || 1}
              className="form-input w-full"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              placeholder={placeholder || `Filter by ${label || key}`}
              className="form-input w-full"
            />
          </div>
        );
    }
  };

  // If no config provided, fallback to old behavior (backward compatibility)
  if (filterConfig.length === 0) {
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No filter configuration provided. Please provide filterConfig prop.
            </p>
          </div>
        )}
      </div>
    );
  }

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
              {activeFilterCount}
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
            {filterConfig.map((config) => renderFilterField(config))}
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
