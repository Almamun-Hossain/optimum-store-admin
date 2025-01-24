import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import InventoryForm from "./InventoryForm";

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      onDelete(data.id);
    } else if (type === "inventory") {
      setSelectedVariant(data);
      setIsInventoryFormOpen(true);
    }
  };

  const getPriceRange = (product) => {
    const minPrice = Math.min(
      ...product.variants.map(
        (variant) => variant.salePrice || variant.basePrice
      )
    );
    const maxPrice = Math.max(
      ...product.variants.map((variant) => variant.basePrice)
    );
    return minPrice === maxPrice ? `${maxPrice}` : `${minPrice} - ${maxPrice}`;
  };

  return (
    <div className="border shadow-md px-3 py-2 rounded-lg">
      <div className="flex justify-between mb-4">
        <div>
          <span>Show: </span>
          <select
            className="form-select"
            onChange={(e) => setItemsPerPage(e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <table className="min-w-full ">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-start">
              <input type="checkbox" />
            </th>
            <th className="p-2 text-start">Product</th>
            <th className="p-2 text-start">Category</th>
            <th className="p-2 text-start">Status</th>
            <th className="p-2 text-start">Price</th>
            <th className="p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <tr
                onClick={() => toggleRow(product.id)}
                className={`cursor-pointer hover:bg-gray-100 ${
                  expandedRows[product.id]
                    ? "bg-violet-400 text-white hover:text-gray-700"
                    : ""
                }`}
              >
                <td className="p-2">
                  <input type="checkbox" />
                </td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category.name}</td>
                <td className="p-2">
                  {product.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2">৳ {getPriceRange(product)}</td>
                <td className="p-2">
                  <button
                    className="text-gray-500 hover:text-gray-700 ml-2"
                    onClick={(e) => handleClickActionButton(e, "edit", product)}
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 ml-2"
                    onClick={(e) =>
                      handleClickActionButton(e, "delete", product)
                    }
                  >
                    <FaRegTrashCan />
                  </button>
                </td>
              </tr>
              {expandedRows[product.id] && (
                <tr>
                  <td colSpan="7" className="bg-gray-50">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-start">Variant SKU</th>
                          <th className="p-2 text-start">Attributes</th>
                          <th className="p-2 text-start">Base Price</th>
                          <th className="p-2 text-start">Sale Price</th>
                          <th className="p-2 text-start">Stock</th>
                          <th className="p-2 text-start">Inventory</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((variant) => (
                          <tr key={variant.id}>
                            <td className="p-2">{variant.sku}</td>
                            <td className="p-2">
                              {variant.attributes
                                .map((attr) => attr.attributeValue)
                                .join(", ")}
                            </td>
                            <td className="p-2">${variant.basePrice}</td>
                            <td className="p-2">
                              ${variant.salePrice || "N/A"}
                            </td>
                            <td className="p-2">
                              {variant.inventory === null ||
                              variant.inventory.quantityAvailable === 0 ? (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Out of Stock
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {variant.inventory.quantityAvailable}
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              <button
                                className="btn btn-sm bg-violet-600 text-white hover:bg-violet-700"
                                onClick={(e) =>
                                  handleClickActionButton(
                                    e,
                                    "inventory",
                                    variant
                                  )
                                }
                              >
                                Check
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn"
        >
          Next
        </button>
      </div>
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
    </div>
  );
};

export default ProductTable;
