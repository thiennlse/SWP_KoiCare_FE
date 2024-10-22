import React from "react";

const ProductEditForm = ({ product, onSubmit }) => {
  const [name, setName] = React.useState(product.name);
  const [description, setDescription] = React.useState(product.description);
  const [price, setPrice] = React.useState(product.price);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, description, price });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default ProductEditForm;
