import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModal from "../GlobalModal";

const adjustSchema = z.object({
  quantity: z
    .number()
    .min(-10000, "Quantity adjustment must be between -10000 and 10000")
    .max(10000, "Quantity adjustment must be between -10000 and 10000"),
  reason: z.enum(["manual_adjustment", "restock", "damage", "return"]).optional(),
  notes: z.string().optional(),
});

const InventoryAdjustForm = ({
  inventory,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      quantity: 0,
      reason: "manual_adjustment",
      notes: "",
    },
  });

  const quantity = watch("quantity");
  const currentQuantity = inventory?.quantityAvailable || 0;
  const newQuantity = currentQuantity + (quantity || 0);

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory"
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Current Quantity:</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentQuantity}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">New Quantity:</p>
              <p
                className={`text-lg font-semibold ${
                  newQuantity < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {newQuantity}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adjustment Quantity <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (Positive to add, negative to subtract)
            </span>
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className={`form-input w-full ${errors.quantity ? "border-red-500" : ""}`}
            placeholder="e.g., 10 or -5"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason
          </label>
          <select {...register("reason")} className="form-select w-full">
            <option value="manual_adjustment">Manual Adjustment</option>
            <option value="restock">Restock</option>
            <option value="damage">Damage</option>
            <option value="return">Return</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="form-textarea w-full"
            placeholder="Add notes about this adjustment..."
          />
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
            {isLoading ? "Adjusting..." : "Adjust Inventory"}
          </button>
        </div>
      </form>
    </GlobalModal>
  );
};

export default InventoryAdjustForm;

