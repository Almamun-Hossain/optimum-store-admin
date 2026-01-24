import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { categoryApi } from "./apis/categoryApi";
import { productApi } from "./apis/productApi";
import { userApi } from "./apis/userApi";
import { adminOrdersApi } from "./apis/adminOrdersApi";
import { inventoryApi } from "./apis/inventoryApi";
import { shippingMethodsApi } from "./apis/shippingMethodsApi";
import { notificationLogsApi } from "./apis/notificationLogsApi";
import { adminUsersApi } from "./apis/adminUsersApi";
import { rolesApi } from "./apis/rolesApi";
import { paymentsApi } from "./apis/paymentsApi";
import { preordersApi } from "./apis/preordersApi";
import { dashboardApi } from "./apis/dashboardApi";
import { auditLogsApi } from "./apis/auditLogsApi";
import { heroSliderApi } from "./apis/heroSliderApi";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminOrdersApi.reducerPath]: adminOrdersApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [shippingMethodsApi.reducerPath]: shippingMethodsApi.reducer,
    [notificationLogsApi.reducerPath]: notificationLogsApi.reducer,
    [adminUsersApi.reducerPath]: adminUsersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [preordersApi.reducerPath]: preordersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [auditLogsApi.reducerPath]: auditLogsApi.reducer,
    [heroSliderApi.reducerPath]: heroSliderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      productApi.middleware,
      userApi.middleware,
      adminOrdersApi.middleware,
      inventoryApi.middleware,
      shippingMethodsApi.middleware,
      notificationLogsApi.middleware,
      adminUsersApi.middleware,
      rolesApi.middleware,
      paymentsApi.middleware,
      preordersApi.middleware,
      dashboardApi.middleware,
      auditLogsApi.middleware,
      heroSliderApi.middleware
    ),
});
