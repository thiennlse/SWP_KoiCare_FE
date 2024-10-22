import React from "react";

const BlogEditForm = ({ blog, onSubmit }) => {
  const [title, setTitle] = React.useState(blog.title);
  const [content, setContent] = React.useState(blog.content);

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
      <button type="submit">Update Blog</button>
    </form>
  );
};

export default BlogEditForm;
