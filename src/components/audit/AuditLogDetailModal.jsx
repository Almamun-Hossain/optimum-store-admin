import React from "react";

/**
 * AuditLogDetailModal - Displays detailed information about an audit log entry
 * Mobile responsive and scrollable for long content
 */
function AuditLogDetailModal({ logDetail, isLoading }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadge = (action) => {
    const actionColors = {
      create: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      update: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      delete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      move: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      assign_permissions: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      assign_role: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      verify_payment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      refund_payment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      adjust_inventory: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
      update_order_status: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          actionColors[action] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        {action?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || action}
      </span>
    );
  };

  const getEntityTypeBadge = (entityType) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
        {entityType?.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) || entityType}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading log details...</p>
        </div>
      </div>
    );
  }

  if (!logDetail) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No log details available</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                #{logDetail.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Admin User
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {logDetail.adminUser?.fullName || logDetail.adminUser?.email || "Unknown"}
                {logDetail.adminUser?.email && logDetail.adminUser?.fullName && (
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {logDetail.adminUser.email}
                  </span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action
              </label>
              <div className="mt-1">
                {getActionBadge(logDetail.action)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity Type
              </label>
              <div className="mt-1">
                {getEntityTypeBadge(logDetail.entityType)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity ID
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {logDetail.entityId || "-"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {formatDate(logDetail.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Network Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Network Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IP Address
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {logDetail.ipAddress || "-"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User Agent
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 break-all font-mono bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                {logDetail.userAgent || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Change Details Section */}
        {(logDetail.oldValues || logDetail.newValues) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Change Details
            </h3>
            <div className="space-y-4">
              {logDetail.oldValues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Old Values
                    </span>
                  </label>
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 overflow-auto">
                    <pre className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-mono">
                      {JSON.stringify(logDetail.oldValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {logDetail.newValues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      New Values
                    </span>
                  </label>
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 overflow-auto">
                    <pre className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-mono">
                      {JSON.stringify(logDetail.newValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {logDetail.metadata && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Additional Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto">
              <pre className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-mono">
                {JSON.stringify(logDetail.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogDetailModal;
