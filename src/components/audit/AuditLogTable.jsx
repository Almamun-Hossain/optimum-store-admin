import React from "react";
import { FiEye } from "react-icons/fi";
import EmptyState from "../shared/EmptyState";

const AuditLogTable = ({
  logs,
  onView,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading audit logs...</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No audit logs found"
        message="No audit logs match your current filters. Try adjusting your search or filters."
      />
    );
  }

  const getActionBadge = (action) => {
    const actionColors = {
      create: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      update: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      delete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      move: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      assign_permissions: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      assign_role: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      verify_payment: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      refund_payment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      adjust_inventory: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          actionColors[action] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        }`}
      >
        {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  const getEntityTypeBadge = (entityType) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
        {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                Admin User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entity Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entity ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{log.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.adminUser?.fullName || log.adminUser?.email || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getActionBadge(log.action)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEntityTypeBadge(log.entityType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.entityId || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {log.ipAddress || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onView(log)}
                    className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
