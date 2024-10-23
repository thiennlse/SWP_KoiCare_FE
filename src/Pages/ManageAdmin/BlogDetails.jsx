import React from "react";

const BlogDetails = ({ blog }) => {
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
    </div>
  );
};

export default BlogDetails;
