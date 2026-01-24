import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetHeroSlidesQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} from "../store/apis/heroSliderApi";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/shared/SearchBar";
import FilterPanel from "../components/shared/FilterPanel";
import Pagination from "../components/shared/Pagination";
import HeroSliderTable from "../components/heroSlider/HeroSliderTable";
import HeroSliderForm from "../components/heroSlider/HeroSliderForm";
import GlobalModal from "../components/GlobalModal";
import ToasterWrapper from "../layout/ToasterWrapper";
import PermissionGuard from "../components/PermissionGuard";
import EmptyState from "../components/shared/EmptyState";

function HeroSliderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    isPublished: "",
    sortBy: "sortOrder",
    sortOrder: "asc",
  });

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: filters.sortBy || "sortOrder",
      sortOrder: filters.sortOrder || "asc",
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filters.isPublished !== "") {
      params.isPublished = filters.isPublished === "true";
    }

    return params;
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  // Fetch hero slides
  const {
    data: { slides = [], meta = {} } = {},
    isLoading,
    isError,
    refetch,
  } = useGetHeroSlidesQuery(queryParams);

  const [createSlide, { isLoading: isCreating }] = useCreateHeroSlideMutation();
  const [updateSlide, { isLoading: isUpdating }] = useUpdateHeroSlideMutation();
  const [deleteSlide, { isLoading: isDeleting }] = useDeleteHeroSlideMutation();

  const handleCreate = () => {
    setSelectedSlide(null);
    setIsFormOpen(true);
  };

  const handleEdit = (slide) => {
    setSelectedSlide(slide);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hero slide?")) {
      try {
        toast.loading("Deleting hero slide...", { id: "delete-slide" });
        await deleteSlide(id).unwrap();
        toast.dismiss("delete-slide");
        toast.success("Hero slide deleted successfully");
        refetch();
      } catch (error) {
        toast.dismiss("delete-slide");
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          error?.message ||
          "Failed to delete hero slide";
        toast.error(errorMessage);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSlide) {
        toast.loading("Updating hero slide...", { id: "update-slide" });
        await updateSlide({ id: selectedSlide.id, formData }).unwrap();
        toast.dismiss("update-slide");
        toast.success("Hero slide updated successfully");
      } else {
        toast.loading("Creating hero slide...", { id: "create-slide" });
        await createSlide(formData).unwrap();
        toast.dismiss("create-slide");
        toast.success("Hero slide created successfully");
      }
      setIsFormOpen(false);
      setSelectedSlide(null);
      refetch();
    } catch (error) {
      toast.dismiss("update-slide");
      toast.dismiss("create-slide");
      const errorMessage =
        error?.data?.error ||
        error?.data?.message ||
        error?.message ||
        "Failed to save hero slide";
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      isPublished: "",
      sortBy: "sortOrder",
      sortOrder: "asc",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.isPublished !== "" ||
      filters.sortBy !== "sortOrder" ||
      filters.sortOrder !== "asc" ||
      searchTerm !== ""
    );
  }, [filters, searchTerm]);

  // Filter configuration
  const filterConfig = [
    {
      key: "isPublished",
      type: "boolean",
      label: "Published Status",
    },
    {
      key: "sortBy",
      type: "select",
      label: "Sort By",
      options: [
        { value: "sortOrder", label: "Sort Order" },
        { value: "title", label: "Title" },
        { value: "createdAt", label: "Date Created" },
        { value: "updatedAt", label: "Last Updated" },
        { value: "isPublished", label: "Published Status" },
      ],
    },
    {
      key: "sortOrder",
      type: "select",
      label: "Sort Direction",
      options: [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <ToasterWrapper>
        <div className="flex overflow-hidden h-screen">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex overflow-y-auto overflow-x-hidden relative flex-col flex-1">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 py-8 mx-auto w-full sm:px-6 lg:px-8 max-w-9xl">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-violet-500 animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading hero slides...
                    </p>
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
        <div className="flex overflow-hidden h-screen">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex overflow-y-auto overflow-x-hidden relative flex-col flex-1">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 py-8 mx-auto w-full sm:px-6 lg:px-8 max-w-9xl">
                <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <p className="mb-2 font-medium text-red-800 dark:text-red-300">
                    Error loading hero slides
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
      <div className="flex overflow-hidden h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex overflow-y-auto overflow-x-hidden relative flex-col flex-1">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 py-8 mx-auto w-full sm:px-6 lg:px-8 max-w-9xl">
              <div className="mb-8 sm:flex sm:justify-between sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                  Hero Slider
                </h1>
                <PermissionGuard permission="hero_slider.create">
                  <button
                    onClick={handleCreate}
                    className="mt-4 text-white bg-violet-500 btn hover:bg-violet-600 sm:mt-0"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Hero Slide</span>
                  </button>
                </PermissionGuard>
              </div>

              <div className="mb-4">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search hero slides by title..."
                />
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filterConfig={filterConfig}
                title="Filters"
                defaultOpen={false}
              />

              {!isLoading && slides && slides.length > 0 ? (
                <>
                  <HeroSliderTable
                    slides={slides}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
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
                  icon="image"
                  title={
                    hasActiveFilters
                      ? "No hero slides match your filters"
                      : "No hero slides found"
                  }
                  message={
                    hasActiveFilters
                      ? "Try adjusting your filters or search terms to find what you're looking for."
                      : "Get started by creating your first hero slide."
                  }
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              ) : null}

              <GlobalModal
                isOpen={isFormOpen}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedSlide(null);
                }}
                title={selectedSlide ? "Edit Hero Slide" : "Create Hero Slide"}
                className="w-full max-w-2xl"
              >
                <HeroSliderForm
                  slide={selectedSlide}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedSlide(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              </GlobalModal>
            </div>
          </main>
        </div>
      </div>
    </ToasterWrapper>
  );
}

export default HeroSliderPage;

