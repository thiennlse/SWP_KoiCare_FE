import React, { useState, useEffect } from "react";

const BlogForm = ({ blog, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
    dateOfPubl: "",
    author: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData(blog);
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <h2>{blog ? "Edit Blog" : "Create Blog"}</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Blog Title"
        required
      />
      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Blog Content"
        required
      ></textarea>
      <input
        type="date"
        name="dateOfPubl"
        value={formData.dateOfPubl}
        onChange={handleChange}
        placeholder="Date of Publication"
        required
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <button type="submit">{blog ? "Update Blog" : "Create Blog"}</button>
    </form>
  );
};

export default BlogForm;
