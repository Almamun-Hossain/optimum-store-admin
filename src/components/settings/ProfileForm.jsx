import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose } from "react-icons/io5";

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
});

function ProfileForm({ profile, onSubmit, isLoading }) {
  const [serverErrors, setServerErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    },
  });

  // Sync server errors with react-hook-form
  useEffect(() => {
    Object.keys(serverErrors).forEach((field) => {
      setError(field, {
        type: "server",
        message: serverErrors[field],
      });
    });
  }, [serverErrors, setError]);

  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    setServerErrors({}); // Clear previous server errors
    // Pass setServerErrors to parent handler
    await onSubmit(data, setServerErrors);
  };

  // Clear server errors when user starts typing
  const handleInputChange = (field) => {
    if (serverErrors[field]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      clearErrors(field);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Server Error Alert */}
      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {submitError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {/* Personal Information Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your personal details and contact information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName", {
                onChange: () => handleInputChange("fullName"),
              })}
              className={`form-input w-full ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone", {
                onChange: () => handleInputChange("phone"),
              })}
              className={`form-input w-full ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder="01712345678"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                onChange: () => handleInputChange("email"),
              })}
              className={`form-input w-full ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your account details and status (read-only)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile?.id || "N/A"}
                disabled
                className="form-input w-full bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed text-gray-600 dark:text-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Status
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile?.isActive ? "Active" : "Inactive"}
                disabled
                className="form-input w-full bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed text-gray-600 dark:text-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile?.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {profile?.isActive ? "✓ Active" : "✗ Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Last Login */}
          {profile?.lastLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Login
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={new Date(profile.lastLogin).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  disabled
                  className="form-input w-full bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed text-gray-600 dark:text-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Member Since */}
          {profile?.createdAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  disabled
                  className="form-input w-full bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed text-gray-600 dark:text-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Roles Section */}
      {profile?.roles && profile.roles.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Roles & Permissions
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Your assigned roles and access levels
            </p>
          </div>
          
          <div className="space-y-3">
            {profile.roles.map((role, index) => (
              <div
                key={role.id || index}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {role.name}
                      </h3>
                      {role.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {role.description}
                        </p>
                      )}
                      {role.assignedAt && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          Assigned on {new Date(role.assignedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    role.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                  }`}>
                    {role.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isLoading}
          className="btn bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 fill-current shrink-0 mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                <path d="M1 14a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2h-1V2H1v11h3v1H1zm4-8a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm0 3a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
              </svg>
              Update Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
