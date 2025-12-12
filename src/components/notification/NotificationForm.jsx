import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const notificationSchema = z.object({
  userId: z.number().optional(),
  type: z.enum(["email", "sms"]),
  template: z.string().min(1, "Template is required"),
  recipient: z.string().min(1, "Recipient is required"),
  subject: z.string().optional(),
  status: z.enum(["sent", "failed", "pending"]),
  errorMessage: z.string().optional(),
  metadata: z.string().optional(),
  sentAt: z.string().optional(),
});

const NotificationForm = ({
  notification,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: notification
      ? {
          ...notification,
          userId: notification.userId || undefined,
          metadata: notification.metadata
            ? typeof notification.metadata === "string"
              ? notification.metadata
              : JSON.stringify(notification.metadata)
            : "",
          sentAt: notification.sentAt
            ? new Date(notification.sentAt).toISOString().slice(0, 16)
            : "",
        }
      : {
          type: "email",
          template: "",
          recipient: "",
          subject: "",
          status: "pending",
          errorMessage: "",
          metadata: "",
          sentAt: "",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          User ID (Optional)
        </label>
        <input
          type="number"
          {...register("userId", { valueAsNumber: true })}
          className="form-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register("type")}
          className={`form-select w-full ${errors.type ? "border-red-500" : ""}`}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.type.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Template <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("template")}
          className={`form-input w-full ${errors.template ? "border-red-500" : ""}`}
        />
        {errors.template && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.template.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipient <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("recipient")}
          placeholder="email@example.com or phone number"
          className={`form-input w-full ${errors.recipient ? "border-red-500" : ""}`}
        />
        {errors.recipient && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.recipient.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject (Optional)
        </label>
        <input
          type="text"
          {...register("subject")}
          className="form-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status")}
          className={`form-select w-full ${errors.status ? "border-red-500" : ""}`}
        >
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.status.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Error Message (Optional)
        </label>
        <textarea
          {...register("errorMessage")}
          rows={2}
          className="form-textarea w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Metadata (JSON string, Optional)
        </label>
        <textarea
          {...register("metadata")}
          rows={3}
          className="form-textarea w-full"
          placeholder='{"orderId": 1}'
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sent At (Optional)
        </label>
        <input
          type="datetime-local"
          {...register("sentAt")}
          className="form-input w-full"
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
          {isLoading
            ? "Saving..."
            : notification
            ? "Update Notification"
            : "Create Notification"}
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;

