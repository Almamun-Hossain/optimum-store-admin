import React from 'react';

/**
 * DashboardAlert - Alert banner component for dashboard
 * @param {Array} alerts - Array of alert objects with {severity, message}
 */
function DashboardAlert({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertStyles = (severity) => {
    switch (severity) {
      case "high":
        return {
          container: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-300"
        };
      case "medium":
        return {
          container: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-800 dark:text-yellow-300"
        };
      default:
        return {
          container: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-300"
        };
    }
  };

  return (
    <div className="mb-6 space-y-2">
      {alerts.map((alert, index) => {
        const styles = getAlertStyles(alert.severity);
        return (
          <div
            key={index}
            className={`p-4 rounded-lg ${styles.container}`}
          >
            <p className={`text-sm font-medium ${styles.text}`}>
              {alert.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardAlert;
