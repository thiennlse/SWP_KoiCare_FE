import React from "react";
import "../Modal/Modal.css";

const BlogDetails = ({ blog, onClose }) => {
  return (
    <div className="blog-details-admin">
      <h2>Blog Details</h2>
      <p>
        <strong>Title:</strong> {blog.title}
      </p>
      <p>
        <strong>Image:</strong>
      </p>
      <img src={blog.image} alt={blog.title} className="blog-image-admin" />
      <p>
        <strong>Content:</strong> {blog.content}
      </p>
      <p>
        <strong>Date of Publication:</strong> {blog.dateOfPublish}
      </p>
      <p>
        <strong>Status:</strong> {blog.status}
      </p>
      <button className="btn-close-admin" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default BlogDetails;
