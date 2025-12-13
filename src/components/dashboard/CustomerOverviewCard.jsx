import React from 'react';

/**
 * CustomerOverviewCard - Customer overview statistics card with gradient metric cards
 * @param {Object} customerOverview - Customer overview data object
 */
function CustomerOverviewCard({ customerOverview }) {
  if (!customerOverview) {
    return null;
  }

  const metrics = [
    {
      label: "Total Customers",
      value: customerOverview.totalCustomers || "0",
      color: "violet",
      icon: (
        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      label: "New Customers",
      value: customerOverview.newCustomers || "0",
      color: "emerald",
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
    {
      label: "Returning Customers",
      value: customerOverview.returningCustomers || "0",
      color: "blue",
      icon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      label: "Avg Customer Lifetime Value",
      value: `৳${customerOverview.avgCLV?.toFixed(2) || "0"}`,
      color: "amber",
      icon: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      violet: {
        gradient: "from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10",
        border: "border-violet-200 dark:border-violet-800/50",
        bg: "bg-violet-500/10 dark:bg-violet-500/20",
        text: "text-violet-600 dark:text-violet-400",
        value: "text-violet-900 dark:text-violet-100"
      },
      emerald: {
        gradient: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10",
        border: "border-emerald-200 dark:border-emerald-800/50",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        value: "text-emerald-900 dark:text-emerald-100"
      },
      blue: {
        gradient: "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10",
        border: "border-blue-200 dark:border-blue-800/50",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        value: "text-blue-900 dark:text-blue-100"
      },
      amber: {
        gradient: "from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10",
        border: "border-amber-200 dark:border-amber-800/50",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        value: "text-amber-900 dark:text-amber-100"
      }
    };
    return colors[color] || colors.violet;
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700/60 hover:shadow-md transition-shadow duration-200">
      <header className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Customer Overview
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const colorClasses = getColorClasses(metric.color);
          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg bg-gradient-to-br ${colorClasses.gradient} border ${colorClasses.border} hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                  {metric.icon}
                </div>
              </div>
              <div className={`text-xs font-medium ${colorClasses.text} mb-1 uppercase tracking-wide`}>
                {metric.label}
              </div>
              <div className={`text-2xl font-bold ${colorClasses.value}`}>
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomerOverviewCard;
