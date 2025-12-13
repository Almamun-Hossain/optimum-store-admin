import React from 'react';

/**
 * ChartCard - Reusable wrapper component for chart cards
 * @param {string} title - Chart title
 * @param {ReactNode} children - Chart component to render
 * @param {boolean} isLoading - Loading state
 * @param {string} colSpan - Tailwind grid column span classes (e.g., "col-span-full lg:col-span-8")
 */
function ChartCard({ title, children, isLoading = false, colSpan = "col-span-full" }) {
  return (
    <div className={`flex flex-col ${colSpan} bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5`}>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
      </header>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default ChartCard;
