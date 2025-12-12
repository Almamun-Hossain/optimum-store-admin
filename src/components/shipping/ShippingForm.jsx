import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseCost: z.number().min(0, "Base cost must be 0 or greater"),
  costPerKg: z.number().min(0, "Cost per kg must be 0 or greater"),
  estimatedDays: z.string().min(1, "Estimated days is required"),
  isActive: z.boolean().optional(),
  availableInCities: z.string().optional(),
  sortOrder: z.number().optional(),
});

const ShippingForm = ({ shippingMethod, onSubmit, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingMethod
      ? {
          ...shippingMethod,
          baseCost: shippingMethod.baseCost || 0,
          costPerKg: shippingMethod.costPerKg || 0,
          sortOrder: shippingMethod.sortOrder || 0,
        }
      : {
          name: "",
          description: "",
          baseCost: 0,
          costPerKg: 0,
          estimatedDays: "",
          isActive: true,
          availableInCities: "[]",
          sortOrder: 0,
        },
  });

  const isActive = watch("isActive");

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
          className="form-textarea w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Base Cost (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("baseCost", { valueAsNumber: true })}
            className={`form-input w-full ${errors.baseCost ? "border-red-500" : ""}`}
          />
          {errors.baseCost && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.baseCost.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cost Per Kg (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("costPerKg", { valueAsNumber: true })}
            className={`form-input w-full ${errors.costPerKg ? "border-red-500" : ""}`}
          />
          {errors.costPerKg && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.costPerKg.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Estimated Days <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("estimatedDays")}
          placeholder="e.g., 3-5"
          className={`form-input w-full ${errors.estimatedDays ? "border-red-500" : ""}`}
        />
        {errors.estimatedDays && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.estimatedDays.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Available Cities (JSON array)
        </label>
        <input
          type="text"
          {...register("availableInCities")}
          placeholder='["Dhaka", "Chittagong"]'
          className="form-input w-full"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter as JSON array, e.g., ["Dhaka", "Chittagong"]. Leave empty for all cities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="form-input w-full"
          />
        </div>

        <div className="flex items-center pt-6">
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
            : shippingMethod
            ? "Update Method"
            : "Create Method"}
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;

