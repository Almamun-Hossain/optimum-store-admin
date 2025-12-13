import React, { useState, useMemo, startTransition } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../store/apis/productApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import ProductTable from "../components/product/ProductTable";
import ProductForm from "../components/product/ProductForm";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";
import EmptyState from "../components/shared/EmptyState";
import useCategory from "../hooks/useCategory";

function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    isActive: "",
    categoryId: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { categories } = useSelector((state) => state.category);
  const { categoriesLoading } = useCategory();

  // Flatten categories for filter dropdown
  const flattenCategories = (cats, level = 0) => {
    let result = [];
    cats?.forEach((cat) => {
      result.push({
        value: cat.id,
        label: "  ".repeat(level) + cat.name,
      });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };

  const categoryOptions = useMemo(() => {
    return flattenCategories(categories);
  }, [categories]);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: filters.sortBy || "createdAt",
      sortOrder: filters.sortOrder || "desc",
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filters.isActive !== "") {
      params.isActive = filters.isActive === "true";
    }

    if (filters.categoryId) {
      params.categoryId = Number(filters.categoryId);
    }

    if (filters.brand) {
      params.brand = filters.brand;
    }

    if (filters.minPrice) {
      params.minPrice = Number(filters.minPrice);
    }

    if (filters.maxPrice) {
      params.maxPrice = Number(filters.maxPrice);
    }

    return params;
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  const {
    data: { products, meta } = {},
    isLoading,
    isError,
  } = useGetProductsQuery(queryParams);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleEdit = (product) => {
    startTransition(() => {
      setSelectedProduct(product);
      setIsFormOpen(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      toast.loading("Deleting product...", { id: "delete-product" });
      await deleteProduct(id).unwrap();
      toast.dismiss("delete-product");
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.dismiss("delete-product");
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to delete product. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedProduct) {
        toast.loading("Updating product...", { id: "update-product" });
        await updateProduct({ id: selectedProduct.id, ...data }).unwrap();
        toast.dismiss("update-product");
        toast.success("Product updated successfully");
      } else {
        toast.loading("Creating product...", { id: "create-product" });
        await createProduct(data).unwrap();
        toast.dismiss("create-product");
        toast.success("Product created successfully");
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        selectedProduct
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.";
      toast.error(errorMessage);
    } finally {
      toast.dismiss("update-product");
      toast.dismiss("create-product");
    }
  };

  const handleOpenModal = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };
  const handleCloseModal = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      isActive: "",
      categoryId: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.isActive !== "" ||
      filters.categoryId !== "" ||
      filters.brand !== "" ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.sortBy !== "createdAt" ||
      filters.sortOrder !== "desc" ||
      searchTerm !== ""
    );
  }, [filters, searchTerm]);

  // Filter configuration
  const filterConfig = [
    {
      key: "isActive",
      type: "boolean",
      label: "Active Status",
    },
    {
      key: "categoryId",
      type: "select",
      label: "Category",
      options: categoryOptions,
    },
    {
      key: "brand",
      type: "text",
      label: "Brand",
      placeholder: "Filter by brand name",
    },
    {
      key: "minPrice",
      type: "number",
      label: "Min Price (৳)",
      placeholder: "0",
      min: 0,
      step: 0.01,
    },
    {
      key: "maxPrice",
      type: "number",
      label: "Max Price (৳)",
      placeholder: "100000",
      min: 0,
      step: 0.01,
    },
    {
      key: "sortBy",
      type: "select",
      label: "Sort By",
      options: [
        { value: "name", label: "Name" },
        { value: "price", label: "Price" },
        { value: "createdAt", label: "Date Created" },
        { value: "updatedAt", label: "Last Updated" },
        { value: "relevance", label: "Relevance" },
      ],
    },
    {
      key: "sortOrder",
      type: "select",
      label: "Sort Order",
      options: [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <ToasterWrapper>
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ToasterWrapper>
    );
  }

  if (isError) {
    return (
      <ToasterWrapper>
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                  <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                    Error loading products
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Please refresh the page or try again later.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ToasterWrapper>
    );
  }

  return (
    <ToasterWrapper>
      <div className="flex h-screen overflow-hidden ">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Products
                </h1>
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 mt-4 sm:mt-0">
                  <PermissionGuard permission="products.create">
                    <button
                      onClick={handleOpenModal}
                      className="btn bg-violet-500 hover:bg-violet-600 text-white"
                    >
                      Add Product
                    </button>
                  </PermissionGuard>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search products by name, description, or brand..."
                />
              </div>

              {/* Filter Panel */}
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filterConfig={filterConfig}
                title="Filters"
                defaultOpen={false}
              />

              {/* Products Table or Empty State */}
              {!isLoading && products && products.length > 0 ? (
                <>
                  <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  {meta?.totalPages > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta.totalPages}
                      totalItems={meta.total}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={(newLimit) => {
                        setItemsPerPage(newLimit);
                        setCurrentPage(1);
                      }}
                    />
                  )}
                </>
              ) : !isLoading ? (
                <EmptyState
                  icon="box"
                  title={hasActiveFilters ? "No products match your filters" : "No products found"}
                  message={hasActiveFilters ? "Try adjusting your filters or search terms to find what you're looking for." : "Get started by creating your first product."}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              ) : null}
              <GlobalModal
                isOpen={isFormOpen}
                onClose={handleCloseModal}
                title={`${selectedProduct ? "Edit" : "Add new"} product`}
                className="w-full max-w-7xl"
              >
                <ProductForm
                  product={selectedProduct}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmit}
                  isLoading={false}
                />
              </GlobalModal>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default ProductsPage;
