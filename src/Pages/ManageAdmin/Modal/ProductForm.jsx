import React, { useState, useEffect } from "react";
import "../Modal/Modal.css";

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

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
      });
    }
  }, [product]);

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
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Cost:</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
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
          />
        </div>

        <div className="form-group">
          <label>Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Stock:</label>
          <input
            type="text"
            name="inStock"
            value={formData.inStock}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
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
