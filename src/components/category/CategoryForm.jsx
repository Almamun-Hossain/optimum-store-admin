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
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {category ? "Edit Category" : "New Category"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
            <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
          </svg>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit, onSubmitError)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            className="form-input w-full"
            type="text"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-sm text-red-500 mt-1">
              {errors.name.message}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="parentId">
            Parent Category
          </label>
          <CategorySelect
            categories={filteredCategories}
            value={watch("parentId")}
            onChange={(value) => setValue("parentId", value)}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            className="form-textarea w-full"
            rows="3"
            {...register("description")}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="form-checkbox"
            {...register("isActive")}
          />
          <label className="text-sm ml-2" htmlFor="isActive">
            Active
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="sortOrder">
            Sort Order
          </label>
          <input
            id="sortOrder"
            className="form-input w-full"
            type="number"
            min={1}
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn border-gray-200 hover:border-gray-300 text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-violet-500 hover:bg-violet-600 text-white"
          >
            {isLoading ? "Saving..." : category ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default CategoryForm;
