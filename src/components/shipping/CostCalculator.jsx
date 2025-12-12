import React, { useState } from "react";
import { useForm } from "react-hook-form";
import GlobalModal from "../GlobalModal";
import { useCalculateShippingCostMutation } from "../../store/apis/shippingMethodsApi";
import { toast } from "react-hot-toast";

const CostCalculator = ({ shippingMethod, isOpen, onClose }) => {
  const [calculateCost, { isLoading }] = useCalculateShippingCostMutation();
  const [result, setResult] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleCalculate = async (data) => {
    try {
      const response = await calculateCost({
        shippingMethodId: shippingMethod.id,
        totalWeight: Number(data.totalWeight),
      }).unwrap();
      setResult(response);
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to calculate cost"
      );
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Calculate Shipping Cost - ${shippingMethod?.name}`}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit(handleCalculate)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("totalWeight", {
              required: "Weight is required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Weight must be greater than 0" },
            })}
            className={`form-input w-full ${errors.totalWeight ? "border-red-500" : ""}`}
            placeholder="e.g., 2.5"
          />
          {errors.totalWeight && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.totalWeight.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn bg-violet-500 hover:bg-violet-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Calculation Result
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Base Cost:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ৳{result.cost?.baseCost?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Cost Per Kg:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ৳{result.cost?.costPerKg?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Weight:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {result.cost?.totalWeight || "0"} kg
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-gray-900 dark:text-gray-100">Total Cost:</span>
              <span className="text-violet-600 dark:text-violet-400">
                ৳{result.cost?.totalCost?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>
      )}
    </GlobalModal>
  );
};

export default CostCalculator;

