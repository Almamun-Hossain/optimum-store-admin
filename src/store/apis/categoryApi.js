import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/category",
      transformResponse: (response) => response.data.categories,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    moveCategory: builder.mutation({
      query: ({ draggedId, targetId }) => ({
        url: `/category/${draggedId}/move`,
        method: "PATCH",
        body: { newParentId: targetId },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useMoveCategoryMutation,
} = categoryApi;
