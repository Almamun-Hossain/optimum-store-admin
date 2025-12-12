import React, { useEffect } from "react";
import { useGetCategoriesQuery } from "../store/apis/categoryApi";
import { useDispatch } from "react-redux";
import { setCategories } from "../store/slices/categorySlice";

const useCategory = () => {
  const {
    data: categoryQueryData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryQueryData && !categoriesLoading && !categoriesError) {
      // Create a map for quick lookup
      const categoryMap = new Map();
      categoryQueryData.forEach((category) => {
        categoryMap.set(category.id, category);
      });

      // Track the current path to detect circular references
      const buildCategoryTree = (category, path = new Set(), depth = 0) => {
        // Prevent infinite recursion - check if this category is already in the path
        if (path.has(category.id)) {
          console.warn(
            `Circular reference detected for category ${category.id}: ${category.name}. Breaking cycle.`
          );
          return {
            ...category,
            children: [],
          };
        }

        // Prevent too deep nesting (safety check)
        if (depth > 100) {
          console.warn(
            `Category tree too deep for category ${category.id}: ${category.name}`
          );
          return {
            ...category,
            children: [],
          };
        }

        // Add current category to path
        const newPath = new Set(path);
        newPath.add(category.id);

        try {
          const children = category.children
            ?.map((child) => {
              // If child is just an ID, look it up
              const childId =
                typeof child === "object" ? child.id : child;
              const completeChild = categoryMap.get(childId);

              if (!completeChild) {
                return null;
              }

              // Recursively build child tree with updated path
              return buildCategoryTree(completeChild, newPath, depth + 1);
            })
            .filter(Boolean) || [];

          return {
            ...category,
            children,
          };
        } catch (error) {
          console.error(
            `Error building tree for category ${category.id}:`,
            error
          );
          return {
            ...category,
            children: [],
          };
        }
      };

      // Only build trees for root categories (categories without parentId)
      const rootCategories = categoryQueryData.filter(
        (category) => !category.parentId
      );

      // If no root categories found, check if all categories have parentId
      // In that case, the data might be flat and we need to build the tree differently
      if (rootCategories.length === 0 && categoryQueryData.length > 0) {
        // Build tree from flat structure
        const categoryMapById = new Map();
        categoryQueryData.forEach((category) => {
          categoryMapById.set(category.id, {
            ...category,
            children: [],
          });
        });

        const rootCategoriesFromFlat = [];
        categoryQueryData.forEach((category) => {
          if (category.parentId) {
            const parent = categoryMapById.get(category.parentId);
            if (parent) {
              parent.children.push(categoryMapById.get(category.id));
            }
          } else {
            rootCategoriesFromFlat.push(categoryMapById.get(category.id));
          }
        });

        dispatch(setCategories(rootCategoriesFromFlat));
      } else {
        const completeCategories = rootCategories
          .map((category) => buildCategoryTree(category))
          .filter(Boolean);

        dispatch(setCategories(completeCategories));
      }
    }
    if (categoriesError) {
      console.log("categoriesError", categoriesError);
    }
  }, [categoryQueryData, categoriesLoading, categoriesError, dispatch]);

  return { categoriesLoading };
};

export default useCategory;
