import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "./baseQueryWithAuth";

/**
 * Hero Slider API
 * Endpoints for managing hero slider slides
 */
export const heroSliderApi = createApi({
  reducerPath: "heroSliderApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["HeroSlider"],
  endpoints: (builder) => ({
    /**
     * Get all hero slides (Admin only)
     * Returns all hero slides, including unpublished ones, with pagination and search
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search in title and link (optional)
     * @param {boolean} params.isPublished - Filter by published status (optional)
     * @param {string} params.sortBy - Sort field (default: "sortOrder")
     * @param {string} params.sortOrder - Sort direction (default: "asc")
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     */
    getHeroSlides: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/admin/hero",
        params,
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            slides: response.data?.slides || [],
            meta: response.data?.meta || {},
          };
        }
        throw new Error(response.error || "Failed to fetch hero slides");
      },
      providesTags: ["HeroSlider"],
    }),

    /**
     * Get hero slide by ID (Admin only)
     * @param {number} id - Hero slide ID
     */
    getHeroSlideById: builder.query({
      query: (id) => `/api/v1/admin/hero/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch hero slide");
      },
      providesTags: (result, error, id) => [{ type: "HeroSlider", id }],
    }),

    /**
     * Create hero slide (Admin only)
     * @param {FormData} formData - Hero slide form data
     * @param {File} formData.image - Image file (required, JPEG/PNG/WebP/GIF, max 5MB)
     * @param {string} formData.title - Slide title (required, min 3 characters)
     * @param {string} formData.link - Link URL (optional, valid URL)
     * @param {number} formData.sortOrder - Sort order (optional, integer, default: 0)
     * @param {string} formData.isPublished - Published status (optional, "true" or "false", default: false)
     */
    createHeroSlide: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/admin/hero",
        method: "POST",
        body: formData,
        // RTK Query automatically handles FormData - browser sets Content-Type with boundary
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to create hero slide");
      },
      invalidatesTags: ["HeroSlider"],
    }),

    /**
     * Update hero slide (Admin only)
     * @param {Object} params - Update parameters
     * @param {number} params.id - Hero slide ID
     * @param {FormData} params.formData - Hero slide form data (all fields optional)
     * @param {File} params.formData.image - New image file (optional, JPEG/PNG/WebP/GIF, max 5MB)
     * @param {string} params.formData.title - Updated slide title (optional, min 3 characters)
     * @param {string} params.formData.link - Updated link URL (optional, valid URL)
     * @param {number} params.formData.sortOrder - Updated sort order (optional, integer)
     * @param {string} params.formData.isPublished - Updated published status (optional, "true" or "false")
     */
    updateHeroSlide: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/admin/hero/${id}`,
        method: "PUT",
        body: formData,
        // RTK Query automatically handles FormData - browser sets Content-Type with boundary
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update hero slide");
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "HeroSlider", id },
        "HeroSlider",
      ],
    }),

    /**
     * Delete hero slide (Admin only)
     * @param {number} id - Hero slide ID
     */
    deleteHeroSlide: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/hero/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to delete hero slide");
      },
      invalidatesTags: ["HeroSlider"],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetHeroSlideByIdQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} = heroSliderApi;

