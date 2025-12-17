import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to perform logout and redirect
const handleLogoutAndRedirect = (api) => {
  // Try to dispatch logout action if api.dispatch is available
  // If not, we'll still clear localStorage directly
  try {
    if (api && api.dispatch && typeof api.dispatch === 'function') {
      api.dispatch(logout());
    }
  } catch (error) {
    console.warn('Failed to dispatch logout action:', error);
  }

  // Always clear localStorage and sessionStorage, regardless of dispatch
  if (typeof window !== "undefined") {
    // Explicitly remove auth tokens first
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // Clear all localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Use setTimeout to ensure storage operations complete before redirect
    setTimeout(() => {
      window.location.href = "/signin";
    }, 0);
  }
};

// Helper to extract error message in a consistent way
const getErrorMessage = (data) => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    return data.error || data.message || data.detail || "";
  }
  return "";
};

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  const { auth } = api.getState();
  const token = auth.token;
  const refreshToken = auth.refreshToken;

  // Base query with auth header
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Standard header name
      }
      return headers;
    },
  });

  // Initial request
  let result = await baseQuery(args, api, extraOptions);

  // Normalize error/data for checking
  const responseData = result.error?.data || result.data;
  const errorMessage = getErrorMessage(responseData).toLowerCase();
  const status = result.error?.status;

  const isTokenExpired =
    (status === 401 || status === 405) ||
    errorMessage.includes("token expired") ||
    (responseData && responseData.success === false && errorMessage.includes("token"));

  // Special case: 406 usually means refresh token invalid/expired
  if (result.error?.status === 406) {
    handleLogoutAndRedirect(api);
    return result;
  }

  if (isTokenExpired && refreshToken) {
    try {
      // Attempt to refresh token
      const refreshQuery = fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          headers.set("x-refresh-token", refreshToken);
          return headers;
        },
      });

      const refreshResult = await refreshQuery(
        { url: "/api/v1/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      const refreshData = refreshResult.data || refreshResult.error?.data;
      const refreshErrorMessage = getErrorMessage(refreshData).toLowerCase();
      const refreshStatus = refreshResult.error?.status;

      // Determine if refresh failed
      const isRefreshFailed =
        refreshStatus === 400 ||
        refreshStatus === 401 ||
        refreshStatus === 404 ||
        (refreshData && refreshData.success === false) ||
        refreshErrorMessage.includes("token");

      if (isRefreshFailed) {
        handleLogoutAndRedirect(api);
        return refreshResult.error ? refreshResult : result;
      }

      // Refresh successful
      if (refreshResult.data?.success && refreshResult.data?.data) {
        const { accessToken, refreshToken: newRefreshToken, user } = refreshResult.data.data;

        api.dispatch(
          setCredentials({
            user: user || auth.user,
            accessToken,
            refreshToken: newRefreshToken ?? refreshToken, // fallback if not provided
          })
        );

        // Retry original query with new access token
        const retryQuery = fetchBaseQuery({
          baseUrl: BASE_URL,
          prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${accessToken}`);
            return headers;
          },
        });

        result = await retryQuery(args, api, extraOptions);
        return result;
      }
    } catch (err) {
      // Network or unexpected error during refresh
      handleLogoutAndRedirect(api);
      return result;
    }
  } else if (isTokenExpired && !refreshToken) {
    // No refresh token available
    handleLogoutAndRedirect(api);
  }

  return result;
};

export default baseQueryWithAuthCheck;