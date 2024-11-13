import React from "react";
import Modal from "react-modal";

const DeleteBlogModal = ({ isOpen, onRequestClose, blog, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Blog Confirmation"
      className="modal_admin delete-modal-content"
      overlayClassName="overlay_admin"
    >
      <div className="delete-modal-header">
        <h2>Confirm Deletion</h2>
      </div>
      {blog ? (
        <div className="delete-modal-body">
          <strong>Are you sure you want to delete the following blog?</strong>
          <div className="delete-modal-details">
            <div>
              <strong>Blog Title:</strong> {blog.title || "N/A"}
            </div>
            <div className="content-preview">
              <strong>Content:</strong>
              <p>{blog.content || "N/A"}</p>
            </div>
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
        <p>No blog selected.</p>
      )}
    </Modal>
  );
};

export default DeleteBlogModal;
