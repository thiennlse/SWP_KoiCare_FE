import React from "react";

const BlogDetails = ({ blog, onClose }) => {
  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BlogDetails;
