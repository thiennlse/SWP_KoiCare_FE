import React from "react";

const BlogCreateForm = ({ onSubmit }) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <br />
      <label>
        Content:
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Create Blog</button>
    </form>
  );
};

export default BlogCreateForm;
