import React from "react";
import Modal from "react-modal";

const DeleteBlogModal = ({ isOpen, onRequestClose, blog, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Blog Confirmation"
      className="modal_admin"
      overlayClassName="overlay_admin"
    >
      <h2>Confirm Deletion</h2>
      {blog ? (
        <>
          <p>Are you sure you want to delete the following blog?</p>
          <div>
            <strong>Blog Title:</strong> {blog.title || "N/A"}
          </div>
          <div>
            <strong>Content:</strong> {blog.content || "N/A"}
          </div>
          <div className="form_buttons">
            <button onClick={onDelete} className="btn-admin btn-outline-danger">
              Delete
            </button>
            <button
              onClick={onRequestClose}
              className="btn-admin btn-outline-secondary"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>No blog selected.</p>
      )}
    </Modal>
  );
};

export default DeleteBlogModal;
