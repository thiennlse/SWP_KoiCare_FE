import React, { useState, useEffect } from "react";
// import "./BlogForm.css";

const BlogForm = ({ blog, onSubmit, closeModal }) => {
  const [formData, setFormData] = useState({
    memberId: 0,
    title: "",
    image: "",
    content: "",
    dateOfPublish: new Date().toISOString().split("T")[0],
    status: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        ...blog,
        dateOfPublish: blog.dateOfPublish.split("T")[0],
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      memberId: JSON.parse(localStorage.getItem("userId")) || 0,
    };
    onSubmit(submitData);
    if (closeModal) closeModal();
  };

  return (
    <div className="blog-form-container">
      <h3>{blog ? "Edit Blog" : "Create New Blog"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Publish:</label>
          <input
            type="date"
            name="dateOfPublish"
            value={formData.dateOfPublish}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">{blog ? "Update Blog" : "Create Blog"}</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
