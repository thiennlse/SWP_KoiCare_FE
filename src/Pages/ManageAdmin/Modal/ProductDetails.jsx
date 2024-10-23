import React from "react";

const ProductDetails = ({ product, onClose }) => {
  return (
    <div className="product-details-admin">
      <h2>Product Details</h2>
      <p>
        <strong>Name:</strong> {product.name}
      </p>
      <p>
        <strong>Image:</strong>{" "}
      </p>
      <img src={product.image} alt={product.name} className="product-image" />
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
      <button className="btn-close-admin" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default ProductDetails;
