import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

function RoleForm({ role, onSubmit, onClose, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: role
      ? {
          name: role.name || "",
          description: role.description || "",
          isActive: role.isActive !== undefined ? role.isActive : true,
        }
      : {
          name: "",
          description: "",
          isActive: true,
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
          className={`form-input w-full ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
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

      <div className="flex items-center pt-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("isActive")}
            className="form-checkbox"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Active
          </span>
        </label>
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
            : role
            ? "Update Role"
            : "Create Role"}
        </button>
      </div>
    </form>
  );
}

export default RoleForm;
