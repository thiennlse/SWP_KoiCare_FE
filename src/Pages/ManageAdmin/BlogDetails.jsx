import React from "react";

const BlogDetails = ({ blog }) => {
  return (
    <div className="blog-details">
      <h2>Blog Details</h2>
      <img src={blog.image} alt={blog.title} className="blog-image-admin" />
      <p>
        <strong>Title:</strong> {blog.title}
      </p>
      <p>
        <strong>Content:</strong> {blog.content}
      </p>
      <p>
        <strong>Date of Publication:</strong> {blog.dateOfPubl}
      </p>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
    </div>
  );
};

export default BlogDetails;
