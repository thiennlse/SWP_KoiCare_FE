import React, { useState, useEffect } from "react";

const ProductForm = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    cost: 0,
    description: "",
    origin: "",
    productivity: 0,
    code: "",
    inStock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "cost" || name === "productivity" || name === "inStock"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{product ? "Edit Product" : "Create Product"}</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <input
        type="number"
        name="cost"
        value={formData.cost}
        onChange={handleChange}
        placeholder="Cost"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      ></textarea>
      <input
        type="text"
        name="origin"
        value={formData.origin}
        onChange={handleChange}
        placeholder="Origin"
        required
      />
      <input
        type="number"
        name="productivity"
        value={formData.productivity}
        onChange={handleChange}
        placeholder="Productivity"
        required
      />
      <input
        type="text"
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="Product Code"
        required
      />
      <input
        type="number"
        name="inStock"
        value={formData.inStock}
        onChange={handleChange}
        placeholder="In Stock"
        required
      />
      <button type="submit">
        {product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
