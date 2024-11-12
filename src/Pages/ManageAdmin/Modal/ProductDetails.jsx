import React from "react";
import "./Modal.css";

const ProductDetails = ({ product, onClose }) => {
  return (
    <div className="modal-content-wrapper">
      <div className="modal-scroll-content">
        <h2>Product Details</h2>
        <div className="details-grid">
          <div className="details-text">
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Cost:</strong> {product.cost} VND
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
              <strong>In Stock:</strong> {product.inStock}
            </p>
          </div>
          <div className="details-image">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn-close-admin" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
