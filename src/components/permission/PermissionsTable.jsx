import React from "react";
import PermissionGuard from "../PermissionGuard";

/**
 * PermissionsTable - Displays permissions grouped by module
 * Table with equal-width columns that takes full width
 */
function PermissionsTable({
  permissionsByModule,
  onViewRoles,
  onEdit,
  onDelete,
  isDeleting,
}) {
  return (
    <div className="overflow-x-auto">
      {/* Grouped by Module View */}
      {Object.entries(permissionsByModule).map(([module, modulePermissions]) => {
        // Display "users" module as "Customers" in the frontend
        const displayModuleName =
          module === "users" ? "Customers" : module.replace(/_/g, " ");
        return (
          <div
            key={module}
            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                {displayModuleName} ({modulePermissions.length})
              </h3>
            </div>
            <table className="table-fixed w-full">
              <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Action</div>
                  </th>
                  <th className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Description</div>
                  </th>
                  <th className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Roles</div>
                  </th>
                  <th className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {modulePermissions.map((permission) => (
                  <tr
                    key={permission.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-800 dark:text-gray-100 font-medium font-mono text-xs truncate">
                        {permission.name}
                      </div>
                    </td>
                    <td className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {permission.action}
                      </span>
                    </td>
                    <td className="w-1/5 px-2 first:pl-5 last:pr-5 py-3">
                      <div className="text-gray-600 dark:text-gray-400 truncate">
                        {permission.description || "—"}
                      </div>
                    </td>
                    <td className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-800 dark:text-gray-100">
                        {permission._count?.roles || 0}
                      </div>
                    </td>
                    <td className="w-1/5 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewRoles(permission)}
                          className="btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                          title="View/Manage Roles"
                        >
                          Roles
                        </button>
                        <PermissionGuard permission="permissions.manage">
                          <button
                            onClick={() => onEdit(permission)}
                            className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(permission.id)}
                            className="btn-xs bg-red-500 hover:bg-red-600 text-white"
                            disabled={isDeleting}
                          >
                            Delete
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default PermissionsTable;
