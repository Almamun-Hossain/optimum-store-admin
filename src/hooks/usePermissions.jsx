import { useSelector } from "react-redux";

/**
 * Custom hook to check user permissions
 * 
 * @returns {Object} Permission checking utilities
 * 
 * @example
 * const { hasPermission, hasAnyPermission, hasAllPermissions, canAccessModule } = usePermissions();
 * 
 * // Check single permission
 * if (hasPermission('products.create')) {
 *   // Show create button
 * }
 * 
 * // Check multiple permissions (any)
 * if (hasAnyPermission(['products.create', 'products.update'])) {
 *   // Show edit button
 * }
 * 
 * // Check multiple permissions (all)
 * if (hasAllPermissions(['products.view', 'products.update'])) {
 *   // Show advanced features
 * }
 * 
 * // Check module access
 * if (canAccessModule('products')) {
 *   // Show products menu
 * }
 */
export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  // Get permissions from user role
  const permissions = user?.role?.permissions || [];
  
  // Create a Set for faster lookup
  const permissionSet = new Set(permissions.map(p => p.name || p));

  /**
   * Check if user has a specific permission
   * @param {string} permissionName - Permission name (e.g., 'products.create')
   * @returns {boolean}
   */
  const hasPermission = (permissionName) => {
    if (!permissionName) return false;
    return permissionSet.has(permissionName);
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissionNames - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionNames) => {
    if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
    return permissionNames.some(permission => hasPermission(permission));
  };

  /**
   * Check if user has all of the specified permissions
   * @param {string[]} permissionNames - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionNames) => {
    if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
    return permissionNames.every(permission => hasPermission(permission));
  };

  /**
   * Check if user can access a module (has any permission for that module)
   * @param {string} moduleName - Module name (e.g., 'products', 'orders')
   * @returns {boolean}
   */
  const canAccessModule = (moduleName) => {
    if (!moduleName) return false;
    return permissions.some(p => {
      const permName = p.name || p;
      return permName.startsWith(`${moduleName}.`);
    });
  };

  /**
   * Check if user can perform a specific action on a module
   * @param {string} moduleName - Module name (e.g., 'products')
   * @param {string} action - Action name (e.g., 'create', 'update', 'delete')
   * @returns {boolean}
   */
  const canPerformAction = (moduleName, action) => {
    if (!moduleName || !action) return false;
    return hasPermission(`${moduleName}.${action}`);
  };

  /**
   * Get all permissions for a specific module
   * @param {string} moduleName - Module name
   * @returns {Array} Array of permission objects
   */
  const getModulePermissions = (moduleName) => {
    if (!moduleName) return [];
    return permissions.filter(p => {
      const permName = p.name || p;
      return permName.startsWith(`${moduleName}.`);
    });
  };

  /**
   * Get user role information
   * @returns {Object|null} Role object or null
   */
  const getUserRole = () => {
    return user?.role || null;
  };

  /**
   * Check if user has a specific role
   * @param {string} roleName - Role name (e.g., 'Super Admin')
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    if (!roleName) return false;
    return user?.role?.name === roleName;
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
    canPerformAction,
    getModulePermissions,
    getUserRole,
    hasRole,
    isAuthenticated: !!user,
  };
};

export default usePermissions;

