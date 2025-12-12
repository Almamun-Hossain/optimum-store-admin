import React, { useState, startTransition } from "react";
import { toast } from "react-hot-toast";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../store/apis/productApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import ProductSearch from "../components/product/ProductSearch";
import ProductTable from "../components/product/ProductTable";
import ProductForm from "../components/product/ProductForm";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";

function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    data: { products, meta } = {},
    isLoading,
    isError,
  } = useGetProductsQuery();

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
      toast.error("Failed to delete product");
    } finally {
      toast.dismiss();
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
      toast.error("Error submitting product");
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

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center">Error loading products.</div>;
  }

  return (
    <ToasterWrapper>
      <div className="flex h-screen overflow-hidden ">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Products
                </h1>
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <ProductSearch onSearch={setSearchTerm} />
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
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={meta.total}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
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
