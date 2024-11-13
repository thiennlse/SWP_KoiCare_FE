import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
// import "../Modal/Modal.css";
import "./ProductForm.css";

const ProductForm = ({ product, onSubmit, closeModal }) => {
  const [formData, setFormData] = useState({
    image: "",
    userId: 0,
    name: "",
    cost: 0,
    description: "",
    origin: "",
    productivity: 0,
    code: "",
    inStock: 0,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
      });
      setPreviewImage(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "productivity" || name === "inStock" || name === "cost") &&
      value < 0
    ) {
      toast.error(
        `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative.`
      );
      return;
    }

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
        userId: JSON.parse(localStorage.getItem("userId")) || 0,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="product-form-container">
      <h3>{product ? "Edit Product" : "Create New Product"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
              alt="Product preview"
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
          <label>Cost:</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Origin:</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Productivity:</label>
          <input
            type="text"
            name="productivity"
            value={formData.productivity}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="inStock"
            value={formData.inStock}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="button-admin-group">
          <button type="submit">
            {product ? "Update Product" : "Create Product"}
          </button>{" "}
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
