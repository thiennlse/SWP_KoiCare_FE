import React from "react";
import "./Modal.css";

const BlogDetails = ({ blog, onClose }) => {
  return (
    <div className="modal-content-wrapper">
      <div className="modal-scroll-content">
        <h2>Blog Details</h2>
        <div className="details-grid">
          <div className="details-text">
            <p>
              <strong>Title:</strong> {blog.title}
            </p>
            <p>
              <strong>Author:</strong> {blog.author}
            </p>
            <p>
              <strong>Content:</strong> {blog.content}
            </p>
            <p>
              <strong>Date:</strong> {new Date(blog.date).toLocaleDateString()}
            </p>
          </div>
          <div className="details-image">
            <img src={blog.image} alt={blog.title} className="blog-image" />
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

export default BlogDetails;
