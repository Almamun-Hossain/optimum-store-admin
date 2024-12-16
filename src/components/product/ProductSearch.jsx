import React from "react";

const ProductSearch = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => onSearch(e.target.value)}
            className="form-input"
        />
    );
};

export default ProductSearch; 