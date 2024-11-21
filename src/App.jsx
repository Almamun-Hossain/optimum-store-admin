import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log(apiBaseUrl);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Provider store={store}>
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
      </Routes>
    </Provider>
  );
}

export default App;
