import React from "react";
import Modal from "react-modal";
import "../Modal/Modal.css";

const DeleteProductModal = ({ isOpen, onRequestClose, product, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Product Confirmation"
      className="modal_admin"
      overlayClassName="overlay_admin"
    >
      <h2>Confirm Deletion</h2>
      {product ? (
        <>
          <p>Are you sure you want to delete the following product?</p>
          <div>
            <strong>Product Name:</strong> {product.name || "N/A"}
          </div>
          <div>
            <strong>Description:</strong> {product.description || "N/A"}
          </div>
          <div>
            <strong>Cost:</strong> ${product.cost || "N/A"}
          </div>
          <div className="form-btn-del-admin">
            <button
              onClick={onDelete}
              className="btn-del-admin btn-outline-danger"
            >
              Delete
            </button>
            <button
              onClick={onRequestClose}
              className="btn-cancel-admin btn-outline-secondary"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>No product selected.</p>
      )}
    </Modal>
  );
};

export default DeleteProductModal;
