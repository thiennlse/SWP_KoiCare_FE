import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import "./BlogForm.css";

const BlogForm = ({ blog, onSubmit, closeModal }) => {
  const [formData, setFormData] = useState({
    memberId: 0,
    title: "",
    image: "",
    content: "",
    dateOfPublish: new Date().toISOString().split("T")[0],
    status: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (blog) {
      setFormData({
        ...blog,
        dateOfPublish: blog.dateOfPublish.split("T")[0],
      });
      setPreviewImage(blog.image);
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (e) => {
    if (e.target.value === "0") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: 0,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);

        const imageResponse = await axiosInstance.post(
          "/api/Fish/upload",
          formDataImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = imageResponse.data.url;
      }

      const submitData = {
        ...formData,
        image: imageUrl,
        memberId: JSON.parse(localStorage.getItem("userId")) || 0,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
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
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Blog preview"
              style={{
                marginTop: "10px",
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          )}
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
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="status-select"
          >
            <option value="Private">Private</option>
            <option value="Publish">Publish</option>
          </select>
        </div>

        <div className="button-admin-group">
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
