import React from "react";
import { usePermissions } from "../hooks/usePermissions";

/**
 * PermissionGuard - Component to conditionally render content based on permissions
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - Single permission or array of permissions
 * @param {boolean} props.requireAll - If true, requires all permissions (default: false - any permission)
 * @param {string} props.module - Module name for module-level access check
 * @param {string} props.action - Action name for action-level check (requires module)
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {React.ReactNode} props.fallback - Content to render if permission check fails (optional)
 * 
 * @example
 * // Check single permission
 * <PermissionGuard permission="products.create">
 *   <button>Create Product</button>
 * </PermissionGuard>
 * 
 * // Check any of multiple permissions
 * <PermissionGuard permission={['products.create', 'products.update']}>
 *   <button>Edit Product</button>
 * </PermissionGuard>
 * 
 * // Check all permissions
 * <PermissionGuard permission={['products.view', 'products.update']} requireAll>
 *   <button>Advanced Edit</button>
 * </PermissionGuard>
 * 
 * // Check module access
 * <PermissionGuard module="products">
 *   <ProductsPage />
 * </PermissionGuard>
 * 
 * // Check specific action
 * <PermissionGuard module="products" action="delete">
 *   <button>Delete</button>
 * </PermissionGuard>
 * 
 * // With fallback
 * <PermissionGuard permission="products.create" fallback={<p>No access</p>}>
 *   <button>Create</button>
 * </PermissionGuard>
 */
function PermissionGuard({
  permission,
  requireAll = false,
  module,
  action,
  children,
  fallback = null,
}) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
    canPerformAction,
  } = usePermissions();

  let hasAccess = false;

  // Check module and action
  if (module && action) {
    hasAccess = canPerformAction(module, action);
  }
  // Check module access
  else if (module) {
    hasAccess = canAccessModule(module);
  }
  // Check permission(s)
  else if (permission) {
    if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission);
    } else {
      hasAccess = hasPermission(permission);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGuard;

