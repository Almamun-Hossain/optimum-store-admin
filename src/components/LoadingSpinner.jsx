import React from 'react';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 rounded-full animate-spin border-t-violet-500 dark:border-t-violet-400"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-violet-500 dark:border-t-violet-400 opacity-20"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;

