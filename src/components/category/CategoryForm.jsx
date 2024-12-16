import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../store/apis/categoryApi";
import { toast } from "react-hot-toast";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : Number(val))),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const CategoryForm = React.memo(({ category, parentCategories, onClose, onSubmit }) => {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
        name: category.name,
        parentId: category.parentId?.toString() || "",
        description: category.description || "",
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      }
      : {
        name: "",
        parentId: null,
        description: "",
        isActive: true,
        sortOrder: 0,
      },
  });

  const onFormSubmit = async (data) => {
    try {
      console.log("data", data);
      console.log("category", category);
      if (category) {
        await updateCategory({ id: category.id, ...data }).unwrap();
        console.log("updateCategory");
        toast.success("Category updated successfully");
      } else {
        await createCategory(data).unwrap();
        console.log("createCategory");
        toast.success("Category created successfully");
      }

      onSubmit();
      reset();
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      toast.error(error.data?.message || "Error submitting category");
    } finally {
      console.log("finally");
    }
  };

  useEffect(() => {
    if (category && category.id) {
      reset(category);
    } else {
      setValue("name", "");
      setValue("parentId", null);
      setValue("description", "");
      setValue("isActive", true);
      setValue("sortOrder", 0);
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

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
          <select
            id="parentId"
            className="form-select w-full"
            {...register("parentId")}
          >
            <option value="">None</option>
            {parentCategories.map((parent) => (
              <option
                key={parent.id}
                value={parent.id}
                disabled={category && category.id === parent.id}
              >
                {parent.name}
              </option>
            ))}
          </select>
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
