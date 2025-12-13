import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "../store/apis/authApi";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import ToasterWrapper from "../layout/ToasterWrapper";
import ProfileForm from "../components/settings/ProfileForm";
import PasswordChangeForm from "../components/settings/PasswordChangeForm";
import RolePermissionsView from "../components/settings/RolePermissionsView";

function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const dispatch = useDispatch();
  const { user: authUser, token, refreshToken } = useSelector((state) => state.auth);
  
  const { data: response, isLoading, isError, refetch } = useGetProfileQuery();
  const profile = response?.profile || response || null;
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleProfileUpdate = async (data, setServerErrors) => {
    try {
      const result = await updateProfile(data).unwrap();
      
      // Clear any server errors on success
      if (setServerErrors) {
        setServerErrors({});
      }
      
      toast.success("Profile updated successfully");
      
      // Update auth state with new user data
      const updatedProfile = result?.profile || result?.user || result;
      if (updatedProfile) {
        dispatch(setCredentials({
          user: updatedProfile,
          accessToken: token,
          refreshToken: refreshToken,
        }));
      }
      
      refetch();
    } catch (error) {
      // Handle validation errors from API
      const errorData = error?.data;
      
      // Check if error is an array of field errors
      if (Array.isArray(errorData?.error)) {
        const fieldErrors = {};
        errorData.error.forEach((err) => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message;
          }
        });
        
        // Set server errors in form
        if (setServerErrors) {
          setServerErrors(fieldErrors);
        }
        
        // Show toast with first error or general message
        const firstError = errorData.error[0];
        if (firstError?.message) {
          toast.error(firstError.message);
        } else {
          toast.error("Please fix the validation errors");
        }
      } else {
        // Handle general errors (string or object)
        let errorMessage = "Failed to update profile";
        
        if (typeof errorData?.error === 'string') {
          errorMessage = errorData.error;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        
        // Clear server errors for general errors
        if (setServerErrors) {
          setServerErrors({});
        }
      }
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Password changed successfully. Please login again.");
      // Optionally redirect to login after password change
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (error) {
      toast.error(
        error?.data?.error || error?.message || "Failed to change password"
      );
    }
  };

  if (isError) {
    return (
      <ToasterWrapper>
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">
                    Error loading profile. Please try again.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ToasterWrapper>
    );
  }

  return (
    <ToasterWrapper>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Settings
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "profile"
                        ? "border-violet-500 text-violet-600 dark:text-violet-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "password"
                        ? "border-violet-500 text-violet-600 dark:text-violet-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setActiveTab("role")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "role"
                        ? "border-violet-500 text-violet-600 dark:text-violet-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Role & Permissions
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Loading profile...
                    </p>
                  </div>
                ) : (
                  <div className="p-6 md:p-8">
                    {activeTab === "profile" && (
                      <ProfileForm
                        profile={profile || authUser}
                        onSubmit={handleProfileUpdate}
                        isLoading={isUpdating}
                      />
                    )}
                    {activeTab === "password" && (
                      <PasswordChangeForm
                        profile={profile || authUser}
                        onSubmit={handlePasswordChange}
                        isLoading={isChangingPassword}
                      />
                    )}
                    {activeTab === "role" && (
                      <RolePermissionsView profile={profile || authUser} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default SettingsPage;

