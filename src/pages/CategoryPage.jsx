import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-hot-toast";
import {
  useGetCategoriesQuery,
  useMoveCategoryMutation,
  useDeleteCategoryMutation,
} from "../store/apis/categoryApi";
import CategoryTree from "../components/category/CategoryTree";
import CategoryForm from "../components/category/CategoryForm";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import CategorySearch from "../components/category/CategorySearch";
import { useSelector } from "react-redux";
import useCategory from "../hooks/useCategory";
import ToasterWrapper from "../layout/ToasterWrapper";

function CategoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const { categories } = useSelector((state) => state.category);
  const { categoriesLoading } = useCategory();

  const [moveCategory] = useMoveCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

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
      // Find the dragged category and target category
      const draggedCategory = categories.find((cat) => cat.id === draggedId);
      const targetCategory = categories.find((cat) => cat.id === targetId);

      // Prevent dropping a parent onto its own child
      const isTargetChildOfDragged = (target) => {
        if (!target) return false;
        if (target.id === draggedId) return true;
        return target.children?.some((child) => isTargetChildOfDragged(child));
      };

      if (isTargetChildOfDragged(targetCategory)) {
        toast.error("Cannot move a category into its own child category");
        return;
      }

      await moveCategory({ draggedId, targetId }).unwrap();
      toast.success("Category moved successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to move category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete category");
    }
  };

  return (
    <ToasterWrapper>
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

              {categoriesLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                    <DndProvider backend={HTML5Backend}>
                      <CategoryTree
                        categories={filteredCategories}
                        onDrop={handleDrop}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    </DndProvider>
                  </div>

                  {isFormOpen && (
                    <div className="col-span-full xl:col-span-4">
                      <CategoryForm
                        category={selectedCategory}
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
    </ToasterWrapper>
  );
}

export default CategoryPage;
