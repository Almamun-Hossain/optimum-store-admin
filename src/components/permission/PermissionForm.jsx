import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const permissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  module: z.string().min(1, "Module is required"),
  action: z.string().min(1, "Action is required"),
});

// Available modules
const availableModules = [
  { value: "admin_users", label: "Admin Users" },
  { value: "audit_logs", label: "Audit Logs" },
  { value: "categories", label: "Categories" },
  { value: "dashboard", label: "Dashboard" },
  { value: "inventory", label: "Inventory" },
  { value: "notifications", label: "Notifications" },
  { value: "orders", label: "Orders" },
  { value: "payments", label: "Payments" },
  { value: "permissions", label: "Permissions" },
  { value: "preorders", label: "Preorders" },
  { value: "products", label: "Products" },
  { value: "reports", label: "Reports" },
  { value: "roles", label: "Roles" },
  { value: "settings", label: "Settings" },
  { value: "shipping", label: "Shipping" },
  { value: "users", label: "Customers" }, // "users" module displayed as "Customers"
];

// Standard actions available for most modules
const standardActions = [
  { value: "view", label: "View" },
  { value: "view_all", label: "View All" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "manage", label: "Manage" },
];

// Module-specific actions
const moduleSpecificActions = {
  admin_users: [
    ...standardActions.filter((a) => a.value !== "view_all"),
    { value: "manage_roles", label: "Manage Roles" },
  ],
  audit_logs: [
    { value: "view", label: "View" },
    { value: "view_all", label: "View All" },
  ],
  categories: [
    ...standardActions.filter((a) => a.value !== "view_all"),
    { value: "move", label: "Move" },
  ],
  dashboard: [{ value: "view", label: "View" }],
  inventory: [
    { value: "view", label: "View" },
    { value: "update", label: "Update" },
    { value: "manage_stock", label: "Manage Stock" },
    { value: "manage_preorders", label: "Manage Preorders" },
  ],
  notifications: [
    { value: "view", label: "View" },
    { value: "send", label: "Send" },
  ],
  orders: [
    { value: "view", label: "View" },
    { value: "view_all", label: "View All" },
    { value: "update_status", label: "Update Status" },
    { value: "cancel", label: "Cancel" },
    { value: "refund", label: "Refund" },
    { value: "export", label: "Export" },
  ],
  payments: [
    { value: "view", label: "View" },
    { value: "view_all", label: "View All" },
    { value: "verify", label: "Verify" },
    { value: "refund", label: "Refund" },
  ],
  permissions: [
    { value: "view", label: "View" },
    { value: "manage", label: "Manage" },
  ],
  preorders: standardActions.filter((a) => a.value !== "view_all"),
  products: [
    ...standardActions.filter((a) => a.value !== "view_all"),
    { value: "manage_variants", label: "Manage Variants" },
    { value: "manage_images", label: "Manage Images" },
  ],
  reports: [
    { value: "view", label: "View" },
    { value: "sales", label: "Sales" },
    { value: "products", label: "Products" },
    { value: "customers", label: "Customers" },
    { value: "export", label: "Export" },
  ],
  roles: [
    ...standardActions.filter((a) => a.value !== "view_all"),
    { value: "manage_permissions", label: "Manage Permissions" },
  ],
  settings: [
    { value: "view", label: "View" },
    { value: "update", label: "Update" },
    { value: "manage_payment_gateways", label: "Manage Payment Gateways" },
  ],
  shipping: standardActions.filter((a) => a.value !== "view_all"),
  users: [
    ...standardActions.filter((a) => a.value !== "view_all"),
    { value: "manage_addresses", label: "Manage Addresses" },
  ],
};

function PermissionForm({ permission, onSubmit, onClose, isLoading }) {
  const [selectedModule, setSelectedModule] = useState(
    permission?.module || ""
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: permission
      ? {
          name: permission.name || "",
          description: permission.description || "",
          module: permission.module || "",
          action: permission.action || "",
        }
      : {
          name: "",
          description: "",
          module: "",
          action: "",
        },
  });

  // Watch module and action changes
  const watchedModule = watch("module");
  const watchedAction = watch("action");

  useEffect(() => {
    setSelectedModule(watchedModule || "");
    // Reset action when module changes (only when creating new permission)
    if (watchedModule && !permission) {
      setValue("action", "");
    }
  }, [watchedModule, setValue, permission]);

  // Get available actions for selected module
  const availableActions =
    selectedModule && moduleSpecificActions[selectedModule]
      ? moduleSpecificActions[selectedModule]
      : selectedModule
      ? standardActions
      : [];

  // Auto-generate name when module or action changes (only when creating new permission)
  useEffect(() => {
    if (watchedModule && watchedAction && !permission) {
      setValue("name", `${watchedModule}.${watchedAction}`);
    }
  }, [watchedModule, watchedAction, setValue, permission]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g., product:create"
          className={`form-input w-full ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Module <span className="text-red-500">*</span>
          </label>
          <select
            {...register("module")}
            className={`form-select w-full ${errors.module ? "border-red-500" : ""}`}
            disabled={!!permission} // Disable module selection when editing
          >
            <option value="">Select a module</option>
            {availableModules.map((module) => (
              <option key={module.value} value={module.value}>
                {module.label}
              </option>
            ))}
          </select>
          {errors.module && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.module.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action <span className="text-red-500">*</span>
          </label>
          <select
            {...register("action")}
            className={`form-select w-full ${errors.action ? "border-red-500" : ""}`}
            disabled={!selectedModule} // Disable if no module selected
          >
            <option value="">
              {selectedModule ? "Select an action" : "Select module first"}
            </option>
            {availableActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
          {errors.action && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.action.message}
            </p>
          )}
          {selectedModule && availableActions.length === 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              No actions available for this module
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className={`form-textarea w-full ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
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
          {isLoading
            ? "Saving..."
            : permission
            ? "Update Permission"
            : "Create Permission"}
        </button>
      </div>
    </form>
  );
}

export default PermissionForm;
