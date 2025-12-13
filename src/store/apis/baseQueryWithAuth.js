import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../slices/authSlice";

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
    const state = api.getState();
    const token = state.auth.token;
    const refreshToken = state.auth.refreshToken;

    const result = await fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers) => {
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    })(args, api, extraOptions);

    // Check if the token has expired
    // Handle both status codes (401 Unauthorized, 405 Token expired) and error messages
    const errorData = result.error?.data || result.data;
    const errorMessage = typeof errorData === 'object' 
        ? (errorData.error || errorData.message || '')
        : (errorData || '');
    const errorMessageStr = typeof errorMessage === 'string' 
        ? errorMessage.toLowerCase() 
        : '';
    
    const isTokenExpired = 
        (result.error && (
            result.error.status === 401 || 
            result.error.status === 405
        )) ||
        (result.data && result.data.success === false && errorMessageStr.includes('token expired')) ||
        (result.error && errorMessageStr.includes('token expired'));

    if (isTokenExpired && refreshToken) {
        try {
            // Call refresh token API
            const refreshResult = await fetchBaseQuery({
                baseUrl: import.meta.env.VITE_API_BASE_URL,
                prepareHeaders: (headers) => {
                    // Use expired token as per API docs
                    if (token) {
                        headers.set("Authorization", `Bearer ${token}`);
                    }
                    headers.set("x-refresh-token", refreshToken);
                    return headers;
                },
            })(
                {
                    url: "/api/v1/refresh-token",
                    method: "POST",
                },
                api,
                extraOptions
            );

            // Check if refresh token call itself failed with 404, 401, or 400
            const refreshErrorStatus = refreshResult.error?.status;
            const isRefreshTokenError = 
                refreshErrorStatus === 404 || 
                refreshErrorStatus === 401 || 
                refreshErrorStatus === 400;

            if (isRefreshTokenError) {
                // Refresh token endpoint returned error, logout and redirect
                api.dispatch(logout());
                // Redirect to signin page
                if (typeof window !== 'undefined') {
                    window.location.href = '/signin';
                }
                return refreshResult;
            }

            if (refreshResult.data && refreshResult.data.success) {
                // Update credentials with new tokens
                api.dispatch(
                    setCredentials({
                        user: refreshResult.data.data.user || state.auth.user,
                        accessToken: refreshResult.data.data.accessToken,
                        refreshToken: refreshResult.data.data.refreshToken,
                    })
                );

                // Retry the original request with new token
                const retryResult = await fetchBaseQuery({
                    baseUrl: import.meta.env.VITE_API_BASE_URL,
                    prepareHeaders: (headers) => {
                        headers.set(
                            "authorization",
                            `Bearer ${refreshResult.data.data.accessToken}`
                        );
                        return headers;
                    },
                })(args, api, extraOptions);

                return retryResult;
            } else {
                // Refresh token failed (other errors), logout and redirect
                api.dispatch(logout());
                if (typeof window !== 'undefined') {
                    window.location.href = '/signin';
                }
                return refreshResult.error ? refreshResult : result;
            }
        } catch (error) {
            // If refresh fails, logout and redirect
            api.dispatch(logout());
            if (typeof window !== 'undefined') {
                window.location.href = '/signin';
            }
            return result;
        }
    } else if (isTokenExpired && !refreshToken) {
        // Token expired but no refresh token available, logout and redirect
        api.dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.href = '/signin';
        }
    } else if (result.error && result.error.status === 406) {
        // 406 indicates refresh token expired or invalid, logout and redirect
        api.dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.href = '/signin';
        }
    }

    return result;
};

export default baseQueryWithAuthCheck; 