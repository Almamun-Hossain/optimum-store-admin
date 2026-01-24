import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const heroSlideSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  link: z.union([
    z.string().url("Please enter a valid URL"),
    z.string().length(0),
  ]).optional().transform(val => val === "" ? undefined : val),
  sortOrder: z.number().int("Sort order must be an integer").optional(),
  isPublished: z.boolean().optional(),
});

const HeroSliderForm = ({ slide, onSubmit, onClose, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(slide?.imageUrl || null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: slide
      ? {
          title: slide.title || "",
          link: slide.link || "",
          sortOrder: slide.sortOrder ?? 0,
          isPublished: slide.isPublished ?? false,
        }
      : {
          title: "",
          link: "",
          sortOrder: 0,
          isPublished: false,
        },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(slide?.imageUrl || null);
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setFileError("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      setSelectedFile(null);
      setPreviewUrl(slide?.imageUrl || null);
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("Image size must be less than 5MB");
      setSelectedFile(null);
      setPreviewUrl(slide?.imageUrl || null);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (data) => {
    // Validate image for create operation
    if (!slide && !selectedFile) {
      setFileError("Image is required");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("title", data.title);
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    if (data.link) {
      formData.append("link", data.link);
    }
    
    formData.append("sortOrder", data.sortOrder?.toString() || "0");
    formData.append("isPublished", data.isPublished ? "true" : "false");

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          className={`form-input w-full ${errors.title ? "border-red-500" : ""}`}
          placeholder="Enter slide title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Image {!slide && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className={`form-input w-full ${fileError ? "border-red-500" : ""}`}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {slide ? "Leave empty to keep current image. " : ""}
          Accepts JPEG, PNG, WebP, GIF (max 5MB)
        </p>
        {fileError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fileError}
          </p>
        )}
        {previewUrl && (
          <div className="mt-2">
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              {selectedFile ? "New image preview:" : "Current image:"}
            </p>
            <div className="overflow-hidden w-full h-32 bg-gray-100 rounded-lg dark:bg-gray-700">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Link URL
        </label>
        <input
          type="text"
          {...register("link")}
          className={`form-input w-full ${errors.link ? "border-red-500" : ""}`}
          placeholder="https://example.com/offers (optional)"
        />
        {errors.link && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.link.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional: Where users will be redirected when clicking this slide
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort Order
          </label>
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className={`form-input w-full ${errors.sortOrder ? "border-red-500" : ""}`}
          />
          {errors.sortOrder && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.sortOrder.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Lower numbers appear first
          </p>
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("isPublished")}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Published
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-700 bg-gray-100 btn dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-white bg-violet-500 btn hover:bg-violet-600"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : slide ? "Update Slide" : "Create Slide"}
        </button>
      </div>
    </form>
  );
};

export default HeroSliderForm;

