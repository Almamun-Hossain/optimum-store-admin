import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/product",
            transformResponse: (response) => ({
                products: response.data.products,
                meta: response.data.meta,
            }),
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/product/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi; 