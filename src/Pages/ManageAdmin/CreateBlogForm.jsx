import React, { useState } from "react";

const CreateBlogForm = ({ onClose, onCreateBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      const newBlog = { title, content };
      onCreateBlog(newBlog);
      onClose(); // Close the modal after creation
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Blog</h2>
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
      <button type="submit">Create Blog</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default CreateBlogForm;
