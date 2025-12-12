import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import GlobalModal from "../GlobalModal";
import { useGetOrderHistoryQuery } from "../../store/apis/adminOrdersApi";

const OrderStatusModal = ({
  order,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const { data: historyData, isLoading: historyLoading } = useGetOrderHistoryQuery(
    order?.id,
    { skip: !order?.id || !showHistory }
  );

  useEffect(() => {
    if (order) {
      // Get current status ID - this would need to be mapped from status name
      // For now, we'll use a simple approach
      setValue("notes", "");
    }
  }, [order, setValue]);

  const statusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Paid" },
    { value: 3, label: "Processing" },
    { value: 4, label: "Shipped" },
    { value: 5, label: "Delivered" },
    { value: 6, label: "Cancelled" },
    { value: 7, label: "Refunded" },
  ];

  const handleFormSubmit = (data) => {
    onSubmit({
      id: order.id,
      statusId: Number(data.statusId),
      notes: data.notes || "",
    });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Order Status - ${order?.orderNumber}`}
      className="w-full max-w-2xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Status
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order?.status}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("statusId", { required: "Status is required" })}
              className={`form-select w-full ${errors.statusId ? "border-red-500" : ""}`}
            >
              <option value="">Select status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.statusId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.statusId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="form-textarea w-full"
              placeholder="Add notes about this status change..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {showHistory ? "Hide" : "Show"} Order History
            </button>
            <div className="flex gap-3">
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
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </form>

        {showHistory && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Order History
            </h3>
            {historyLoading ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading history...
              </p>
            ) : historyData && historyData.length > 0 ? (
              <div className="space-y-3">
                {historyData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.notes}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Changed by: {entry.changedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No history available
              </p>
            )}
          </div>
        )}
      </div>
    </GlobalModal>
  );
};

export default OrderStatusModal;

