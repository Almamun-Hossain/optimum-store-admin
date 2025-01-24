import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FaEdit,
  FaTrash,
  FaChevronRight,
  FaChevronDown,
  FaSpinner,
} from "react-icons/fa";

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
    <div ref={drop}>
      <div
        ref={drag}
        className={`flex items-center p-2 ${isDragging ? "opacity-50" : ""} ${
          isOver ? "bg-violet-100 dark:bg-violet-900/20" : ""
        } hover:bg-gray-50 dark:hover:bg-gray-700/20 rounded-lg cursor-move`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>
        )}

        <div className="flex-1">
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {category.name}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            ({category._count?.products || 0} products)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="p-1 hover:text-violet-500"
            title="Edit category"
            disabled={isDeleting}
          >
            <FaEdit />
          </button>
          {hasNoChildrenAndProducts && (
            <button
              onClick={() => onDelete(category.id)}
              className="p-1 hover:text-red-500"
              title="Delete category"
              disabled={isDeleting}
            >
              {isDeleting ? <FaSpinner /> : <FaTrash />}
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children.map((child) => (
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

  return (
    <div className="p-4">
      {categories
        .filter((category) => !category.parentId)
        .map((category) => renderCategoryItem(category, 0))}
    </div>
  );
}

export default CategoryTree;
