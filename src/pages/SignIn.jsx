import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/apis/authApi";
import { setCredentials } from "../store/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ToasterWrapper from "../layout/ToasterWrapper";

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function SignIn() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data).unwrap();
      // result is already transformed, contains user, accessToken, refreshToken
      dispatch(setCredentials(result));
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      setError(err?.data?.error || err?.message || "Invalid credentials");
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
                  {/* Logo */}
                  <Link className="block" to="/">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                      Welcome back! ✨
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sign in to your admin account
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        className={`form-input w-full ${
                          errors.username ? "border-red-500" : ""
                        }`}
                        type="text"
                        {...register("username")}
                        placeholder="Enter email or phone number"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          className={`form-input w-full pr-10 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
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
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                        to="/reset-password/request"
                      >
                        Forgot Password?
                      </Link>
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
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ToasterWrapper>
  );
}

export default SignIn;
