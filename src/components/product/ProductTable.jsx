import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { RiFolderUploadFill } from "react-icons/ri";
import { TiEye } from "react-icons/ti";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import InventoryForm from "./InventoryForm";
import ImageUpload from "./ImageUpload";
import PermissionGuard from "../PermissionGuard";

const ProductTable = ({
  products = [],
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);
  const [isImageUploadFormOpen, setIsImageUploadFormOpen] = useState(false);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClickActionButton = (e, type, data) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data) return;
    if (type === "edit") {
      onEdit(data);
    } else if (type === "delete") {
      if (window.confirm(`Are you sure you want to delete "${data.name}"?`)) {
        onDelete(data.id);
      }
    } else if (type === "inventory") {
      setSelectedVariant(data);
      setIsInventoryFormOpen(true);
    } else if (type === "image") {
      setSelectedVariant(data);
      setIsImageUploadFormOpen(true);
    }
  };

  const getPriceRange = (product) => {
    if (!product.variants || product.variants.length === 0) return "N/A";
    const prices = product.variants.map(
      (variant) => variant.salePrice || variant.basePrice
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? `৳${maxPrice}` : `৳${minPrice} - ৳${maxPrice}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr
                  onClick={() => toggleRow(product.id)}
                  className={`cursor-pointer transition-colors ${
                    expandedRows[product.id]
                      ? "bg-violet-50 dark:bg-violet-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        className="mr-2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(product.id);
                        }}
                      >
                        {expandedRows[product.id] ? (
                          <FaChevronUp className="h-4 w-4" />
                        ) : (
                          <FaChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {getPriceRange(product)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <PermissionGuard permission="products.update">
                        <button
                          className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          onClick={(e) => handleClickActionButton(e, "edit", product)}
                          title="Edit"
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission="products.delete">
                        <button
                          className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          onClick={(e) =>
                            handleClickActionButton(e, "delete", product)
                          }
                          title="Delete"
                        >
                          <FaRegTrashCan className="h-4 w-4" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                </tr>
                {expandedRows[product.id] && (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 bg-gray-50 dark:bg-gray-900/30">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                SKU
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Attributes
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Base Price
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Sale Price
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Stock
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {product.variants?.map((variant) => (
                              <tr key={variant.id}>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                                  {variant.sku}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                                  {variant.attributes
                                    ?.map((attr) => attr.attributeValue)
                                    .join(", ") || "N/A"}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                                  ৳{variant.basePrice || "0"}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                                  {variant.salePrice ? `৳${variant.salePrice}` : "N/A"}
                                </td>
                                <td className="px-3 py-2">
                                  {variant.inventory === null ||
                                  variant.inventory?.quantityAvailable === 0 ? (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                      Out of Stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      {variant.inventory.quantityAvailable}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex gap-2">
                                    <PermissionGuard permission="inventory.view">
                                      <button
                                        className="p-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                                        onClick={(e) =>
                                          handleClickActionButton(
                                            e,
                                            "inventory",
                                            variant
                                          )
                                        }
                                        title="View Inventory"
                                      >
                                        <TiEye className="h-4 w-4" />
                                      </button>
                                    </PermissionGuard>
                                    <PermissionGuard permission="products.manage_images">
                                      <button
                                        className="p-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                                        onClick={(e) =>
                                          handleClickActionButton(e, "image", variant)
                                        }
                                        title="Upload Images"
                                      >
                                        <RiFolderUploadFill className="h-4 w-4" />
                                      </button>
                                    </PermissionGuard>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.category?.name || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <PermissionGuard permission="products.update">
                    <button
                      className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400"
                      onClick={(e) => handleClickActionButton(e, "edit", product)}
                      title="Edit"
                    >
                      <FiEdit3 className="h-4 w-4" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard permission="products.delete">
                    <button
                      className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      onClick={(e) => handleClickActionButton(e, "delete", product)}
                      title="Delete"
                    >
                      <FaRegTrashCan className="h-4 w-4" />
                    </button>
                  </PermissionGuard>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Price:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getPriceRange(product)}
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <button
                onClick={() => toggleRow(product.id)}
                className="w-full flex items-center justify-between text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 py-2"
              >
                <span>
                  {expandedRows[product.id] ? "Hide" : "Show"} Variants (
                  {product.variants?.length || 0})
                </span>
                {expandedRows[product.id] ? (
                  <FaChevronUp className="h-4 w-4" />
                ) : (
                  <FaChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedRows[product.id] && (
                <div className="mt-3 space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {product.variants?.map((variant) => (
                    <div
                      key={variant.id}
                      className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          SKU: {variant.sku}
                        </span>
                        {variant.inventory === null ||
                        variant.inventory?.quantityAvailable === 0 ? (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Stock: {variant.inventory.quantityAvailable}
                          </span>
                        )}
                      </div>
                      {variant.attributes?.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Attributes:</span>{" "}
                          {variant.attributes
                            .map((attr) => attr.attributeValue)
                            .join(", ")}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Base:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ৳{variant.basePrice || "0"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Sale:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {variant.salePrice ? `৳${variant.salePrice}` : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <PermissionGuard permission="inventory.view">
                          <button
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                            onClick={(e) =>
                              handleClickActionButton(e, "inventory", variant)
                            }
                          >
                            <TiEye className="h-3 w-3 inline mr-1" />
                            Inventory
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="products.manage_images">
                          <button
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                            onClick={(e) =>
                              handleClickActionButton(e, "image", variant)
                            }
                          >
                            <RiFolderUploadFill className="h-3 w-3 inline mr-1" />
                            Images
                          </button>
                        </PermissionGuard>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* Modals */}
      {selectedVariant && isInventoryFormOpen && (
        <InventoryForm
          isOpen={isInventoryFormOpen}
          onClose={() => {
            setIsInventoryFormOpen(false);
            setSelectedVariant(null);
          }}
          variant={selectedVariant}
          inventory={selectedVariant?.inventory}
        />
      )}
      {selectedVariant && isImageUploadFormOpen && (
        <ImageUpload
          isOpen={isImageUploadFormOpen}
          onClose={() => {
            setIsImageUploadFormOpen(false);
            setSelectedVariant(null);
          }}
          variant={selectedVariant}
        />
      )}
    </div>
  );
};

export default ProductTable;
