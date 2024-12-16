import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const productSchema = z.object({
    categoryId: z.number().min(1, "Category is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    brand: z.string().optional(),
    skuPrefix: z.string().min(1, "SKU Prefix is required"),
    specifications: z.string().optional(),
    isActive: z.boolean().default(true),
    variants: z.array(z.object({
        sku: z.string().min(1, "SKU is required"),
        basePrice: z.number().min(0, "Base Price is required"),
        salePrice: z.number().optional(),
        isActive: z.boolean().default(true),
        weight: z.number().optional(),
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        attributes: z.array(z.object({
            attributeType: z.string().min(1, "Attribute Type is required"),
            attributeValue: z.string().min(1, "Attribute Value is required"),
        })),
    })),
});

const renderCategories = (categories, expandedCategories, setExpandedCategories, level = 0) => {
    return categories.map((category) => {
        const isExpanded = expandedCategories.includes(category.id);
        return (
            <React.Fragment key={category.id}>
                <option value={category.id}>
                    {' '.repeat(level * 2)}{category.name}
                </option>
                {isExpanded && category.children && category.children.length > 0 && (
                    renderCategories(category.children, expandedCategories, setExpandedCategories, level + 1)
                )}
            </React.Fragment>
        );
    });
};

const ProductForm = ({ product, onClose, onSubmit }) => {
    const { categories } = useSelector(state => state.category);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const { register, handleSubmit, reset, control } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: product || {
            categoryId: 0,
            name: "",
            description: "",
            brand: "",
            skuPrefix: "",
            specifications: "",
            isActive: true,
            variants: [{ sku: "", basePrice: 0, salePrice: 0, isActive: true, weight: 0, length: 0, width: 0, height: 0, attributes: [{ attributeType: "", attributeValue: "" }] }],
        },
    });

    const { fields: variantFields, append, remove } = useFieldArray({
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

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="w-full mx-auto space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="categoryId">Category</label>
                <select {...register("categoryId")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300">
                    <option value="">Select a category</option>
                    {renderCategories(categories.filter(cat => !cat.parentId), expandedCategories, setExpandedCategories)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Product Name</label>
                <input type="text" {...register("name")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                <textarea {...register("description")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" rows="3"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="brand">Brand</label>
                <input type="text" {...register("brand")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="skuPrefix">SKU Prefix</label>
                <input type="text" {...register("skuPrefix")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="specifications">Specifications</label>
                <textarea {...register("specifications")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" rows="3"></textarea>
            </div>
            <div className="flex items-center">
                <input type="checkbox" {...register("isActive")} className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500" />
                <label className="ml-2 block text-sm text-gray-700">Active</label>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">Variants</h3>
            {variantFields.map((variant, index) => (
                <div key={variant.id} className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                    <h4 className="text-md font-semibold text-gray-800">Variant {index + 1}</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.sku`}>SKU</label>
                        <input type="text" {...register(`variants.${index}.sku`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.basePrice`}>Base Price</label>
                        <input type="number" {...register(`variants.${index}.basePrice`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.salePrice`}>Sale Price</label>
                        <input type="number" {...register(`variants.${index}.salePrice`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" {...register(`variants.${index}.isActive`)} className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500" />
                        <label className="ml-2 block text-sm text-gray-700">Active</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.weight`}>Weight</label>
                        <input type="number" {...register(`variants.${index}.weight`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.length`}>Length</label>
                        <input type="number" {...register(`variants.${index}.length`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.width`}>Width</label>
                        <input type="number" {...register(`variants.${index}.width`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.height`}>Height</label>
                        <input type="number" {...register(`variants.${index}.height`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                    </div>

                    <h5 className="text-md font-semibold text-gray-800">Attributes</h5>
                    {variant.attributes.map((attr, attrIndex) => (
                        <div key={attrIndex}>
                            <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.attributes.${attrIndex}.attributeType`}>Attribute Type</label>
                            <input type="text" {...register(`variants.${index}.attributes.${attrIndex}.attributeType`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                            <label className="block text-sm font-medium text-gray-700" htmlFor={`variants.${index}.attributes.${attrIndex}.attributeValue`}>Attribute Value</label>
                            <input type="text" {...register(`variants.${index}.attributes.${attrIndex}.attributeValue`)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300" />
                        </div>
                    ))}
                    <button type="button" onClick={() => remove(index)} className="mt-2 text-red-600 hover:text-red-800">Remove Variant</button>
                </div>
            ))}
            <button type="button" onClick={() => append({ sku: "", basePrice: 0, salePrice: 0, isActive: true, weight: 0, length: 0, width: 0, height: 0, attributes: [{ attributeType: "", attributeValue: "" }] })} className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700">
                Add Variant
            </button>

            <div className="flex justify-between">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400">Close</button>
                <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700">Save</button>
            </div>
        </form>
    );
};

export default ProductForm; 