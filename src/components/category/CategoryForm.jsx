import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../store/apis/categoryApi";
import { toast } from "react-hot-toast";
import CategorySelect from "./CategorySelect";
import { useSelector } from "react-redux";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.union([z.string(), z.number(), z.null()]).transform((val) => {
    if (val === "" || val === "null" || val === null) {
      return null;
    }
    const num = Number(val);
    return isNaN(num) ? null : num;
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(1).default(1),
});

const CategoryForm = React.memo(({ category, onClose, onSubmit }) => {
  const { categories } = useSelector((state) => state.category);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [isLoading, setIsLoading] = useState(false);

  const filteredCategories = useMemo(() => {
    const filterCategoryRecursive = (categories) => {
      return categories
        .filter((cat) => cat.id !== category?.id)
        .map((cat) => {
          if (cat.children && cat.children.length > 0) {
            return {
              ...cat,
              children: filterCategoryRecursive(cat.children),
            };
          }
          return cat;
        });
    };

    return filterCategoryRecursive(categories);
  }, [categories, category]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitted },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      parentId: null,
      description: "",
      isActive: true,
      sortOrder: 1,
    },
    reValidateMode: "onChange",
    resolver: zodResolver(categorySchema),
  });

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (category) {
        await updateCategory({ id: category.id, ...data }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(data).unwrap();
        toast.success("Category created successfully");
      }

      onSubmit();
      reset();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.data?.message || "Error submitting category");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitError = (errors) => {
    console.log("errors", errors);
  };

  useEffect(() => {
    if (category && category.id) {
      reset(category);
    } else {
      setValue("name", "");
      setValue("parentId", null);
      setValue("description", "");
      setValue("isActive", true);
      setValue("sortOrder", 1);
    }
  }, [category]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {category ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {category
                ? "Update category details below"
                : "Fill in the details to create a new category"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close form"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">

      <form
        onSubmit={handleSubmit(onFormSubmit, onSubmitError)}
        className="space-y-5"
      >
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="name"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            className={`form-input w-full ${
              errors.name
                ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500"
                : ""
            }`}
            type="text"
            placeholder="Enter category name"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-sm text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.name.message}
            </div>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="parentId"
          >
            Parent Category
          </label>
          <CategorySelect
            categories={filteredCategories}
            value={watch("parentId")}
            onChange={(value) => setValue("parentId", value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Optional: Select a parent category to create a hierarchy
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            className="form-textarea w-full"
            rows="3"
            placeholder="Enter category description (optional)"
            {...register("description")}
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            id="isActive"
            className="form-checkbox w-4 h-4"
            {...register("isActive")}
          />
          <label
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            htmlFor="isActive"
          >
            Active
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {watch("isActive") ? "Visible to users" : "Hidden from users"}
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="sortOrder"
          >
            Sort Order
          </label>
          <input
            id="sortOrder"
            className="form-input w-full"
            type="number"
            min={1}
            placeholder="1"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Lower numbers appear first in the list
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-violet-500 hover:bg-violet-600 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                {category ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Update Category</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Create Category</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
});

export default CategoryForm;
