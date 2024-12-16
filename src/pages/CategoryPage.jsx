import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-hot-toast";
import {
  useGetCategoriesQuery,
  useMoveCategoryMutation,
} from "../store/apis/categoryApi";
import CategoryTree from "../components/category/CategoryTree";
import CategoryForm from "../components/category/CategoryForm";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import CategorySearch from "../components/category/CategorySearch";

function CategoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [moveCategory] = useMoveCategoryMutation();

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories || []);
      return;
    }

    const filtered = (categories || []).filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.children?.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleDrop = async (draggedId, targetId) => {
    try {
      await moveCategory({ draggedId, targetId }).unwrap();
      toast.success("Category moved successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to move category");
    }
  };

  const handleEdit = (category) => {
    // if (isFormOpen) {
    //   setIsFormOpen(false)
    // }
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Categories
                </h1>
              </div>

              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <CategorySearch onSearch={setSearchTerm} />
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsFormOpen(true);
                  }}
                  className="btn bg-violet-500 hover:bg-violet-600 text-white"
                >
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Add Category</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                  <DndProvider backend={HTML5Backend}>
                    <CategoryTree
                      categories={filteredCategories}
                      onDrop={handleDrop}
                      onEdit={handleEdit}
                    />
                  </DndProvider>
                </div>

                {isFormOpen && (
                  <div className="col-span-full xl:col-span-4">
                    <CategoryForm
                      category={selectedCategory}
                      parentCategories={(categories || []).filter(
                        (c) => c.level === 0
                      )}
                      onClose={() => {
                        setIsFormOpen(false);
                        setSelectedCategory(null);
                      }}
                      onSubmit={() => {
                        setIsFormOpen(false);
                        setSelectedCategory(null);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CategoryPage;
