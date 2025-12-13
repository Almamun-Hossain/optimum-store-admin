import React from 'react';
import { 
  FaBoxOpen, 
  FaUsers, 
  FaShoppingCart, 
  FaFolderOpen, 
  FaShieldAlt, 
  FaCreditCard,
  FaTruck,
  FaBell,
  FaFileAlt,
  FaWarehouse,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

/**
 * EmptyState - A reusable, elegant empty state component
 * 
 * @param {string} title - Main title text
 * @param {string} message - Description message
 * @param {string} icon - Icon name (box, users, cart, folder, shield, card, truck, bell, file, warehouse) or custom React element
 * @param {React.ReactNode} action - Optional action button/element
 * @param {boolean} hasFilters - Whether filters are currently applied
 * @param {Function} onClearFilters - Callback to clear filters
 * @param {string} searchTerm - Current search term (optional)
 * @param {Function} onClearSearch - Callback to clear search (optional)
 * @param {string} className - Additional CSS classes
 */
function EmptyState({ 
  title,
  message,
  icon = 'box',
  action,
  hasFilters = false,
  onClearFilters,
  searchTerm,
  onClearSearch,
  className = ''
}) {
  const iconMap = {
    box: FaBoxOpen,
    users: FaUsers,
    cart: FaShoppingCart,
    folder: FaFolderOpen,
    shield: FaShieldAlt,
    card: FaCreditCard,
    truck: FaTruck,
    bell: FaBell,
    file: FaFileAlt,
    warehouse: FaWarehouse,
    search: FaSearch,
  };

  const IconComponent = typeof icon === 'string' ? iconMap[icon] || iconMap.box : icon;
  const isCustomIcon = typeof icon !== 'string';

  // Determine title and message based on filters/search
  const displayTitle = title || (hasFilters || searchTerm 
    ? 'No results found' 
    : 'No data found');
  
  const displayMessage = message || (hasFilters 
    ? 'Try adjusting your filters to find what you\'re looking for.'
    : searchTerm
    ? `No results match your search "${searchTerm}". Try a different search term.`
    : 'Get started by adding your first item.');

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 md:p-16 ${className}`}>
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/30 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-violet-50 dark:bg-violet-900/20 rounded-full p-6">
              {isCustomIcon ? (
                <div className="h-12 w-12 text-violet-500 dark:text-violet-400 flex items-center justify-center">
                  {icon}
                </div>
              ) : (
                <IconComponent className="h-12 w-12 text-violet-500 dark:text-violet-400" />
              )}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {displayTitle}
        </h3>
        
        {/* Message */}
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {displayMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
            >
              <FaFilter className="h-4 w-4" />
              Clear Filters
            </button>
          )}
          
          {searchTerm && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaSearch className="h-4 w-4" />
              Clear Search
            </button>
          )}

          {action && (
            <div className={hasFilters || searchTerm ? '' : 'mt-2'}>
              {action}
            </div>
          )}
        </div>

        {/* Helpful Tips */}
        {(hasFilters || searchTerm) && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <FaSearch className="h-4 w-4" />
              <span>Try different search terms</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-2">
              <FaFilter className="h-4 w-4" />
              <span>Adjust your filters</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
