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
      <main className="bg-white dark:bg-gray-900">
        <div className="relative">
          <div className="w-full">
            <div className="min-h-screen h-full flex flex-col after:flex-1">
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

              <div className="max-w-sm mx-auto px-4 py-8">
                <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
                  Welcome back! ✨
                </h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
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
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          className={`form-input w-full ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5 fill-current text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 fill-current text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
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
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="mr-1">
                      <Link
                        className="text-sm underline hover:no-underline"
                        to="/reset-password"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn bg-violet-500 hover:bg-violet-600 text-white ml-3 min-w-[100px] disabled:bg-violet-300"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
                <div className="pt-5 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm">
                    Don't you have an account?{" "}
                    <Link
                      className="font-medium text-violet-500 hover:text-violet-600"
                      to="/signup"
                    >
                      Sign Up
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

export default SignIn;
