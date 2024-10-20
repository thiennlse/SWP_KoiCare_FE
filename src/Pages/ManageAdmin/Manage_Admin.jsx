import React, { useState, useEffect } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { FaRegCircle } from "react-icons/fa";
import axios from "axios";
import "./Manage_Admin.css";

const ManageAdmin = () => {
  const [activeSubmenu, setActiveSubmenu] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    axios
      .get("https://koicareapi.azurewebsites.net/api/Member", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axios
      .get("https://koicareapi.azurewebsites.net/api/Product", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));

    axios
      .get("https://koicareapi.azurewebsites.net/api/Blog", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs:", err));

    axios
      .get("https://koicareapi.azurewebsites.net/api/Order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  };

  const updateOrderStatus = (orderId, status) => {
    axios
      .patch(
        `https://koicareapi.azurewebsites.net/api/Order/update/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Order status updated"))
      .catch((err) => console.error("Error updating order:", err));
  };

  const handleCreateBlog = () => {
    axios
      .post("https://koicareapi.azurewebsites.net/api/Blog/add", newBlog, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNewBlog({ title: "", content: "" });
        fetchData();
        alert("Blog created successfully");
      })
      .catch((err) => console.error("Error creating blog:", err));
  };

  const handleDeleteBlog = (id) => {
    axios
      .delete(`https://koicareapi.azurewebsites.net/api/Blog/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchData();
        alert("Blog deleted successfully");
      })
      .catch((err) => console.error("Error deleting blog:", err));
  };

  return (
    <div className="admin_dashboard">
      <aside className="sidebar">
        <div className="profile">
          <img src="/path/to/profile_pic.png" alt="Admin" />
        </div>

        <nav>
          <ul>
            <a
              href="#"
              onClick={() => setActiveSubmenu("users")}
              className={activeSubmenu === "users" ? "active" : ""}
            >
              <FaRegCircle /> User Management
            </a>
            <a
              href="#"
              onClick={() => setActiveSubmenu("products")}
              className={activeSubmenu === "products" ? "active" : ""}
            >
              <FaRegCircle /> Product Management
            </a>
            <a
              href="#"
              onClick={() => setActiveSubmenu("blogs")}
              className={activeSubmenu === "blogs" ? "active" : ""}
            >
              <FaRegCircle /> Blog Management
            </a>
            <a
              href="#"
              onClick={() => setActiveSubmenu("orders")}
              className={activeSubmenu === "orders" ? "active" : ""}
            >
              <FaRegCircle /> Order Management
            </a>
          </ul>
        </nav>
      </aside>

      <div className="main_content_admin">
        <header className="toolbar">
          <HiOutlineLogout /> Logout
        </header>

        <main className="dashboard_content">
          {activeSubmenu === "users" && (
            <div className="card">
              <h3>User Management</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.fullName} - {user.role.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSubmenu === "products" && (
            <div className="card">
              <h3>Product Management</h3>
              <ul>
                {products.map((product) => (
                  <li key={product.id}>
                    {product.name} - ${product.cost}
                    <button>Edit</button>
                    <button>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSubmenu === "blogs" && (
            <div className="card">
              <h3>Blog Management</h3>
              <input
                type="text"
                placeholder="Blog Title"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, title: e.target.value })
                }
              />
              <textarea
                placeholder="Blog Content"
                value={newBlog.content}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, content: e.target.value })
                }
              />
              <button onClick={handleCreateBlog}>Create Blog</button>
              <ul>
                {blogs.map((blog) => (
                  <li key={blog.id}>
                    {blog.title}
                    <button onClick={() => handleDeleteBlog(blog.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSubmenu === "orders" && (
            <div className="card">
              <h3>Order Management</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    Order #{order.id} - Status: {order.status}
                    <select
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageAdmin;
