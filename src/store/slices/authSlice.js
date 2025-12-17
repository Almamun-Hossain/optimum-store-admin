import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/tokenUtils";

// Helper function to initialize auth state with token expiration check
// Note: Only access token expiration can be checked on frontend.
// Refresh token expiration is determined by backend API responses (401/404)
const initializeAuthState = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // Check if access token is expired
  if (token && isTokenExpired(token)) {
    // Access token is expired
    // If we have a refresh token, keep both - refresh will happen on next API call
    // If we don't have a refresh token, clear the expired access token
    if (!refreshToken) {
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    }
    // If refresh token exists, keep both tokens
    // The refresh token validity will be checked by backend on next API call
    // If refresh token is also expired, backend will return 401/404 and baseQueryWithAuth will handle it
  }

  return {
    user: null,
    token: token || null,
    refreshToken: refreshToken || null,
    isAuthenticated: !!token,
  };
};

const initialState = initializeAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
      if (payload.accessToken) {
        localStorage.setItem("token", payload.accessToken);
      }
      if (payload.refreshToken) {
        localStorage.setItem("refreshToken", payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
