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
      const findCompleteCategories = (id) =>
        categoryQueryData.find((category) => category.id === id);

      const buildCategoryTree = (category) => {
        return {
          ...category,
          children:
            category.children
              ?.map((child) => {
                const completeChild = findCompleteCategories(child.id);
                return completeChild ? buildCategoryTree(completeChild) : null;
              })
              .filter(Boolean) || [],
        };
      };

      const completeCategories = categoryQueryData.map((category) =>
        buildCategoryTree(category)
      );

      dispatch(setCategories(completeCategories));
    }
    if (categoriesError) {
      console.log("categoriesError", categoriesError);
    }
  }, [categoryQueryData, categoriesLoading, categoriesError, dispatch]);

  return { categoriesLoading };
};

export default useCategory;
