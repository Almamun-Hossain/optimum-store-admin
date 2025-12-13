import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useGetPermissionByIdQuery,
  useGetRolesQuery,
  useAssignPermissionsToRoleMutation,
} from "../../store/apis/rolesApi";
import GlobalModal from "../GlobalModal";

function RolesForPermissionModal({ permission, isOpen, onClose }) {
  const token = useSelector((state) => state.auth.token);
  const { data: permissionData, isLoading: isLoadingPermission, refetch: refetchPermission } = useGetPermissionByIdQuery(permission?.id, {
    skip: !permission?.id || !isOpen,
  });
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery({ limit: 1000, isActive: true });
  const [assignPermissions, { isLoading }] = useAssignPermissionsToRoleMutation();
  const [loadingRoleId, setLoadingRoleId] = useState(null);

  const roles = rolesResponse?.roles || [];
  // API returns { permission: { roles: [...] } }, so access via permissionData.permission.roles
  const assignedRoles = permissionData?.permission?.roles || [];
  // Extract role IDs from the nested structure: { role: { id: X, ... } } or { roleId: X }
  const assignedRoleIds = new Set(
    assignedRoles
      .map((r) => {
        // Priority: role.id (from nested role object) > roleId (direct field) > r.id (junction table ID)
        return r.role?.id || r.roleId || r.id;
      })
      .filter((id) => id != null && id !== undefined)
  );

  const handleToggleRole = async (roleId) => {
    setLoadingRoleId(roleId);
    try {
      // Fetch the role to get its current permissions
      const roleResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      if (!roleResponse.success) {
        throw new Error(roleResponse.error || "Failed to fetch role");
      }

      // API response structure: { success: true, data: { role: { permissions: [...] } } }
      const role = roleResponse.data?.role || roleResponse.data;
      const rolePermissions = role?.permissions || [];
      // Extract permission IDs from the nested structure
      const currentPermissionIds = rolePermissions
        .map((p) => {
          // Priority: permission.id (from nested permission object) > permissionId (direct field)
          return p.permission?.id || p.permissionId;
        })
        .filter((id) => id != null && id !== undefined);
      
      const isCurrentlyAssigned = assignedRoleIds.has(roleId);
      let newPermissionIds;

      if (isCurrentlyAssigned) {
        // Remove this permission
        newPermissionIds = currentPermissionIds.filter((id) => id !== permission.id);
      } else {
        // Add this permission
        newPermissionIds = [...currentPermissionIds, permission.id];
      }

      await assignPermissions({
        id: roleId,
        permissionIds: newPermissionIds,
      }).unwrap();
      
      toast.success(
        isCurrentlyAssigned
          ? "Permission removed from role"
          : "Permission added to role"
      );
      refetchPermission();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to update role assignment"
      );
    } finally {
      setLoadingRoleId(null);
    }
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Roles with Permission: ${permission?.name}`}
      className="w-full max-w-3xl"
    >
      <div className="space-y-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and manage which roles have this permission assigned.
          </p>
        </div>

        {(isLoadingPermission || isLoadingRoles) ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Loading roles and permissions...
            </p>
          </div>
        ) : (
          <>
            {assignedRoles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Currently Assigned Roles ({assignedRoles.length})
                </h3>
                <div className="space-y-2">
                  {assignedRoles.map((roleAssignment) => {
                    const role = roleAssignment.role || roleAssignment;
                    return (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {role.name}
                          </h4>
                          {role.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Assigned
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                All Roles
              </h3>
              <div className="space-y-2">
                {roles.map((role) => {
                  const isAssigned = assignedRoleIds.has(role.id);
                  return (
                    <label
                      key={role.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isAssigned
                          ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => handleToggleRole(role.id)}
                          className="form-checkbox mr-3"
                          disabled={isLoading || loadingRoleId === role.id}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {role.name}
                          </h4>
                          {role.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          role.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {role.isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </GlobalModal>
  );
}

export default RolesForPermissionModal;
