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
import { FaFolderOpen, FaInfoCircle, FaGripVertical } from "react-icons/fa";
import PermissionGuard from "../components/PermissionGuard";

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
      // If targetId is null, we're moving to root - no need to check for circular references
      if (targetId === null) {
        await moveCategory({ draggedId, targetId: null }).unwrap();
        toast.success("Category moved to root level successfully");
        return;
      }

      // Find the dragged category and target category
      const draggedCategory = categories.find((cat) => cat.id === draggedId);
      const targetCategory = categories.find((cat) => cat.id === targetId);

      // Prevent dropping onto itself
      if (draggedId === targetId) {
        toast.error("Cannot move a category onto itself");
        return;
      }

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

  const getTotalCategoriesCount = (cats) => {
    let count = 0;
    const countRecursive = (items) => {
      items.forEach((item) => {
        count++;
        if (item.children?.length > 0) {
          countRecursive(item.children);
        }
      });
    };
    countRecursive(cats);
    return count;
  };

  const totalCategories = getTotalCategoriesCount(filteredCategories);
  const hasResults = filteredCategories.length > 0;
  const showEmptyState = !categoriesLoading && !hasResults && !searchTerm;
  const showNoResults = !categoriesLoading && !hasResults && searchTerm;

  return (
    <ToasterWrapper>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                      Categories
                    </h1>
                    {!categoriesLoading && categories && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? `${totalCategories} result${totalCategories !== 1 ? "s" : ""} found`
                          : `${getTotalCategoriesCount(categories)} total categor${getTotalCategoriesCount(categories) !== 1 ? "ies" : "y"}`}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-64">
                      <CategorySearch onSearch={setSearchTerm} />
                    </div>
                    <PermissionGuard permission="categories.create">
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setIsFormOpen(true);
                        }}
                        className="btn bg-violet-500 hover:bg-violet-600 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <svg
                          className="w-4 h-4 fill-current shrink-0"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span>Add Category</span>
                      </button>
                    </PermissionGuard>
                  </div>
                </div>

                {/* Helpful Info Banner */}
                {!categoriesLoading && hasResults && (
                  <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-3 flex items-start gap-3">
                    <FaInfoCircle className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-violet-800 dark:text-violet-200">
                        <span className="font-medium">Tip:</span> Drag and drop
                        categories to reorganize them. Drop nested categories into
                        the root drop zone to make them root-level categories.
                        Categories with products cannot be deleted.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {categoriesLoading ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Loading categories...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Category Tree Section */}
                  <div
                    className={`${
                      isFormOpen
                        ? "lg:col-span-7 xl:col-span-8"
                        : "lg:col-span-12 xl:col-span-12"
                    } transition-all duration-300`}
                  >
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Tree Header */}
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <FaGripVertical className="text-gray-400" />
                            Category Structure
                          </h2>
                          {searchTerm && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              Search: "{searchTerm}"
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tree Content */}
                      <div className="p-6 min-h-[400px]">
                        {showEmptyState ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                              <FaFolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                              No categories yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                              Get started by creating your first category. You
                              can organize them hierarchically and drag to
                              reorder.
                            </p>
                            <button
                              onClick={() => {
                                setSelectedCategory(null);
                                setIsFormOpen(true);
                              }}
                              className="btn bg-violet-500 hover:bg-violet-600 text-white"
                            >
                              <svg
                                className="w-4 h-4 fill-current shrink-0"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                              </svg>
                              <span className="ml-2">Create First Category</span>
                            </button>
                          </div>
                        ) : showNoResults ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                              <FaFolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                              No results found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                              No categories match your search term "
                              <span className="font-medium">{searchTerm}</span>
                              ". Try a different search term.
                            </p>
                            <button
                              onClick={() => setSearchTerm("")}
                              className="btn border-gray-200 hover:border-gray-300 text-gray-600 dark:text-gray-300"
                            >
                              Clear Search
                            </button>
                          </div>
                        ) : (
                          <DndProvider backend={HTML5Backend}>
                            <CategoryTree
                              categories={filteredCategories}
                              onDrop={handleDrop}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              isDeleting={isDeleting}
                            />
                          </DndProvider>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category Form Section */}
                  {isFormOpen && (
                    <div className="lg:col-span-5 xl:col-span-4 animate-in slide-in-from-right duration-300">
                      <div className="sticky top-6">
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
