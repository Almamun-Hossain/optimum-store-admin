import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { categoryApi } from "./apis/categoryApi";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import { productApi } from "./apis/productApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, categoryApi.middleware, productApi.middleware),
});
