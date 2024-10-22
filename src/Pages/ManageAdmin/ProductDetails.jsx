import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="product-details">
      <h2>Product Details</h2>
      <img src={product.image} alt={product.name} className="product-image" />
      <p>
        <strong>Name:</strong> {product.name}
      </p>
      <p>
        <strong>Cost:</strong> ${product.cost}
      </p>
      <p>
        <strong>Description:</strong> {product.description}
      </p>
      <p>
        <strong>Origin:</strong> {product.origin}
      </p>
      <p>
        <strong>Productivity:</strong> {product.productivity}
      </p>
      <p>
        <strong>Code:</strong> {product.code}
      </p>
      <p>
        <strong>In Stock:</strong> {product.inStock}
      </p>
    </div>
  );
};

export default ProductDetails;
