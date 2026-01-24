import React, { useState } from "react";
import { FiEdit, FiTrash2, FiExternalLink, FiImage } from "react-icons/fi";
import PermissionGuard from "../PermissionGuard";
import EmptyState from "../shared/EmptyState";

// Image component with loading and error states
const SlideImage = ({ src, alt, title }) => {
  const [imageState, setImageState] = useState("loading"); // loading, loaded, error

  return (
    <div className="overflow-hidden relative w-24 h-16 bg-gray-100 rounded-lg dark:bg-gray-700">
      {imageState === "loading" && (
        <div className="flex absolute inset-0 justify-center items-center">
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 animate-spin border-t-violet-500"></div>
        </div>
      )}
      {imageState === "error" && (
        <div className="flex absolute inset-0 flex-col justify-center items-center text-gray-400 dark:text-gray-500">
          <FiImage className="mb-1 w-6 h-6" />
          <span className="text-xs">No Image</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        title={title}
        className={`h-full w-full object-cover ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageState("loaded")}
        onError={() => setImageState("error")}
      />
    </div>
  );
};

const HeroSliderTable = ({ slides, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block w-8 h-8 rounded-full border-b-2 border-violet-500 animate-spin"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Loading hero slides...
        </p>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <EmptyState
        icon="image"
        title="No hero slides found"
        message="Get started by creating your first hero slide."
      />
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Image
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Link
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Sort Order
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {slides.map((slide) => (
              <tr
                key={slide.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <SlideImage
                    src={slide.imageUrl}
                    alt={slide.title}
                    title={slide.title}
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {slide.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {slide.link ? (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex gap-1 items-center text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      <span className="max-w-xs truncate">View Link</span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No link</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                  {slide.sortOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {slide.isPublished ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <PermissionGuard permission="hero_slider.update">
                      <button
                        onClick={() => onEdit(slide)}
                        className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission="hero_slider.delete">
                      <button
                        onClick={() => onDelete(slide.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </PermissionGuard>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeroSliderTable;

