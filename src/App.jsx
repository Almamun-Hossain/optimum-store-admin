import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));


function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
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
        </Routes>
      </Suspense>
    </Provider>
  );
}

export default App;
