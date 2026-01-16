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

  // Status name to ID mapping
  const statusNameToId = {
    pending: 1,
    paid: 2,
    processing: 3,
    shipped: 4,
    delivered: 5,
    cancelled: 6,
    refunded: 7,
  };

  // Status ID to name mapping (for reverse lookup)
  const statusIdToName = {
    1: "pending",
    2: "paid",
    3: "processing",
    4: "shipped",
    5: "delivered",
    6: "cancelled",
    7: "refunded",
  };

  // Valid status transitions
  const validTransitions = {
    pending: ["paid", "cancelled"],
    paid: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["refunded"],
    cancelled: [],
    refunded: [],
  };

  // All status options
  const allStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Paid" },
    { value: 3, label: "Processing" },
    { value: 4, label: "Shipped" },
    { value: 5, label: "Delivered" },
    { value: 6, label: "Cancelled" },
    { value: 7, label: "Refunded" },
  ];

  // Get valid status options based on current status
  const getValidStatusOptions = () => {
    if (!order?.status) return allStatusOptions;

    const currentStatus = order.status.toLowerCase();
    const validNextStatuses = validTransitions[currentStatus] || [];

    // If no valid transitions, return empty array (order cannot be changed)
    if (validNextStatuses.length === 0) {
      return [];
    }

    // Map valid status names to status options
    return allStatusOptions.filter((option) => {
      const statusName = statusIdToName[option.value];
      return validNextStatuses.includes(statusName);
    });
  };

  const statusOptions = getValidStatusOptions();

  useEffect(() => {
    if (order) {
      // Reset form when order changes
      setValue("statusId", "");
      setValue("notes", "");
    }
  }, [order, setValue]);

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
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Status
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order?.status}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              New Status <span className="text-red-500">*</span>
            </label>
            {statusOptions.length === 0 ? (
              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  No valid status transitions available for orders with status "{order?.status}". 
                  This order cannot be moved to another status.
                </p>
              </div>
            ) : (
              <>
                <select
                  {...register("statusId", { required: "Status is required" })}
                  className={`w-full form-select ${errors.statusId ? "border-red-500" : ""}`}
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
              </>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full form-textarea"
              placeholder="Add notes about this status change..."
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
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
                className="text-gray-700 bg-gray-100 btn dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-violet-500 btn hover:bg-violet-600"
                disabled={isLoading || statusOptions.length === 0}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </form>

        {showHistory && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
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
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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

