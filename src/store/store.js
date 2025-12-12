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
      adminUsersApi.middleware
    ),
});
