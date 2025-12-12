import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

// Base query for login (no auth required)
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/admin/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Login failed");
      },
    }),
    logout: builder.mutation({
      queryFn: async (refreshToken, { getState }, extraOptions) => {
        const state = getState();
        const token = state.auth.token;
        const result = await fetchBaseQuery({
          baseUrl: import.meta.env.VITE_API_BASE_URL,
          prepareHeaders: (headers) => {
            if (token) {
              headers.set("authorization", `Bearer ${token}`);
            }
            if (refreshToken) {
              headers.set("x-refresh-token", refreshToken);
            }
            return headers;
          },
        })(
          {
            url: "/api/v1/admin/auth/logout",
            method: "POST",
          },
          { getState },
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return result.data.success
          ? { data: result.data.data }
          : {
              error: {
                status: "CUSTOM_ERROR",
                data: result.data.error || "Logout failed",
              },
            };
      },
    }),
    logoutAll: builder.mutation({
      queryFn: async (arg, { getState }, extraOptions) => {
        const result = await baseQueryWithAuthCheck(
          {
            url: "/api/v1/admin/auth/logout-all",
            method: "POST",
          },
          { getState },
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return result.data.success
          ? { data: result.data.data }
          : {
              error: {
                status: "CUSTOM_ERROR",
                data: result.data.error || "Logout all failed",
              },
            };
      },
    }),
    changePassword: builder.mutation({
      queryFn: async (data, { getState }, extraOptions) => {
        const result = await baseQueryWithAuthCheck(
          {
            url: "/api/v1/admin/auth/change-password",
            method: "PATCH",
            body: data,
          },
          { getState },
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return result.data.success
          ? { data: result.data.data }
          : {
              error: {
                status: "CUSTOM_ERROR",
                data: result.data.error || "Password change failed",
              },
            };
      },
    }),
    /**
     * Get current admin user profile
     */
    getProfile: builder.query({
      queryFn: async (arg, { getState }, extraOptions) => {
        const result = await baseQueryWithAuthCheck(
          {
            url: "/api/v1/admin/profile",
          },
          { getState },
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        if (result.data.success) {
          // Handle response structure: { success: true, data: { profile: {...} } }
          return { data: result.data.data };
        }

        return {
          error: {
            status: "CUSTOM_ERROR",
            data: result.data.error || "Failed to fetch profile",
          },
        };
      },
    }),
    /**
     * Update current admin user profile
     */
    updateProfile: builder.mutation({
      queryFn: async (data, { getState }, extraOptions) => {
        const result = await baseQueryWithAuthCheck(
          {
            url: "/api/v1/admin/profile",
            method: "PUT",
            body: data,
          },
          { getState },
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        if (result.data.success) {
          // Handle response structure: { success: true, data: { profile: {...} } }
          return { data: result.data.data };
        }

        return {
          error: {
            status: "CUSTOM_ERROR",
            data: result.data.error || "Failed to update profile",
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
