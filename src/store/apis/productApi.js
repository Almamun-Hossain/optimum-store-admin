import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Products API
 * Endpoints for managing products
 */
export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        /**
         * Get all products with filtering and pagination
         * @param {Object} params - Query parameters
         * @param {string} params.search - Search in name, description, or brand
         * @param {boolean} params.isActive - Filter by active status
         * @param {number} params.categoryId - Filter by category (includes subcategories)
         * @param {string} params.brand - Filter by brand
         * @param {number} params.minPrice - Minimum price filter
         * @param {number} params.maxPrice - Maximum price filter
         * @param {string} params.attributes - Filter by variant attributes (format: "type:value,type:value")
         * @param {string} params.sortBy - Sort field (name, createdAt, updatedAt, default: "createdAt")
         * @param {string} params.sortOrder - Sort order (asc/desc, default: "desc")
         * @param {number} params.page - Page number (default: 1)
         * @param {number} params.limit - Items per page (default: 10)
         */
        getProducts: builder.query({
            query: (params = {}) => ({
                url: "/api/v1/product",
                params,
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return {
                        products: response.data.products || [],
                        meta: response.data.meta || {},
                    };
                }
                throw new Error(response.error || "Failed to fetch products");
            },
            providesTags: ["Product"],
        }),

        /**
         * Get product by ID or slug
         * @param {string|number} identifier - Product ID or slug
         */
        getProductById: builder.query({
            query: (identifier) => `/api/v1/product/${identifier}`,
            transformResponse: (response) => {
                if (response.success) {
                    return response.data.product || response.data;
                }
                throw new Error(response.error || "Failed to fetch product");
            },
            providesTags: (result, error, identifier) => [
                { type: "Product", id: identifier },
            ],
        }),

        /**
         * Create product (Admin only)
         * @param {Object} data - Product data
         */
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/api/v1/product",
                method: "POST",
                body: data,
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to create product");
            },
            invalidatesTags: ["Product"],
        }),

        /**
         * Update product (Admin only)
         * @param {Object} params - Update parameters
         * @param {number} params.id - Product ID
         * @param {Object} params.data - Product data to update
         */
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/v1/product/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to update product");
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                "Product",
            ],
        }),

        /**
         * Delete product (Admin only)
         * @param {number} id - Product ID
         */
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/api/v1/product/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to delete product");
            },
            invalidatesTags: ["Product"],
        }),

        /**
         * Create/Update inventory (Admin only)
         * @param {Object} params - Inventory parameters
         * @param {number} params.id - Product ID
         * @param {number} params.variantId - Variant ID
         * @param {Object} params.data - Inventory data
         */
        createOrUpdateInventory: builder.mutation({
            query: ({ id, variantId, ...data }) => ({
                url: `/api/v1/product/${id}/variants/${variantId}/inventory`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to update inventory");
            },
            invalidatesTags: ["Product"],
        }),

        /**
         * Upload product variant images (Admin only)
         * @param {Object} params - Upload parameters
         * @param {number} params.id - Product ID
         * @param {number} params.variantId - Variant ID
         * @param {FormData} params.data - FormData with files and metadata
         */
        uploadProductVariantImage: builder.mutation({
            query: ({ id, variantId, data }) => ({
                url: `/api/v1/product/${id}/variants/${variantId}/images`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to upload images");
            },
            invalidatesTags: ["Product"],
        }),

        /**
         * Update primary image (Admin only)
         * @param {Object} params - Update parameters
         * @param {number} params.id - Product ID
         * @param {number} params.variantId - Variant ID
         * @param {number} params.imageId - Image ID
         */
        updateProductionVariantPrimaryImage: builder.mutation({
            query: ({ id, variantId, imageId }) => ({
                url: `/api/v1/product/${id}/variants/${variantId}/images/${imageId}`,
                method: "PUT",
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(
                    response.error || "Failed to update primary image"
                );
            },
            invalidatesTags: ["Product"],
        }),

        /**
         * Delete product variant image (Admin only)
         * @param {Object} params - Delete parameters
         * @param {number} params.id - Product ID
         * @param {number} params.variantId - Variant ID
         * @param {number} params.imageId - Image ID
         */
        deleteProductVariantImage: builder.mutation({
            query: ({ id, variantId, imageId }) => ({
                url: `/api/v1/product/${id}/variants/${variantId}/images/${imageId}`,
                method: "DELETE",
            }),
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.error || "Failed to delete image");
            },
            invalidatesTags: ["Product"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateOrUpdateInventoryMutation,
    useUploadProductVariantImageMutation,
    useUpdateProductionVariantPrimaryImageMutation,
    useDeleteProductVariantImageMutation,
} = productApi;
