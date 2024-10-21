import React, { useState, useEffect } from "react";

const EditBlogForm = ({ blog, onClose, onUpdateBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setTitle(blog.title);
    setContent(blog.content);
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      const updatedBlog = { ...blog, title, content };
      onUpdateBlog(updatedBlog);
      onClose(); // Close the modal after updating
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Blog</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Update Blog</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditBlogForm;
