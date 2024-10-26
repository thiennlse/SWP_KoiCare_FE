import React, { useState, useEffect } from "react";
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
Modal.setAppElement("#root");

const ManageAdmin = () => {
  const [activeTab, setActiveTab] = useState("users");
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

  const handleRoleChange = (userId, newRoleId) => {
    const userToUpdate = users.find((user) => user.id === userId);
    if (!userToUpdate) return;

    const updatedUser = {
      ...userToUpdate,
      roleId: newRoleId,
    };

    axiosInstance
      .patch(
        `https://koicareapi.azurewebsites.net/api/Member/update/${userId}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
      .get("https://koicareapi.azurewebsites.net/api/Member", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axiosInstance
      .get(
        "https://koicareapi.azurewebsites.net/api/Product?page=1&pagesize=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));

    axiosInstance
      .get(
        "https://koicareapi.azurewebsites.net/api/Order?page=1&pageSize=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));

    axiosInstance
      .get(
        "https://koicareapi.azurewebsites.net/api/Blog?page=1&pageSize=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("cart");
    localStorage.removeItem("user");

    window.location.href = "/home";
  };

  const handleCreateProduct = (productData) => {
    axiosInstance
      .post(
        "https://koicareapi.azurewebsites.net/api/Product/add",
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
      .patch(
        `https://koicareapi.azurewebsites.net/api/Product/update/${productData.id}`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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

  // const handleDeleteProduct = (productId) => {
  //   axiosInstance
  //     .delete(
  //       `https://koicareapi.azurewebsites.net/api/Product/Delete?id=${productId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then((res) => {
  //       toast.success("Product deleted successfully!", { autoClose: 1500 });
  //       fetchData();
  //     })
  //     .catch((err) => console.error("Error deleting product:", err));
  // };

  const handleDeleteProductConfirmation = () => {
    axiosInstance
      .delete(
        `https://koicareapi.azurewebsites.net/api/Product/Delete?id=${selectedProduct.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Product deleted successfully!", { autoClose: 1500 });
        fetchData();
        closeDeleteProductModal();
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  const handleCreateBlog = (blogData) => {
    axiosInstance
      .post("https://koicareapi.azurewebsites.net/api/Blog/add", blogData, {
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
      .patch(
        `https://koicareapi.azurewebsites.net/api/Blog/update/${blogData.id}`,
        blogData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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

  // const handleDeleteBlog = (blogId) => {
  //   axiosInstance
  //     .delete(
  //       `https://koicareapi.azurewebsites.net/api/Blog/Delete?id=${blogId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then((res) => {
  //       toast.success("Blog deleted successfully!", { autoClose: 1500 });
  //       fetchData();
  //     })
  //     .catch((err) => console.error("Error deleting blog:", err));
  // };

  const handleDeleteBlogConfirmation = () => {
    axiosInstance
      .delete(
        `https://koicareapi.azurewebsites.net/api/Blog/Delete?id=${selectedBlog.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Blog deleted successfully!", { autoClose: 1500 });
        fetchData();
        closeDeleteBlogModal();
      })
      .catch((err) => console.error("Error deleting blog:", err));
  };

  const handleStatusChange = (order, newStatus) => {
    const updatedOrder = {
      productId: order.productId || [],
      quantity: order.quantity || [],
      totalCost: order.totalCost > 0 ? order.totalCost : 1,
      closeDate: order.closeDate,
      code: order.code,
      description: order.description,
      status: newStatus,
    };

    axiosInstance
      .patch(
        `https://koicareapi.azurewebsites.net/api/Order/update/${order.id}`,
        updatedOrder,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
          <div className="profile">
            <img
              src="/path/to/profile_pic.png"
              alt="Admin"
              className="avatar"
            />
          </div>
          <nav className="nav_admin">
            <ul>
              <li
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                User Management
              </li>
              <li
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                Product Management
              </li>
              <li
                className={activeTab === "blogs" ? "active" : ""}
                onClick={() => setActiveTab("blogs")}
              >
                Blog Management
              </li>
              <li
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                Order Management
              </li>
            </ul>
          </nav>
          <button className="back_button_admin" onClick={handleBackToHome}>
            Back to Home
          </button>
        </aside>

        <main className="content_admin">
          {activeTab === "users" && (
            <div className="card_admin">
              <h3>User Management</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.fullName} - {user.role.name}
                    <select
                      value={user.roleId}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <option value={user.roleId}>{user.role.name}</option>{" "}
                      {rolesList
                        .filter((role) => role.id !== user.roleId)
                        .map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "products" && (
            <div className="card">
              <h3>Product Management</h3>
              <button onClick={() => openModal("createProduct")}>
                Create Product
              </button>
              <ul className="list-group">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {product.title}
                    <span>
                      {product.name} - ${product.cost} - {product.description}
                    </span>
                    <div className="btn-group-admin" role="group">
                      <button
                        className="btn-admin btn-sm btn-outline-primary"
                        onClick={() => openModal("editProduct", product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-admin btn-sm btn-outline-info"
                        onClick={() => openModal("productDetails", product)}
                      >
                        Details
                      </button>
                      <button
                        className="btn-admin btn-sm btn-outline-danger"
                        onClick={() => openDeleteProductModal(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "blogs" && (
            <div className="card">
              <h3>Blog Management</h3>
              <button onClick={() => openModal("createBlog")}>
                Create Blog
              </button>
              <ul className="list-group">
                {blogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {blog.title} - {blog.content}
                    </span>
                    <div className="btn-group-admin" role="group">
                      <button
                        className="btn-admin btn-sm btn-outline-primary"
                        onClick={() => openModal("editBlog", blog)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-admin btn-sm btn-outline-info"
                        onClick={() => openModal("blogDetails", blog)}
                      >
                        Details
                      </button>
                      <button
                        className="btn-admin btn-sm btn-outline-danger"
                        onClick={() => openDeleteBlogModal(blog)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="card">
              <h3>Order Management</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    Order #{order.id} - Status: {order.status} - Description:{" "}
                    {order.description} - TotalCost: {order.totalCost}
                    <select
                      className="select-order-admin"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value)
                      }
                    >
                      <option value="Paid">PAID</option>
                      <option value="In transit">IN TRANSIT</option>
                      <option value="Delivered">DELIVERED</option>
                    </select>
                  </li>
                ))}
              </ul>
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
