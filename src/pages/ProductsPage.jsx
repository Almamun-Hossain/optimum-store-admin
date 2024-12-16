import React, { useState, startTransition, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { setCategories } from "../store/slices/categorySlice";
import { useGetCategoriesQuery } from "../store/apis/categoryApi";

function ProductsPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data: { products, meta } = {}, isLoading, isError } = useGetProductsQuery();
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();

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
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedProduct) {
                await updateProduct({ id: selectedProduct.id, ...data }).unwrap();
                toast.success("Product updated successfully");
            } else {
                await createProduct(data).unwrap();
                toast.success("Product created successfully");
            }
            setIsFormOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error("Error submitting product");
        }
    };

    const handleOpenModal = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };
    const handleCloseModal = () => {
        setIsFormOpen(false);
        setSelectedProduct(null);
    }


    useEffect(() => {
        dispatch(setCategories(categories));
    }, [categories]);

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    if (isError) {
        return <div className="text-center">Error loading products.</div>;
    }



    return (
        <div className="flex h-screen overflow-hidden ">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Products</h1>
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                <ProductSearch onSearch={setSearchTerm} />
                                <button
                                    onClick={handleOpenModal}
                                    className="btn bg-violet-500 hover:bg-violet-600 text-white"
                                >
                                    Add Product
                                </button>
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
                        <GlobalModal isOpen={isFormOpen} onClose={handleCloseModal} title={`${selectedProduct ? "Edit" : "Add new"} product`} className="w-full max-w-7xl">
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
    );
}

export default ProductsPage; 