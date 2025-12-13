import React from "react";
import { FaEnvelope, FaSms, FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt } from "react-icons/fa";

const NotificationStats = ({ stats, isLoading }) => {
  // Get total count for percentage calculations
  const getTotalCount = (data) => {
    if (!data) return 0;
    if (Array.isArray(data)) {
      return data.reduce((sum, item) => sum + (item.count || 0), 0);
    }
    return Object.values(data).reduce((sum, count) => sum + (count || 0), 0);
  };

  // Get type icon and color
  const getTypeConfig = (type) => {
    const configs = {
      email: {
        icon: FaEnvelope,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        gradient: "from-blue-500 to-blue-600",
      },
      sms: {
        icon: FaSms,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        gradient: "from-green-500 to-green-600",
      },
      push: {
        icon: FaFileAlt,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        gradient: "from-purple-500 to-purple-600",
      },
    };
    return configs[type.toLowerCase()] || {
      icon: FaFileAlt,
      color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      gradient: "from-gray-500 to-gray-600",
    };
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    const configs = {
      sent: {
        icon: FaCheckCircle,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/10",
        borderColor: "border-green-200 dark:border-green-800",
      },
      failed: {
        icon: FaTimesCircle,
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        borderColor: "border-red-200 dark:border-red-800",
      },
      pending: {
        icon: FaClock,
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      },
      delivered: {
        icon: FaCheckCircle,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
    };
    return configs[status.toLowerCase()] || {
      icon: FaClock,
      color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/10",
      borderColor: "border-gray-200 dark:border-gray-700",
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 animate-pulse border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const totalByType = getTotalCount(stats.byType);
  const totalByStatus = getTotalCount(stats.byStatus);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* By Type */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl opacity-20 blur"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
              <FaEnvelope className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              By Type
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Notification types
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {stats.byType &&
            Object.entries(stats.byType).map(([type, count]) => {
              const config = getTypeConfig(type);
              const Icon = config.icon;
              const percentage = totalByType > 0 ? ((count / totalByType) * 100).toFixed(1) : 0;
              
              return (
                <div
                  key={type}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`${config.color} rounded-lg p-2`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {type}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {count}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${config.gradient} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* By Status */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-xl opacity-20 blur"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              By Status
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Delivery status
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {stats.byStatus &&
            Object.entries(stats.byStatus).map(([status, count]) => {
              const config = getStatusConfig(status);
              const Icon = config.icon;
              const percentage = totalByStatus > 0 ? ((count / totalByStatus) * 100).toFixed(1) : 0;
              
              return (
                <div
                  key={status}
                  className={`group relative overflow-hidden rounded-lg border ${config.borderColor} ${config.bgColor} hover:shadow-md transition-all duration-200`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`${config.color} rounded-lg p-2`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {status}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {count}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${config.color.replace('bg-', 'bg-').replace('text-', '')} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* By Template */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl opacity-20 blur"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
              <FaFileAlt className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Top Templates
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Most used templates
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {stats.byTemplate && stats.byTemplate.length > 0 ? (
            stats.byTemplate.slice(0, 5).map((item, index) => {
              const maxCount = stats.byTemplate[0]?.count || 1;
              const percentage = ((item.count / maxCount) * 100).toFixed(1);
              
              return (
                <div
                  key={item.template}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.template}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FaFileAlt className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No template data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;

