import React, { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const CategorySelect = ({
  categories,
  value,
  onChange,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const dropdownRef = useRef(null);

  const selectedCategory = categories.find((cat) => cat.id === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const parentIds = getParentIds(categories, value);
      setExpandedCategories((prev) => [...new Set([...prev, ...parentIds])]);
    }
  }, [value, categories]);

  const toggleCategory = (categoryId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelect = (categoryId) => {
    onChange(categoryId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filterCategories = (categories) => {
    if (!searchTerm) return categories;

    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const hasMatchingChildren = category.children?.some((child) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Also check if any parent category matches
      const hasMatchingParent =
        category.parent &&
        category.parent.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch || hasMatchingChildren || hasMatchingParent;
    });
  };

  const renderCategories = (categories, level = 0) => {
    return filterCategories(categories).map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.includes(category.id);

      return (
        <React.Fragment key={category.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 
              ${value === category.id ? "bg-violet-50" : ""}`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => handleSelect(category.id)}
          >
            {hasChildren && (
              <button
                type="button"
                className="mr-2 text-gray-500 hover:text-gray-700"
                onClick={(e) => toggleCategory(category.id, e)}
              >
                {isExpanded ? (
                  <FaChevronDown className="w-3 h-3" />
                ) : (
                  <FaChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            <span className="flex-1">{category.name}</span>
          </div>
          {hasChildren &&
            isExpanded &&
            renderCategories(category.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const getParentIds = (categories, categoryId) => {
    const parentIds = [];
    let currentCategory = categories.find((cat) => cat.id === categoryId);

    while (currentCategory && currentCategory.parentId) {
      parentIds.push(currentCategory.parentId);
      currentCategory = categories.find(
        (cat) => cat.id === currentCategory.parentId
      );
    }

    return parentIds;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`form-input w-full flex items-center ${
          isDisabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
        }`}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
      >
        <span className={`flex-1 ${isDisabled ? "text-gray-500" : ""}`}>
          {selectedCategory ? selectedCategory.name : "Select a category"}
        </span>
        <FaChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${isDisabled ? "text-gray-400" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white border-b p-2">
            <input
              type="text"
              className="form-input w-full"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="py-1">
            {renderCategories(categories.filter((cat) => !cat.parentId))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
