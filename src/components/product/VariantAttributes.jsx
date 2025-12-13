import React from "react";
import { useFieldArray } from "react-hook-form";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

/**
 * VariantAttributes - Component for managing variant attributes
 * This is a separate component to properly use useFieldArray hook
 */
const VariantAttributes = ({ control, variantIndex, register, errors, getFieldError }) => {
  const {
    fields: attributeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes`,
  });

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Attributes <span className="text-red-500">*</span>
        </h5>
        <button
          type="button"
          onClick={() => {
            append({
              attributeType: "",
              attributeValue: "",
            });
          }}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded transition-colors"
        >
          <FaPlusCircle className="h-4 w-4" />
          Add Attribute
        </button>
      </div>
      {attributeFields.map((attr, attrIndex) => (
        <div
          key={attr.id}
          className="flex gap-3 mb-3 items-start"
        >
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <input
              type="text"
              {...register(
                `variants.${variantIndex}.attributes.${attrIndex}.attributeType`
              )}
              data-error={
                !!getFieldError(
                  `variants.${variantIndex}.attributes.${attrIndex}.attributeType`
                )
              }
              className={`form-input w-full text-sm ${
                getFieldError(
                  `variants.${variantIndex}.attributes.${attrIndex}.attributeType`
                )
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="e.g., Color, Size"
            />
            {getFieldError(
              `variants.${variantIndex}.attributes.${attrIndex}.attributeType`
            ) && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {
                  getFieldError(
                    `variants.${variantIndex}.attributes.${attrIndex}.attributeType`
                  )
                }
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Value
            </label>
            <input
              type="text"
              {...register(
                `variants.${variantIndex}.attributes.${attrIndex}.attributeValue`
              )}
              data-error={
                !!getFieldError(
                  `variants.${variantIndex}.attributes.${attrIndex}.attributeValue`
                )
              }
              className={`form-input w-full text-sm ${
                getFieldError(
                  `variants.${variantIndex}.attributes.${attrIndex}.attributeValue`
                )
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="e.g., Red, Large"
            />
            {getFieldError(
              `variants.${variantIndex}.attributes.${attrIndex}.attributeValue`
            ) && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {
                  getFieldError(
                    `variants.${variantIndex}.attributes.${attrIndex}.attributeValue`
                  )
                }
              </p>
            )}
          </div>
          <div className="flex items-end pt-5">
            <button
              type="button"
              onClick={() => remove(attrIndex)}
              disabled={attributeFields.length <= 1}
              className={`p-2 rounded transition-colors ${
                attributeFields.length <= 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
              title="Remove attribute"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      {getFieldError(`variants.${variantIndex}.attributes`) && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {getFieldError(`variants.${variantIndex}.attributes`)}
        </p>
      )}
    </div>
  );
};

export default VariantAttributes;
