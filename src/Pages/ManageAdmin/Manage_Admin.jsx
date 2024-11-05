import React, { useState, useEffect } from "react";
import { GrUserAdmin } from "react-icons/gr";
import axiosInstance from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Manage_Admin.css";
import Modal from "react-modal";
import ProductForm from "./Modal/ProductForm";
import ProductDetails from "./Modal/ProductDetails";
import BlogForm from "./Modal/BlogForm";
import BlogDetails from "./Modal/BlogDetails";
import DeleteProductModal from "./Modal/DeleteProductModal";
import DeleteBlogModal from "./Modal/DeletBlogModal";
import OrderChart from "./OrderChart";
import adminAvatar from "./../../Components/Assets/admin.png";
import {
  MdDashboard,
  MdPeople,
  MdShoppingCart,
  MdArticle,
} from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
Modal.setAppElement("#root");

const ManageAdmin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState("");
  const [deleteProductModalIsOpen, setDeleteProductModalIsOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteBlogModalIsOpen, setDeleteBlogModalIsOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openModal = (type, content = null) => {
    setModalType(type);
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const openDeleteProductModal = (product) => {
    setSelectedProduct(product);
    setDeleteProductModalIsOpen(true);
  };

  const closeDeleteProductModal = () => {
    setDeleteProductModalIsOpen(false);
    setSelectedProduct(null);
  };

  const openDeleteBlogModal = (blog) => {
    setSelectedBlog(blog);
    setDeleteBlogModalIsOpen(true);
  };

  const closeDeleteBlogModal = () => {
    setDeleteBlogModalIsOpen(false);
    setSelectedBlog(null);
  };

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchData();
  }, [token]);

  const rolesList = [
    { id: 1, name: "Admin" },
    { id: 2, name: "ShopOwner" },
    { id: 3, name: "Staff" },
    { id: 4, name: "Member" },
  ];

  const orderStatuses = [
    { id: 1, name: "PAID" },
    { id: 2, name: "IN TRANSIT" },
    { id: 3, name: "DELIVERED" },
  ];

  const handleRoleChange = (userId, newRoleId) => {
    const userToUpdate = users.find((user) => user.id === userId);
    if (!userToUpdate) return;

    const updatedUser = {
      ...userToUpdate,
      roleId: newRoleId,
    };

    axiosInstance
      .patch(`/api/Member/update/${userId}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("User  role updated successfully!");
        fetchData();
      })
      .catch((err) => {
        console.error("Error updating user role:", err);
        toast.error("Failed to update user role.");
      });
  };

  const fetchData = () => {
    axiosInstance
      .get("/api/Member", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axiosInstance
      .get("/api/Product?page=1&pagesize=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));

    axiosInstance
      .get("/api/Order?page=1&pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));

    axiosInstance
      .get("/api/Blog?page=1&pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs:", err));
  };

  const handleLogout = () => {
    toast.success("Logout successful!", { autoClose: 1500 });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("cart");

    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, 1500);
  };

  const handleBackToHome = () => {
    window.location.href = "/home";
  };

  const handleCreateProduct = (productData) => {
    axiosInstance
      .post("/api/Product/add", productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Product created successfully!");
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        toast.error("Failed to create product.");
      });
  };

  const handleUpdateProduct = (productData) => {
    axiosInstance
      .patch(`/api/Product/update/${productData.id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Product updated successfully!", { autoClose: 1500 });
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        toast.error("Failed to update product.");
      });
  };

  const handleDeleteProductConfirmation = () => {
    axiosInstance
      .delete(`/api/Product/Delete?id=${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Product deleted successfully!", { autoClose: 1500 });
        fetchData();
        closeDeleteProductModal();
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  const handleCreateBlog = (blogData) => {
    axiosInstance
      .post("/api/Blog/add", blogData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Blog created successfully!");
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error creating blog:", err);
        toast.error("Failed to create blog.");
      });
  };

  const handleUpdateBlog = (blogData) => {
    axiosInstance
      .patch(`/api/Blog/update/${blogData.id}`, blogData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Blog updated successfully!");
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error updating blog:", err);
        toast.error("Failed to update blog.");
      });
  };

  const handleDeleteBlogConfirmation = () => {
    axiosInstance
      .delete(`/api/Blog/Delete?id=${selectedBlog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Blog deleted successfully!", { autoClose: 1500 });
        fetchData();
        closeDeleteBlogModal();
      })
      .catch((err) => console.error("Error deleting blog:", err));
  };

  const handleStatusChange = (orderId, newStatusId) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

    const updatedOrder = {
      productId: orderToUpdate.productId || [],
      quantity: orderToUpdate.quantity || [],
      totalCost: orderToUpdate.totalCost > 0 ? orderToUpdate.totalCost : 1,
      closeDate: orderToUpdate.closeDate,
      code: orderToUpdate.code,
      description: orderToUpdate.description,
      status: newStatusId,
    };

    axiosInstance
      .patch(`/api/Order/update/${orderId}`, updatedOrder, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Order status updated successfully!");
        fetchData();
      })
      .catch((err) => {
        console.error("Error updating order status:", err);
        toast.error("Failed to update order status.");
      });
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "createProduct":
        return (
          <ProductForm onSubmit={handleCreateProduct} closeModal={closeModal} />
        );
      case "editProduct":
        return (
          <ProductForm
            product={modalContent}
            onSubmit={handleUpdateProduct}
            closeModal={closeModal}
          />
        );
      case "productDetails":
        return modalContent ? (
          <ProductDetails product={modalContent} onClose={closeModal} />
        ) : null;

      case "createBlog":
        return <BlogForm onSubmit={handleCreateBlog} closeModal={closeModal} />;
      case "editBlog":
        return (
          <BlogForm
            blog={modalContent}
            onSubmit={handleUpdateBlog}
            closeModal={closeModal}
          />
        );
      case "blogDetails":
        return modalContent ? (
          <BlogDetails blog={modalContent} onClose={closeModal} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="admin_dashboard">
      <header className="header-admin">
        <span className="logout_button_admin" onClick={handleLogout}>
          Logout
        </span>
      </header>

      <div style={{ display: "flex", flexGrow: 1 }}>
        <aside className="sidebar-admin">
          <div className="profile-admin">
            <img src={adminAvatar} alt="Admin" />
            <div className="admin-name">Admin</div>
          </div>
          <nav className="nav_admin">
            <ul>
              <li
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                <MdDashboard className="nav-icon-admin" />
                Dashboard
              </li>
              <li
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                <MdPeople className="nav-icon-admin" />
                User Management
              </li>
              <li
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                <MdShoppingCart className="nav-icon-admin" />
                Product Management
              </li>
              <li
                className={activeTab === "blogs" ? "active" : ""}
                onClick={() => setActiveTab("blogs")}
              >
                <MdArticle className="nav-icon-admin" />
                Blog Management
              </li>
              <li
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <FaClipboardList className="nav-icon-admin" />
                Order Management
              </li>
            </ul>
          </nav>
          <button className="back_button_admin" onClick={handleBackToHome}>
            Back to Home
          </button>
        </aside>

        <main className="content_admin">
          {activeTab === "dashboard" && (
            <div className="card_admin">
              <h3>Total Management</h3>
              <div className="dashboard-cards">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">{users.length}</div>
                  <div className="stat-title">Total Users</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-number">{products.length}</div>
                  <div className="stat-title">Total Products</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-number">{blogs.length}</div>
                  <div className="stat-title">Total Blogs</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🛍️</div>
                  <div className="stat-number">{orders.length}</div>
                  <div className="stat-title">Total Orders</div>
                </div>
              </div>
              <div className="chart-container">
                <OrderChart orders={orders} />
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="management-section">
              <div className="management-header">
                <h3>User Management</h3>
              </div>
              <div className="management-content">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          {user.fullName ? user.fullName : "New Customer"}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            className="role-select"
                            value={user.roleId}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                          >
                            <option value={user.roleId}>
                              {user.role.name}
                            </option>
                            {rolesList
                              .filter((role) => role.name !== user.role.name)
                              .map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="management-section">
              <div className="management-header">
                <h3>Product Management</h3>
                <button
                  className="create-button"
                  onClick={() => openModal("createProduct")}
                >
                  Create Product
                </button>
              </div>
              <div className="management-content">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Cost</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            <span
                              style={{ color: "#999", fontStyle: "italic" }}
                            >
                              No Image
                            </span>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.cost} VND</td>
                        <td className="truncate-text">{product.description}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button edit-button"
                              onClick={() => openModal("editProduct", product)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-button details-button"
                              onClick={() =>
                                openModal("productDetails", product)
                              }
                            >
                              Details
                            </button>
                            <button
                              className="action-button delete-button"
                              onClick={() => openDeleteProductModal(product)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "blogs" && (
            <div className="management-section">
              <div className="management-header">
                <h3>Blog Management</h3>
                <button
                  className="create-button"
                  onClick={() => openModal("createBlog")}
                >
                  Create Blog
                </button>
              </div>
              <div className="management-content">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td>
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            <span
                              style={{ color: "#999", fontStyle: "italic" }}
                            >
                              No Image
                            </span>
                          )}
                        </td>
                        <td>{blog.title}</td>
                        <td className="truncate-text">{blog.content}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button edit-button"
                              onClick={() => openModal("editBlog", blog)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-button details-button"
                              onClick={() => openModal("blogDetails", blog)}
                            >
                              Details
                            </button>
                            <button
                              className="action-button delete-button"
                              onClick={() => openDeleteBlogModal(blog)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="management-section">
              <div className="management-header">
                <h3>Order Management</h3>
              </div>
              <div className="management-content">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Description</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.description}</td>
                        <td>{order.totalCost} VND</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            <option value={order.status}>{order.status}</option>
                            {orderStatuses
                              .filter((status) => status.name !== order.status)
                              .map((status) => (
                                <option key={status.id} value={status.name}>
                                  {status.name}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="modal_admin"
        overlayClassName=" overlay_admin"
      >
        {renderModalContent()}
      </Modal>
      <DeleteProductModal
        isOpen={deleteProductModalIsOpen}
        onRequestClose={closeDeleteProductModal}
        product={selectedProduct}
        onDelete={handleDeleteProductConfirmation}
      />
      <DeleteBlogModal
        isOpen={deleteBlogModalIsOpen}
        onRequestClose={closeDeleteBlogModal}
        blog={selectedBlog}
        onDelete={handleDeleteBlogConfirmation}
      />
      <ToastContainer />
    </div>
  );
};

export default ManageAdmin;
