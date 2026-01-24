import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import CategorySelect from "../category/CategorySelect";
import useCategory from "../../hooks/useCategory";
import { FaPlusCircle, FaTrash, FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import VariantAttributes from "./VariantAttributes";
import TiptapEditor from "../shared/TiptapEditor";

const productSchema = z.object({
  categoryId: z.number().min(1, "Category is required"),
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  brand: z.string().max(100, "Brand must be less than 100 characters").optional(),
  skuPrefix: z.string().min(1, "SKU Prefix is required").max(50, "SKU Prefix must be less than 50 characters"),
  specifications: z.string().max(100000, "Specifications must be less than 100000 characters").optional(),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z
        .object({
          id: z.number().optional(),
          sku: z.string().min(1, "SKU is required").max(100, "SKU must be less than 100 characters"),
          basePrice: z.number().min(0.01, "Base Price must be greater than 0"),
          salePrice: z.preprocess(
            (val) => (val === null || val === "" || (typeof val === "number" && isNaN(val)) ? null : val),
            z.number().min(0, "Sale Price must be 0 or greater").nullable().optional()
          ),
          isActive: z.boolean().default(true),
          weight: z.preprocess(
            (val) => (val === null || val === "" || (typeof val === "number" && isNaN(val)) ? undefined : val),
            z.number().min(0, "Weight cannot be negative").optional()
          ),
          length: z.preprocess(
            (val) => (val === null || val === "" || (typeof val === "number" && isNaN(val)) ? undefined : val),
            z.number().min(0, "Length cannot be negative").optional()
          ),
          width: z.preprocess(
            (val) => (val === null || val === "" || (typeof val === "number" && isNaN(val)) ? undefined : val),
            z.number().min(0, "Width cannot be negative").optional()
          ),
          height: z.preprocess(
            (val) => (val === null || val === "" || (typeof val === "number" && isNaN(val)) ? undefined : val),
            z.number().min(0, "Height cannot be negative").optional()
          ),
          attributes: z
            .array(
              z.object({
                id: z.number().optional(),
                attributeType: z.string().min(1, "Attribute Type is required"),
                attributeValue: z.string().min(1, "Attribute Value is required"),
              })
            )
            .min(1, "At least one attribute is required"),
        })
        .refine(
          (data) => {
            if (!data.salePrice || data.salePrice === 0) return true;
            return data.salePrice <= data.basePrice;
          },
          {
            message: "Sale price must be less than or equal to base price",
            path: ["salePrice"],
          }
        )
    )
    .min(1, "At least one variant is required"),
});

const ProductForm = ({ product, onClose, onSubmit, isLoading = false }) => {
  const { categories } = useSelector((state) => state.category);
  const { categoriesLoading } = useCategory();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          ...product,
          variants:
            product.variants && product.variants.length > 0
              ? product.variants.map((variant) => ({
                  id: variant.id,
                  sku: variant.sku,
                  basePrice: variant.basePrice,
                  salePrice: variant.salePrice || null,
                  isActive: variant.isActive,
                  weight: variant.weight || null,
                  length: variant.length || null,
                  width: variant.width || null,
                  height: variant.height || null,
                  attributes:
                    variant.attributes && variant.attributes.length > 0
                      ? variant.attributes.map((attr) => ({
                          id: attr.id,
                          attributeType: attr.attributeType,
                          attributeValue: attr.attributeValue,
                        }))
                      : [{ attributeType: "", attributeValue: "" }],
                }))
              : [
                  {
                    sku: "",
                    basePrice: 0,
                    salePrice: null,
                    isActive: true,
                    weight: null,
                    length: null,
                    width: null,
                    height: null,
                    attributes: [{ attributeType: "", attributeValue: "" }],
                  },
                ],
        }
      : {
          categoryId: 0,
          name: "",
          description: "",
          brand: "",
          skuPrefix: "",
          specifications: "",
          isActive: true,
          variants: [
            {
              sku: "",
              basePrice: 0,
              salePrice: null,
              isActive: true,
              weight: null,
              length: null,
              width: null,
              height: null,
              attributes: [{ attributeType: "", attributeValue: "" }],
            },
          ],
        },
  });

  const {
    fields: variantFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const onFormSubmit = async (data) => {
    setSubmitError(null);
    try {
      // Clean up data before submission
      const cleanedData = {
        ...data,
        variants: data.variants.map((variant) => ({
          ...variant,
          salePrice: variant.salePrice && variant.salePrice > 0 ? variant.salePrice : null,
          weight: variant.weight && variant.weight > 0 ? variant.weight : null,
          length: variant.length && variant.length > 0 ? variant.length : null,
          width: variant.width && variant.width > 0 ? variant.width : null,
          height: variant.height && variant.height > 0 ? variant.height : null,
        })),
      };
      await onSubmit(cleanedData);
      reset();
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to save product. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onFormError = (errors) => {
    console.log("errors", errors);
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    } else {
      toast.error("Please fix the form errors before submitting");
    }
    // Scroll to first error
    const firstErrorField = document.querySelector('[data-error="true"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const getFieldError = (fieldPath) => {
    const keys = fieldPath.split(".");
    let error = errors;
    for (const key of keys) {
      error = error?.[key];
      if (!error) return null;
    }
    return error?.message;
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="px-1 mx-auto space-y-6 w-full h-full"
    >
      {/* Error Alert */}
      {submitError && (
        <div className="flex gap-3 items-start p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <FaInfoCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {submitError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="p-6 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
          Basic Information
        </h3>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <CategorySelect
            categories={categories}
            value={watch("categoryId")}
            onChange={(value) => setValue("categoryId", value)}
            isDisabled={categoriesLoading}
          />
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            data-error={!!errors.name}
            className={`form-input w-full ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Brand
            </label>
            <input
              type="text"
              {...register("brand")}
              data-error={!!errors.brand}
              className={`form-input w-full ${
                errors.brand
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="Enter brand name"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              SKU Prefix <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("skuPrefix")}
              data-error={!!errors.skuPrefix}
              className={`form-input w-full ${
                errors.skuPrefix
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="e.g., ARD, RPI"
            />
            {errors.skuPrefix && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.skuPrefix.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            {...register("description")}
            data-error={!!errors.description}
            className={`form-textarea w-full ${
              errors.description
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            rows="4"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Specifications
          </label>
          <Controller
            name="specifications"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Enter product specifications"
                maxLength={100000}
                hasError={!!errors.specifications}
              />
            )}
          />
          {errors.specifications && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.specifications.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isActive")}
            id="isActive"
            className="w-4 h-4 form-checkbox"
          />
          <label
            htmlFor="isActive"
            className="block ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Product is active
          </label>
        </div>
      </div>

      {/* Variants Section */}
      <div className="p-6 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Product Variants
          </h3>
          {errors.variants && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.variants.message}
            </p>
          )}
        </div>

        {variantFields.map((variant, index) => (
          <div
            key={variant.id}
            className="p-5 space-y-4 bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900/30"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800 text-md dark:text-gray-200">
                Variant {index + 1}
              </h4>
              <div className="flex gap-3 items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`variants.${index}.isActive`)}
                    id={`variant-active-${index}`}
                    className="w-4 h-4 form-checkbox"
                  />
                  <label
                    htmlFor={`variant-active-${index}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Active
                  </label>
                </div>
                {variantFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 rounded transition-colors hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove variant"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register(`variants.${index}.sku`)}
                  data-error={!!getFieldError(`variants.${index}.sku`)}
                  className={`form-input w-full ${
                    getFieldError(`variants.${index}.sku`)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="e.g., ARD-001"
                />
                {getFieldError(`variants.${index}.sku`) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError(`variants.${index}.sku`)}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register(`variants.${index}.basePrice`, {
                    valueAsNumber: true,
                  })}
                  data-error={!!getFieldError(`variants.${index}.basePrice`)}
                  className={`form-input w-full ${
                    getFieldError(`variants.${index}.basePrice`)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="0.00"
                />
                {getFieldError(`variants.${index}.basePrice`) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError(`variants.${index}.basePrice`)}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sale Price (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variants.${index}.salePrice`, {
                    valueAsNumber: true,
                  })}
                  data-error={!!getFieldError(`variants.${index}.salePrice`)}
                  className={`form-input w-full ${
                    getFieldError(`variants.${index}.salePrice`)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Optional"
                />
                {getFieldError(`variants.${index}.salePrice`) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError(`variants.${index}.salePrice`)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variants.${index}.weight`, {
                    valueAsNumber: true,
                  })}
                  className="w-full form-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Length (cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variants.${index}.length`, {
                    valueAsNumber: true,
                  })}
                  className="w-full form-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Width (cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variants.${index}.width`, {
                    valueAsNumber: true,
                  })}
                  className="w-full form-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variants.${index}.height`, {
                    valueAsNumber: true,
                  })}
                  className="w-full form-input"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Attributes */}
            <VariantAttributes
              control={control}
              variantIndex={index}
              register={register}
              errors={errors}
              getFieldError={getFieldError}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              sku: "",
              basePrice: 0,
              salePrice: null,
              isActive: true,
              weight: null,
              length: null,
              width: null,
              height: null,
              attributes: [{ attributeType: "", attributeValue: "" }],
            })
          }
          className="inline-flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-violet-600 rounded-lg shadow-sm transition-colors md:w-auto hover:bg-violet-700"
        >
          <FaPlusCircle className="w-4 h-4" />
          Add Variant
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col gap-3 justify-end pt-4 border-t border-gray-200 sm:flex-row dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg shadow-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
