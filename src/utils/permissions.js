/**
 * Permission Utility Functions
 * 
 * These utilities help check user permissions throughout the application.
 * Permissions are stored in the Redux auth state after login.
 * 
 * Permission format: "module.action" (e.g., "products.create", "orders.view")
 * 
 * IMPORTANT: The "users" module in permissions is displayed as "Customers" 
 * in the frontend UI for better user experience. All permission checks should
 * use "users" as the module name (e.g., "users.view", "users.create").
 */

/**
 * Get permissions from Redux state
 * @param {Object} state - Redux state
 * @returns {Array} Array of permission objects
 */
export const getPermissions = (state) => {
  return state?.auth?.user?.role?.permissions || [];
};

/**
 * Get permission names as an array
 * @param {Object} state - Redux state
 * @returns {Array<string>} Array of permission names
 */
export const getPermissionNames = (state) => {
  const permissions = getPermissions(state);
  return permissions.map(p => p.name || p);
};

/**
 * Check if user has a specific permission
 * @param {Object} state - Redux state
 * @param {string} permissionName - Permission name (e.g., 'products.create')
 * @returns {boolean}
 */
export const hasPermission = (state, permissionName) => {
  if (!permissionName) return false;
  const permissionNames = getPermissionNames(state);
  return permissionNames.includes(permissionName);
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} state - Redux state
 * @param {string[]} permissionNames - Array of permission names
 * @returns {boolean}
 */
export const hasAnyPermission = (state, permissionNames) => {
  if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
  const userPermissions = getPermissionNames(state);
  return permissionNames.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} state - Redux state
 * @param {string[]} permissionNames - Array of permission names
 * @returns {boolean}
 */
export const hasAllPermissions = (state, permissionNames) => {
  if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
  const userPermissions = getPermissionNames(state);
  return permissionNames.every(permission => userPermissions.includes(permission));
};

/**
 * Check if user can access a module
 * @param {Object} state - Redux state
 * @param {string} moduleName - Module name (e.g., 'products', 'orders')
 * @returns {boolean}
 */
export const canAccessModule = (state, moduleName) => {
  if (!moduleName) return false;
  const permissions = getPermissions(state);
  return permissions.some(p => {
    const permName = p.name || p;
    return permName.startsWith(`${moduleName}.`);
  });
};

/**
 * Get user role
 * @param {Object} state - Redux state
 * @returns {Object|null} Role object or null
 */
export const getUserRole = (state) => {
  return state?.auth?.user?.role || null;
};

/**
 * Check if user has a specific role
 * @param {Object} state - Redux state
 * @param {string} roleName - Role name (e.g., 'Super Admin')
 * @returns {boolean}
 */
export const hasRole = (state, roleName) => {
  if (!roleName) return false;
  const role = getUserRole(state);
  return role?.name === roleName;
};

/**
 * Get all available modules from permissions
 * @param {Object} state - Redux state
 * @returns {Array<string>} Array of unique module names
 */
export const getAvailableModules = (state) => {
  const permissions = getPermissions(state);
  const modules = new Set();
  permissions.forEach((p) => {
    const permName = p.name || p;
    const parts = permName.split(".");
    if (parts.length > 0) {
      modules.add(parts[0]);
    }
  });
  return Array.from(modules).sort();
};

/**
 * Get all permissions for a specific module
 * @param {Object} state - Redux state
 * @param {string} moduleName - Module name (e.g., 'products')
 * @returns {Array} Array of permission objects for the module
 */
export const getModulePermissions = (state, moduleName) => {
  if (!moduleName) return [];
  const permissions = getPermissions(state);
  return permissions.filter((p) => {
    const permName = p.name || p;
    return permName.startsWith(`${moduleName}.`);
  });
};

/**
 * Get all available actions for a module
 * @param {Object} state - Redux state
 * @param {string} moduleName - Module name (e.g., 'products')
 * @returns {Array<string>} Array of action names
 */
export const getModuleActions = (state, moduleName) => {
  const modulePermissions = getModulePermissions(state, moduleName);
  const actions = new Set();
  modulePermissions.forEach((p) => {
    const permName = p.name || p;
    const parts = permName.split(".");
    if (parts.length > 1) {
      actions.add(parts[1]);
    }
  });
  return Array.from(actions).sort();
};

