import React from "react";
import Modal from "react-modal";

const DeleteProductModal = ({ isOpen, onRequestClose, product, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Product Confirmation"
      className="modal_admin delete-modal-content"
      overlayClassName="overlay_admin"
    >
      <div className="delete-modal-header">
        <h2>Confirm Deletion</h2>
      </div>
      {product ? (
        <div className="delete-modal-body">
          <strong>
            Are you sure you want to delete the following product?
          </strong>
          <div className="delete-modal-details">
            <div>
              <strong>Product Name:</strong> {product.name || "N/A"}
            </div>
            <div>
              <strong>Description:</strong> {product.description || "N/A"}
            </div>
            <div>
              <strong>Cost:</strong> {product.cost || "N/A"} VND
            </div>
            {product.image && (
              <div className="product-image-preview">
                <img src={product.image} alt={product.name} />
              </div>
            )}
          </div>
          <div className="delete-modal-actions">
            <button className="delete-cancel-btn" onClick={onRequestClose}>
              Cancel
            </button>
            <button className="delete-confirm-btn" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p>No product selected.</p>
      )}
    </Modal>
  );
};

export default DeleteProductModal;
