import React from "react";

function RolePermissionsView({ profile }) {
  const role = profile?.role;
  const permissions = role?.permissions || [];

  if (!role) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No role information available</p>
      </div>
    );
  }

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    const module = permission.module || "other";
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  // Sort modules alphabetically
  const sortedModules = Object.keys(permissionsByModule).sort();

  return (
    <div className="space-y-6">
      {/* Role Information */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Role Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Role Name:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                  {role.name}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Description:
                </span>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {role.description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    role.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}
                >
                  {role.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {permissions.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Permissions
            </div>
          </div>
        </div>
      </div>

      {/* Permissions by Module */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Permissions
        </h3>
        <div className="space-y-4">
          {sortedModules.map((module) => (
            <div
              key={module}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {module.replace("_", " ")}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {permissionsByModule[module].length} permission
                  {permissionsByModule[module].length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissionsByModule[module].map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-violet-500 dark:bg-violet-400"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {permission.name}
                        </div>
                        {permission.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {permission.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                            {permission.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {permissions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No permissions assigned to this role
          </p>
        </div>
      )}
    </div>
  );
}

export default RolePermissionsView;

