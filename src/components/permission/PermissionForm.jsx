import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const permissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  module: z.string().min(1, "Module is required"),
  action: z.string().min(1, "Action is required"),
});

function PermissionForm({ permission, onSubmit, onClose, isLoading }) {
  const {
    register,
    handleSubmit,
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
          <input
            type="text"
            {...register("module")}
            placeholder="e.g., product"
            className={`form-input w-full ${errors.module ? "border-red-500" : ""}`}
          />
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
          <input
            type="text"
            {...register("action")}
            placeholder="e.g., create"
            className={`form-input w-full ${errors.action ? "border-red-500" : ""}`}
          />
          {errors.action && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.action.message}
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
