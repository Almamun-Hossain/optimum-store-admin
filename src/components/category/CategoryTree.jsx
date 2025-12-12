import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FaEdit,
  FaTrash,
  FaChevronRight,
  FaChevronDown,
  FaSpinner,
  FaGripVertical,
  FaFolder,
  FaFolderOpen,
  FaArrowUp,
  FaHome,
} from "react-icons/fa";
import PermissionGuard from "../PermissionGuard";

const CategoryItem = ({
  category,
  level = 0,
  onDrop,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasChildren = category.children?.length > 0;
  const hasNoChildrenAndProducts =
    !hasChildren && category._count?.products === 0;

  const [{ isDragging }, drag] = useDrag({
    type: "CATEGORY",
    item: { id: category.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "CATEGORY",
    drop: (item) => {
      if (item.id !== category.id) {
        onDrop(item.id, category.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="relative">
      {/* Visual connection line for nested items */}
      {level > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
          style={{ left: `${(level - 1) * 1.5 + 0.5}rem` }}
        />
      )}
      
      <div
        ref={drag}
        className={`group flex items-center gap-3 p-3 mb-1 rounded-lg border transition-all duration-200 ${
          isDragging
            ? "opacity-50 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/10"
            : isOver
            ? "border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-md"
            : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:shadow-sm"
        } cursor-move`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {/* Drag handle */}
        <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
          <FaGripVertical size={14} />
        </div>

        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <FaChevronDown size={14} />
            ) : (
              <FaChevronRight size={14} />
            )}
          </button>
        ) : (
          <div className="w-5" /> // Spacer for alignment
        )}

        {/* Folder icon */}
        <div className="text-violet-500 dark:text-violet-400">
          {hasChildren ? (
            isExpanded ? (
              <FaFolderOpen size={18} />
            ) : (
              <FaFolder size={18} />
            )
          ) : (
            <FaFolder size={18} className="opacity-60" />
          )}
        </div>

        {/* Category info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
              {category.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {category._count?.products || 0} product
              {(category._count?.products || 0) !== 1 ? "s" : ""}
            </span>
            {hasChildren && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">
                {category.children.length} subcategor
                {category.children.length !== 1 ? "ies" : "y"}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission="categories.update">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
              className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded transition-colors"
              title="Edit category"
              disabled={isDeleting}
            >
              <FaEdit size={14} />
            </button>
          </PermissionGuard>
          {hasNoChildrenAndProducts && (
            <PermissionGuard permission="categories.delete">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category.id);
                }}
                className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Delete category"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : (
                  <FaTrash size={14} />
                )}
              </button>
            </PermissionGuard>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1 relative">
          {category.children.map((child, index) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onDrop={onDrop}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Root Drop Zone Component
const RootDropZone = ({ onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "CATEGORY",
    drop: (item) => {
      // Move to root by passing null as targetId
      onDrop(item.id, null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`mb-4 p-5 rounded-xl border-2 border-dashed transition-all duration-300 ${
        isOver
          ? "border-violet-500 dark:border-violet-400 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/40 dark:to-violet-900/20 shadow-lg scale-[1.02]"
          : canDrop
          ? "border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10 hover:border-violet-400 dark:hover:border-violet-600"
          : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/20 hover:border-gray-400 dark:hover:border-gray-500"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div
          className={`transition-all duration-300 ${
            isOver
              ? "text-violet-600 dark:text-violet-400 scale-110"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isOver ? (
            <FaArrowUp className="w-7 h-7 animate-bounce" />
          ) : (
            <div className="relative">
              <FaHome className="w-6 h-6" />
              <FaArrowUp className="w-3 h-3 absolute -top-1 -right-1 text-violet-500" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-semibold transition-colors ${
              isOver
                ? "text-violet-700 dark:text-violet-300"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {isOver
              ? "Release to move to root level"
              : "Root Level Drop Zone"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isOver
              ? "This category will become a root category"
              : "Drag any nested category here to promote it to root level"}
          </p>
        </div>
      </div>
    </div>
  );
};

function CategoryTree({ categories, onDrop, onEdit, onDelete, isDeleting }) {
  const renderCategoryItem = (category, level = 0) => {
    return (
      <CategoryItem
        key={category.id}
        category={category}
        level={level}
        onDrop={onDrop}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    );
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  const rootCategories = categories.filter(
    (category) => !category.parentId
  );

  return (
    <div className="space-y-2">
      {/* Root Drop Zone - Always show when there are categories */}
      <RootDropZone onDrop={onDrop} />

      {/* Root Categories */}
      {rootCategories.length > 0 && (
        <div className="space-y-2">
          {rootCategories.map((category) => renderCategoryItem(category, 0))}
        </div>
      )}
    </div>
  );
}

export default CategoryTree;
