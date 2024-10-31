import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./BlogDetail.css";
import blog_image_1 from "../../Components/Assets/blog_imgae_1.png";
import axiosInstance from "../axiosInstance";

const BlogDetail = () => {
  const location = useLocation();
  const blog = location.state?.blog;
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);

  useEffect(() => {
    const fetchSuggestedBlogs = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Blog?page=1&pagesize=100"
        );
        const blogs = response.data;

        const shuffledBlogs = blogs.sort(() => 0.5 - Math.random());
        const randomBlogs = shuffledBlogs
          .filter((b) => b.id !== blog.id) // Loại bỏ blog hiện tại
          .slice(0, 3);

        setSuggestedBlogs(randomBlogs);
      } catch (error) {
        console.error("Error fetching suggested blogs", error);
      }
    };

    fetchSuggestedBlogs();
  }, [blog.id]);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-content">
        <h1>{blog.title}</h1>
        <img
          src={blog.image || blog_image_1}
          alt={blog.title}
          className="blog-detail-image"
        />
        <div className="blog-detail-text">
          <p>{blog.content}</p>
        </div>
        {blog.createdAt && (
          <div className="blog-detail-date">
            Posted on: {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="suggested-blogs">
        <h3>Related Posts</h3>
        <div className="blog-grid">
          {suggestedBlogs.map((suggestedBlog) => (
            <div key={suggestedBlog.id} className="blog-item">
              <img
                src={suggestedBlog.image || blog_image_1}
                alt={suggestedBlog.title}
              />
              <h4>{suggestedBlog.title}</h4>
              <p className="blog-excerpt">
                {suggestedBlog.content.substring(0, 100)}...
              </p>
              <button
                onClick={() => {
                  window.location.href = `/blog/${suggestedBlog.id}`;
                }}
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
