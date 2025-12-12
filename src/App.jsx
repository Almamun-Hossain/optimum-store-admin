import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./css/style.css";
import "./charts/ChartjsConfig";
import LoadingSpinner from "./components/LoadingSpinner";
import PageTransition from "./components/PageTransition";

// Import pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const CustomersPage = React.lazy(() => import("./pages/CustomersPage"));
const AdminOrdersPage = React.lazy(() => import("./pages/AdminOrdersPage"));
const InventoryPage = React.lazy(() => import("./pages/InventoryPage"));
const ShippingMethodsPage = React.lazy(() => import("./pages/ShippingMethodsPage"));
const NotificationLogsPage = React.lazy(() => import("./pages/NotificationLogsPage"));
const AdminUsersPage = React.lazy(() => import("./pages/AdminUsersPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipping-methods"
              element={
                <ProtectedRoute>
                  <ShippingMethodsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification-logs"
              element={
                <ProtectedRoute>
                  <NotificationLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PageTransition>
      </Suspense>
    </Provider>
  );
}

export default App;
