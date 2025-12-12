import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const customerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(30, "Full name must be 30 characters or less"),
  phone: z.string().regex(/^01[1-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: z.string().optional(),
});

const CustomerForm = ({ customer, onSubmit, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      fullName: "",
      phone: "",
      email: "",
      gender: "",
      dateOfBirth: "",
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gender
        </label>
        <select {...register("gender")} className="form-select w-full">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          {...register("dateOfBirth")}
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
          {isLoading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;

