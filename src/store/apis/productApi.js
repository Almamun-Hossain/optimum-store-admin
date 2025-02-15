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
        createOrUpdateInventory: builder.mutation({
            query: ({ id, variantId, ...data }) => ({
                url: `/product/${id}/variants/${variantId}/inventory`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        uploadProductVariantImage: builder.mutation({
            query: ({ id, variantId, data }) => ({
                url: `/product/${id}/variants/${variantId}/images`,
                method: "POST",
                body: data,
                formData: true,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProductionVariantPrimaryImage: builder.mutation({
            query: ({ id, variantId, imageId }) => ({
                url: `/product/${id}/variants/${variantId}/images/${imageId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProductVariantImage: builder.mutation({
            query: ({ id, variantId, imageId }) => ({
                url: `/product/${id}/variants/${variantId}/images/${imageId}`,
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
    useCreateOrUpdateInventoryMutation,
    useUploadProductVariantImageMutation,
    useUpdateProductionVariantPrimaryImageMutation,
    useDeleteProductVariantImageMutation,
} = productApi;
