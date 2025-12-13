import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetProfileQuery } from "../store/apis/authApi";
import { setCredentials, logout } from "../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Component to sync auth state with profile API when token exists but user data is missing
 */
function AuthStateSync({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, refreshToken, user } = useSelector((state) => state.auth);

  // Only fetch profile if we have tokens but no user data
  // Skip on signin page
  const isSignInPage = location.pathname === "/signin";
  const shouldFetchProfile = (token || refreshToken) && !user && !isSignInPage;

  const {
    data: profileResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: !shouldFetchProfile,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (shouldFetchProfile && profileResponse) {
      // Handle different response structures
      const profile = profileResponse.profile || profileResponse.user || profileResponse;
      if (profile && profile.id) {
        // Sync state with profile data
        dispatch(
          setCredentials({
            user: profile,
            accessToken: token,
            refreshToken: refreshToken,
          })
        );
      }
    }
  }, [profileResponse, shouldFetchProfile, token, refreshToken, dispatch]);

  // Handle error - if we have tokens but can't fetch profile, something is wrong
  useEffect(() => {
    if (shouldFetchProfile && isError) {
      // If it's an auth error (401/403/405), logout and redirect to signin
      const errorStatus = error?.status;
      if (errorStatus === 401 || errorStatus === 403 || errorStatus === 405) {
        dispatch(logout());
        if (!isSignInPage) {
          navigate("/signin", { replace: true });
        }
      }
    }
  }, [shouldFetchProfile, isError, error, dispatch, navigate, isSignInPage]);

  // Show loading state while syncing (only on protected routes)
  if (shouldFetchProfile && isLoading && !isSignInPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Syncing your session...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please wait while we restore your session
          </p>
        </div>
      </div>
    );
  }

  // Show error state if sync failed and it's not an auth error (only on protected routes)
  if (
    shouldFetchProfile &&
    isError &&
    error?.status !== 401 &&
    error?.status !== 403 &&
    error?.status !== 405 &&
    !isSignInPage
  ) {
    return <AuthErrorState onRetry={refetch} />;
  }

  return children;
}

/**
 * Error component shown when auth state sync fails
 */
function AuthErrorState({ onRetry }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Session Sync Error
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't sync your session data. This might be due to a network
            issue or a temporary server problem.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full btn bg-violet-500 hover:bg-violet-600 text-white"
            >
              <svg
                className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                viewBox="0 0 16 16"
              >
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
              Try Again
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoHome}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                </svg>
                Home
              </button>

              <button
                onClick={handleGoBack}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
                Go Back
              </button>
            </div>

            <button
              onClick={handleReload}
              className="w-full btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              <svg
                className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
              Reload Page
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            If the problem persists, please contact support or try logging in
            again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthStateSync;
