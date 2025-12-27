import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRequestPasswordResetMutation } from "../store/apis/authApi";
import ToasterWrapper from "../layout/ToasterWrapper";

// Validation schema
const requestResetSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
});

// Helper function to get sessionStorage key for OTP timestamp
const getOtpTimestampKey = (identifier, method) => {
  return `otp_sent_timestamp_${method}_${identifier}`;
};

// Helper function to store OTP send timestamp
const storeOtpTimestamp = (identifier, method) => {
  const key = getOtpTimestampKey(identifier, method);
  sessionStorage.setItem(key, Date.now().toString());
};

function RequestPasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState("email");

  const navigate = useNavigate();
  const [requestPasswordReset] = useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset({
        identifier: data.identifier,
        method: method,
      }).unwrap();
      
      setIdentifier(data.identifier);
      setSuccess(true);
      
      // Store OTP send timestamp in sessionStorage
      storeOtpTimestamp(data.identifier, method);
      
      toast.success(result.message || "Reset code sent successfully");
    } catch (err) {
      const errorMessage =
        err?.data?.error || err?.data?.message || err?.message || "Failed to send reset code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToasterWrapper>
      <main className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
        <div className="relative">
          <div className="w-full">
            <div className="min-h-screen h-full flex flex-col">
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                  <Link className="block" to="/signin">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <defs>
                        <linearGradient
                          x1="28.538%"
                          y1="20.229%"
                          x2="100%"
                          y2="108.156%"
                          id="logo-a"
                        >
                          <stop
                            stopColor="#A5B4FC"
                            stopOpacity="0"
                            offset="0%"
                          />
                          <stop stopColor="#A5B4FC" offset="100%" />
                        </linearGradient>
                        <linearGradient
                          x1="88.638%"
                          y1="29.267%"
                          x2="22.42%"
                          y2="100%"
                          id="logo-b"
                        >
                          <stop
                            stopColor="#38BDF8"
                            stopOpacity="0"
                            offset="0%"
                          />
                          <stop stopColor="#38BDF8" offset="100%" />
                        </linearGradient>
                      </defs>
                      <rect fill="#6366F1" width="32" height="32" rx="16" />
                      <path
                        d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                        fill="#4F46E5"
                      />
                      <path
                        d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                        fill="url(#logo-a)"
                      />
                      <path
                        d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                        fill="url(#logo-b)"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="max-w-md w-full">
                  {!success ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
                          <svg
                            className="w-8 h-8 text-violet-600 dark:text-violet-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                        </div>
                        <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                          Forgot Password?
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          Enter your email or phone number and we'll send you a reset code.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="identifier"
                          >
                            Email or Phone Number
                          </label>
                          <input
                            id="identifier"
                            className={`form-input w-full ${
                              errors.identifier ? "border-red-500" : ""
                            }`}
                            type="text"
                            {...register("identifier")}
                            placeholder="Enter your email or phone number"
                          />
                          {errors.identifier && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.identifier.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reset Method
                          </label>
                          <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="form-select w-full"
                          >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn bg-violet-500 hover:bg-violet-600 text-white w-full disabled:bg-violet-300 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white inline-block mr-2"
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
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : null}
                          {isLoading ? "Sending..." : "Send Reset Code"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <svg
                          className="w-8 h-8 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                        Check Your {method === "email" ? "Email" : "Phone"}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We've sent a reset code to{" "}
                        <span className="font-medium">{identifier}</span>
                      </p>
                      <button
                        onClick={() => navigate("/reset-password", { state: { identifier, method } })}
                        className="btn bg-violet-500 hover:bg-violet-600 text-white w-full mb-4"
                      >
                        Enter Reset Code
                      </button>
                      <Link
                        to="/signin"
                        className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                      >
                        Back to Sign In
                      </Link>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <Link
                      to="/signin"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      ← Back to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ToasterWrapper>
  );
}

export default RequestPasswordReset;
