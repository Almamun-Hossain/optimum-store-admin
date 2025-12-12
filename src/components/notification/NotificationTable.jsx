import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const NotificationTable = ({
  logs,
  onView,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No notification logs found</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      sent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || statusColors.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          type === "email"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
        }`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sent At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {log.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.user?.fullName || log.userId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(log.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.template || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.recipient || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(log.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.sentAt
                    ? new Date(log.sentAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(log)}
                        className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                        title="View Details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(log)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(log.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationTable;

