import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import CategorySelect from "../category/CategorySelect";
import useCategory from "../../hooks/useCategory";

const productSchema = z.object({
  categoryId: z.number().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  skuPrefix: z.string().min(1, "SKU Prefix is required"),
  specifications: z.string().optional(),
  isActive: z.boolean().default(true),
  variants: z.array(
    z
      .object({
        id: z.number().optional(),
        sku: z.string().min(1, "SKU is required"),
        basePrice: z.number().min(0, "Base Price is required"),
        salePrice: z
          .number()
          .min(0, "Sale Price must be 0 or greater")
          .optional()
          .nullable(),
        isActive: z.boolean().default(true),
        weight: z.number().optional(),
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        attributes: z.array(
          z.object({
            id: z.number().optional(),
            attributeType: z.string().min(1, "Attribute Type is required"),
            attributeValue: z.string().min(1, "Attribute Value is required"),
          })
        ),
      })
      .refine(
        (data) => {
          // If salePrice is 0, null, or undefined, it's valid
          if (!data.salePrice) return true;
          // Check if salePrice is less than or equal to basePrice
          return data.salePrice < data.basePrice;
        },
        {
          message: "Sale price cannot be greater than base price",
          path: ["salePrice"], // This will make the error show up on the salePrice field
        }
      )
  ),
});

const ProductForm = ({ product, onClose, onSubmit }) => {
  const { categories } = useSelector((state) => state.category);

  const { categoriesLoading } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          ...product,
          variants: product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            basePrice: variant.basePrice,
            salePrice: variant.salePrice || 0,
            isActive: variant.isActive,
            weight: variant.weight || 0,
            length: variant.length || 0,
            width: variant.width || 0,
            height: variant.height || 0,
            attributes: variant.attributes.map((attr) => ({
              id: attr.id,
              attributeType: attr.attributeType,
              attributeValue: attr.attributeValue,
            })),
          })),
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
              salePrice: 0,
              isActive: true,
              weight: 0,
              length: 0,
              width: 0,
              height: 0,
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
    try {
      await onSubmit(data);
      toast.success("Product added successfully!");
      reset();
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const onFormError = (error) => {
    console.log(error);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="w-full mx-auto space-y-4"
    >
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="categoryId"
        >
          Category
        </label>
        <CategorySelect
          categories={categories}
          value={watch("categoryId")}
          onChange={(value) => setValue("categoryId", value)}
          isDisabled={categoriesLoading}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Product Name
        </label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="brand"
          >
            Brand
          </label>
          <input
            type="text"
            {...register("brand")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="skuPrefix"
          >
            SKU Prefix
          </label>
          <input
            type="text"
            {...register("skuPrefix")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
          />
        </div>
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          {...register("description")}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="specifications"
        >
          Specifications
        </label>
        <textarea
          {...register("specifications")}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
          rows="3"
        ></textarea>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Active</label>
      </div>

      <h3 className="text-lg font-semibold text-gray-800">Variants</h3>
      {variantFields.map((variant, index) => (
        <div
          key={variant.id}
          className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50 space-y-4"
        >
          <div className="flex items-center gap-3">
            <h4 className="text-md font-semibold text-gray-800">
              Variant {index + 1}
            </h4>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register(`variants.${index}.isActive`)}
                className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.sku`}
              >
                SKU
              </label>
              <input
                type="text"
                {...register(`variants.${index}.sku`)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.sku && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.sku?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.basePrice`}
              >
                Base Price
              </label>
              <input
                type="number"
                {...register(`variants.${index}.basePrice`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.basePrice && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.basePrice?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.salePrice`}
              >
                Sale Price
              </label>
              <input
                type="number"
                {...register(`variants.${index}.salePrice`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.salePrice && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.salePrice?.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.weight`}
              >
                Weight (grams)
              </label>
              <input
                type="number"
                {...register(`variants.${index}.weight`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.weight && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.weight?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.length`}
              >
                Length (cm)
              </label>
              <input
                type="number"
                {...register(`variants.${index}.length`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.length && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.length?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.width`}
              >
                Width (cm)
              </label>
              <input
                type="number"
                {...register(`variants.${index}.width`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.width && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.width?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.height`}
              >
                Height (cm)
              </label>
              <input
                type="number"
                {...register(`variants.${index}.height`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.height && (
                <p className="text-red-500 text-sm">
                  {errors.variants?.[index]?.height?.message}
                </p>
              )}
            </div>
          </div>

          <h5 className="text-md font-semibold text-gray-800">Attributes</h5>
          {variant.attributes.map((attr, attrIndex) => (
            <div key={attrIndex} className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.attributes.${attrIndex}.attributeType`}
              >
                Attribute Type
              </label>
              <input
                type="text"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.attributeType`
                )}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.attributes?.[attrIndex]
                ?.attributeType && (
                <p className="text-red-500 text-sm">
                  {
                    errors.variants?.[index]?.attributes?.[attrIndex]
                      ?.attributeType?.message
                  }
                </p>
              )}
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`variants.${index}.attributes.${attrIndex}.attributeValue`}
              >
                Attribute Value
              </label>
              <input
                type="text"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.attributeValue`
                )}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300"
              />
              {errors.variants?.[index]?.attributes?.[attrIndex]
                ?.attributeValue && (
                <p className="text-red-500 text-sm">
                  {
                    errors.variants?.[index]?.attributes?.[attrIndex]
                      ?.attributeValue?.message
                  }
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => remove(index)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Remove Variant
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            sku: "",
            basePrice: 0,
            salePrice: 0,
            isActive: true,
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            attributes: [{ attributeType: "", attributeValue: "" }],
          })
        }
        className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700"
      >
        Add Variant
      </button>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400"
        >
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
