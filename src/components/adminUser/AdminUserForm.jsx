import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const adminUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Full name must be 100 characters or less"),
  phone: z.string().regex(/^01[1-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

const AdminUserForm = ({ adminUser, onSubmit, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: adminUser
      ? {
          fullName: adminUser.fullName || "",
          phone: adminUser.phone || "",
          email: adminUser.email || "",
          isActive: adminUser.isActive !== undefined ? adminUser.isActive : true,
        }
      : {
          fullName: "",
          phone: "",
          email: "",
          isActive: true,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("fullName")}
          className={`form-input w-full ${errors.fullName ? "border-red-500" : ""}`}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("phone")}
          placeholder="01712345678"
          className={`form-input w-full ${errors.phone ? "border-red-500" : ""}`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={`form-input w-full ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {adminUser?.roles && adminUser.roles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {adminUser.roles.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
              >
                {role.name}
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Note: Role assignment is managed separately. Use the "Assign Role" button in the table.
          </p>
        </div>
      )}

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
            : adminUser
            ? "Update Admin User"
            : "Create Admin User"}
        </button>
      </div>
    </form>
  );
};

export default AdminUserForm;

