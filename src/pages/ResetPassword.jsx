import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  useResetPasswordMutation,
  useResendResetOtpMutation,
} from "../store/apis/authApi";
import ToasterWrapper from "../layout/ToasterWrapper";

// Validation schema
const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(4, "OTP must be at least 4 digits")
      .max(6, "OTP must be at most 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password_confirmation: false,
  });
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword] = useResetPasswordMutation();
  const [resendOtp] = useResendResetOtpMutation();

  const identifier = location.state?.identifier || "";
  const method = location.state?.method || "email";

  useEffect(() => {
    if (!identifier) {
      toast.error("Please request a password reset first");
      navigate("/reset-password/request", { replace: true });
    }
  }, [identifier, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await resetPassword({
        identifier: identifier,
        otp: data.otp,
        password: data.password,
        password_confirmation: data.password_confirmation,
        method: method,
      }).unwrap();

      toast.success(result.message || "Password reset successfully");
      navigate("/signin", { replace: true });
    } catch (err) {
      const errorMessage =
        err?.data?.error || err?.data?.message || err?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const result = await resendOtp({
        identifier: identifier,
        method: method,
      }).unwrap();

      toast.success(result.message || "Reset code resent successfully");
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      const errorMessage =
        err?.data?.error || err?.data?.message || err?.message || "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!identifier) {
    return null;
  }

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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                      Reset Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter the code sent to{" "}
                      <span className="font-medium">{identifier}</span> and your new password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="otp"
                      >
                        Reset Code
                      </label>
                      <input
                        id="otp"
                        className={`form-input w-full text-center text-2xl tracking-widest ${
                          errors.otp ? "border-red-500" : ""
                        }`}
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...register("otp")}
                        placeholder="000000"
                      />
                      {errors.otp && (
                        <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Didn't receive the code?
                        </p>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendCooldown > 0 || isResending}
                          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : isResending
                            ? "Sending..."
                            : "Resend Code"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="password"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPasswords.password ? "text" : "password"}
                          className={`form-input w-full pr-10 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          {...register("password")}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("password")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPasswords.password ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="password_confirmation"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="password_confirmation"
                          type={showPasswords.password_confirmation ? "text" : "password"}
                          className={`form-input w-full pr-10 ${
                            errors.password_confirmation ? "border-red-500" : ""
                          }`}
                          {...register("password_confirmation")}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("password_confirmation")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPasswords.password_confirmation ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password_confirmation.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn bg-violet-500 hover:bg-violet-600 text-white w-full disabled:bg-violet-300 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
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
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/reset-password/request"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      ← Back to Request Reset
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

export default ResetPassword;
