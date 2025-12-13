import React from 'react';

/**
 * OrderStatusCard - Order status counts card with color-coded status items
 * @param {Object} orderStatusCounts - Order status counts data object
 */
function OrderStatusCard({ orderStatusCounts }) {
  if (!orderStatusCounts) {
    return null;
  }

  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('waiting')) {
      return {
        color: 'amber',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-700 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    } else if (statusLower.includes('processing') || statusLower.includes('confirmed')) {
      return {
        color: 'blue',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      };
    } else if (statusLower.includes('completed') || statusLower.includes('delivered')) {
      return {
        color: 'emerald',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    } else if (statusLower.includes('cancelled') || statusLower.includes('canceled')) {
      return {
        color: 'red',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    } else if (statusLower.includes('shipped')) {
      return {
        color: 'violet',
        bgColor: 'bg-violet-50 dark:bg-violet-900/20',
        textColor: 'text-violet-700 dark:text-violet-400',
        borderColor: 'border-violet-200 dark:border-violet-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        )
      };
    }
    return {
      color: 'gray',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      textColor: 'text-gray-700 dark:text-gray-400',
      borderColor: 'border-gray-200 dark:border-gray-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
  };

  return (
    <div className="flex flex-col col-span-full lg:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700/60 hover:shadow-md transition-shadow duration-200">
      <header className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Order Status
        </h2>
      </header>
      <div className="space-y-3">
        {Object.entries(orderStatusCounts.statusCounts || {}).map(([status, count]) => {
          const config = getStatusConfig(status);
          return (
            <div
              key={status}
              className={`flex items-center justify-between p-3 rounded-lg border ${config.bgColor} ${config.borderColor} hover:shadow-sm transition-all duration-200 group`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-md ${config.bgColor} ${config.textColor}`}>
                  {config.icon}
                </div>
                <span className={`text-sm font-medium capitalize ${config.textColor}`}>
                  {status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${config.textColor}`}>
                  {count}
                </span>
                <div className={`w-2 h-2 rounded-full ${config.bgColor.replace('50', '500').replace('900/20', '500')}`}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusCard;
