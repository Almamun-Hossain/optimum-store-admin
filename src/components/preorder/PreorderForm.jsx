import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const preorderSchema = z.object({
  variantId: z.number().min(1, "Variant ID is required"),
  expectedArrivalDate: z.string().min(1, "Expected arrival date is required"),
  maximumQuantity: z.number().min(1, "Maximum quantity is required"),
  preorderPrice: z.number().min(0, "Preorder price is required"),
  isActive: z.boolean().default(true),
});

function PreorderForm({ preorder, onSubmit, onClose, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(preorderSchema),
    defaultValues: preorder
      ? {
          variantId: preorder.variantId || "",
          expectedArrivalDate: preorder.expectedArrivalDate
            ? new Date(preorder.expectedArrivalDate).toISOString().split("T")[0]
            : "",
          maximumQuantity: preorder.maximumQuantity || "",
          preorderPrice: preorder.preorderPrice || "",
          isActive: preorder.isActive !== undefined ? preorder.isActive : true,
        }
      : {
          variantId: "",
          expectedArrivalDate: "",
          maximumQuantity: "",
          preorderPrice: "",
          isActive: true,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Variant ID <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("variantId", { valueAsNumber: true })}
          className={`form-input w-full ${errors.variantId ? "border-red-500" : ""}`}
        />
        {errors.variantId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.variantId.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expected Arrival Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("expectedArrivalDate")}
          className={`form-input w-full ${errors.expectedArrivalDate ? "border-red-500" : ""}`}
        />
        {errors.expectedArrivalDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.expectedArrivalDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Maximum Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("maximumQuantity", { valueAsNumber: true })}
          className={`form-input w-full ${errors.maximumQuantity ? "border-red-500" : ""}`}
        />
        {errors.maximumQuantity && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.maximumQuantity.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Preorder Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          {...register("preorderPrice", { valueAsNumber: true })}
          className={`form-input w-full ${errors.preorderPrice ? "border-red-500" : ""}`}
        />
        {errors.preorderPrice && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.preorderPrice.message}
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
            : preorder
            ? "Update Preorder"
            : "Create Preorder"}
        </button>
      </div>
    </form>
  );
}

export default PreorderForm;
