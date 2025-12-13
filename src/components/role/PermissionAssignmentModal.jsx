import React, { useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetPermissionsQuery,
  useGetRoleByIdQuery,
  useAssignPermissionsToRoleMutation,
} from "../../store/apis/rolesApi";
import GlobalModal from "../GlobalModal";

function PermissionAssignmentModal({ role, isOpen, onClose }) {
  const { data: permissionsResponse } = useGetPermissionsQuery({ limit: 1000 });
  const { data: roleData, isLoading: isLoadingRole } = useGetRoleByIdQuery(role?.id, {
    skip: !role?.id || !isOpen,
  });
  const [assignPermissions, { isLoading }] = useAssignPermissionsToRoleMutation();
  
  const [selectedPermissions, setSelectedPermissions] = React.useState([]);

  // Update selected permissions when role data is loaded
  React.useEffect(() => {
    if (isOpen && roleData?.role?.permissions) {
      // Extract permission IDs from the role's permissions array
      // The structure from API is: { permissionId: X, permission: { id: X, ... } }
      const permissionIds = roleData.role.permissions
        .map((p) => {
          // Priority: permission.id (from nested permission object) > permissionId (direct field)
          // Note: p.id is the junction table ID, not the permission ID
          return p.permission?.id || p.permissionId;
        })
        .filter((id) => id != null && id !== undefined); // Remove any null/undefined values
      
      setSelectedPermissions(permissionIds);
    } else if (isOpen && role?.permissions) {
      // Fallback to role.permissions if roleData is not available yet
      const permissionIds = role.permissions
        .map((p) => {
          return p.permission?.id || p.permissionId;
        })
        .filter((id) => id != null && id !== undefined);
      
      setSelectedPermissions(permissionIds);
    } else if (isOpen) {
      // If modal opens but no permissions data, start with empty array
      setSelectedPermissions([]);
    } else {
      // Reset when modal closes
      setSelectedPermissions([]);
    }
  }, [roleData, role, isOpen]);

  // Extract permissions from response - API returns { success: true, data: { permissions: [...] } }
  const permissions = permissionsResponse?.permissions || permissionsResponse?.data?.permissions || [];

  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignPermissions({
        id: role.id,
        permissionIds: selectedPermissions,
      }).unwrap();
      toast.success("Permissions assigned successfully");
      onClose();
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to assign permissions"
      );
    }
  };

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped = {};
    permissions.forEach((perm) => {
      const module = perm.module || "other";
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(perm);
    });
    return grouped;
  }, [permissions]);

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Permissions - ${role?.name}`}
      className="w-full max-w-4xl"
    >
      {isLoadingRole ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Loading role permissions...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(permissionsByModule).map(([module, perms]) => (
              <div key={module} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase">
                  {module}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {perms.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-3 p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          isChecked
                            ? "border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="form-checkbox mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {perm.action || perm.name}
                          </div>
                          {perm.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {perm.description}
                            </div>
                          )}
                          {perm.name && perm.name !== perm.action && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                              {perm.name}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-violet-500 hover:bg-violet-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Assigning..." : "Assign Permissions"}
            </button>
          </div>
        </form>
      )}
    </GlobalModal>
  );
}

export default PermissionAssignmentModal;
