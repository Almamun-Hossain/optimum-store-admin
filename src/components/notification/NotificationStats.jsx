import React from "react";

const NotificationStats = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* By Type */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          By Type
        </h3>
        <div className="space-y-2">
          {stats.byType &&
            Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {type}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* By Status */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          By Status
        </h3>
        <div className="space-y-2">
          {stats.byStatus &&
            Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {status}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* By Template */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Top Templates
        </h3>
        <div className="space-y-2">
          {stats.byTemplate && stats.byTemplate.length > 0 ? (
            stats.byTemplate.slice(0, 5).map((item) => (
              <div
                key={item.template}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {item.template}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;

