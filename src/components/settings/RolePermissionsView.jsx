import React from "react";
import { useGetRoleByIdQuery } from "../../store/apis/rolesApi";

function RolePermissionsView({ profile }) {
  // Handle both singular role and plural roles array
  const roles = profile?.roles || (profile?.role ? [profile.role] : []);
  const primaryRole = roles[0];
  const roleId = primaryRole?.id;

  // Fetch full role details with permissions if we have a role ID
  // Only fetch if we don't already have permissions in the role
  const needsFetch = roleId && (!primaryRole?.permissions || primaryRole.permissions.length === 0);
  const { data: roleData, isLoading: isLoadingRole } = useGetRoleByIdQuery(roleId, {
    skip: !needsFetch,
  });

  // Use fetched role data if available, otherwise use the profile role
  const role = roleData || primaryRole;
  // Extract permissions - handle nested structure (permission.permission) or direct
  const rawPermissions = role?.permissions || [];
  const permissions = rawPermissions.map((p) => p.permission || p);

  if (!role && !isLoadingRole) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No role information available</p>
      </div>
    );
  }

  if (isLoadingRole) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Loading role permissions...
        </p>
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

  // Sort modules alphabetically, but treat "users" as "customers" for sorting
  const sortedModules = Object.keys(permissionsByModule).sort((a, b) => {
    const aName = a === "users" ? "customers" : a;
    const bName = b === "users" ? "customers" : b;
    return aName.localeCompare(bName);
  });

  return (
    <div className="space-y-6">
      {/* Role Information */}
      {roles.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {roles.length > 1 ? "Roles Information" : "Role Information"}
              </h3>
              <div className="space-y-2">
                {roles.map((r, idx) => (
                  <div key={r.id || idx} className={idx > 0 ? "pt-2 border-t border-violet-200 dark:border-violet-800" : ""}>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Role Name:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                        {r.name}
                      </span>
                    </div>
                    {r.description && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Description:
                        </span>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {r.description}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
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
      )}

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
                  {module === "users" ? "Customers" : module.replace(/_/g, " ")}
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

