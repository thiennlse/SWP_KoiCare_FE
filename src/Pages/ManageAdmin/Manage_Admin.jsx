import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Manage_Admin.css";
import Modal from "react-modal";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import BlogForm from "./BlogForm";
import BlogDetails from "./BlogDetails";
Modal.setAppElement("#root");

const ManageAdmin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState("");

  const openModal = (type, content = null) => {
    setModalType(type);
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    setModalContent(null);
  };

  const [newProduct, setNewProduct] = useState({
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

  const [newBlog, setNewBlog] = useState({
    memberId: 0,
    title: "",
    image: "",
    content: "",
    dateOfPublish: new Date().toISOString(),
    status: "",
  });

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchData();
  }, [token]);

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
      .get("https://koicareapi.azurewebsites.net/api/Order", {
        headers: { Authorization: `Bearer ${token}` },
      })
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
    window.location.href = "/home";
  };

  const handleProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = (blogData) => {
    axiosInstance
      .patch(
        `https://koicareapi.azurewebsites.net/api/Product/update/${blogData.id}`,
        blogData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Product updated successfully!");
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        toast.error("Failed to update product.");
      });
  };

  const handleDeleteProduct = (productId) => {
    axiosInstance
      .delete(
        `https://koicareapi.azurewebsites.net/api/Product/Delete?id=${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Product deleted successfully!");
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product.");
      });
  };

  // const handleViewProductDetails = (product) => {
  //   setSelectedProductId(product.id);
  // };

  // const handleCloseProductDetails = () => {
  //   setSelectedProductId(null);
  // };

  const handleCreateProduct = (blogData) => {
    axiosInstance
      .post("https://koicareapi.azurewebsites.net/api/Product/add", blogData, {
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

  const handleBlogChange = (e) => {
    setNewBlog({
      ...newBlog,
      [e.target.name]: e.target.value,
    });
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

  const handleEditBlog = (blog) => {
    setEditBlog(blog);
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

  const handleDeleteBlog = (blogId) => {
    axiosInstance
      .delete(
        `https://koicareapi.azurewebsites.net/api/Blog/delete?id=${blogId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Blog deleted successfully!");
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting blog:", err);
        toast.error("Failed to delete blog.");
      });
  };

  // const handleViewBlogDetails = (blog) => {
  //   setSelectedBlogId(blog.id);
  // };

  // const handleCloseBlogDetails = () => {
  //   setSelectedBlogId(null);
  // };

  const handleStatusChange = (order) => {
    const updatedOrder = {
      productId: order.productId || [],
      totalCost: order.totalCost || 0,
      closeDate: order.closeDate || new Date().toISOString(),
      code: order.code || "",
      description: order.description || "",
      status: order.status,
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
        return modalContent ? <ProductDetails product={modalContent} /> : null;
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
        return modalContent ? <BlogDetails blog={modalContent} /> : null;
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
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* {selectedProductId && (
                <div className="product-details">
                  {products
                    .filter((product) => product.id === selectedProductId)
                    .map((product) => (
                      <div key={product.id} className="details-content-product">
                        <h3>Product Details</h3> <hr />
                        <h4>Name: {product.name}</h4>
                        <p>
                          Image:{" "}
                          <img
                            className="img-admin"
                            src={product.image}
                            alt={product.name}
                          />
                        </p>
                        <p>Cost: {product.cost}</p>
                        <p>Description: {product.description}</p>
                        <p>Origin: {product.origin}</p>
                        <p>Productivity: {product.productivitys}</p>
                        <p>Code: {product.code}</p>
                        <p>Stock: {product.inStock}</p>
                        <button onClick={handleCloseProductDetails}>
                          Close
                        </button>
                      </div>
                    ))}
                </div>
              )} */}

              {/* {editProduct && (
                <>
                  <h3>Edit Product</h3>
                  <form onSubmit={handleUpdateProduct}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      value={editProduct.name}
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, name: e.target.value })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="image"
                      placeholder="Image URL"
                      value={editProduct.image}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          image: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={editProduct.cost}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          cost: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={editProduct.description}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="origin"
                      placeholder="Origin"
                      value={editProduct.origin}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          origin: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="number"
                      name="productivity"
                      placeholder="Productivity"
                      value={editProduct.productivity}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          productivity: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="code"
                      placeholder="Product Code"
                      value={editProduct.code}
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, code: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      name="inStock"
                      placeholder="Stock"
                      value={editProduct.inStock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          inStock: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                    <button type="submit">Update Product</button>
                  </form>
                </>
              )} */}

              {/* <h3>Add New Product</h3>
              <form onSubmit={handleCreateProduct}>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={handleProductChange}
                />
                <input
                  type="number"
                  name="cost"
                  placeholder="Cost"
                  value={newProduct.cost}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="text"
                  name="origin"
                  placeholder="Origin"
                  value={newProduct.origin}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="number"
                  name="productivity"
                  placeholder="Productivity"
                  value={newProduct.productivity}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Product Code"
                  value={newProduct.code}
                  onChange={handleProductChange}
                  required
                />
                <input
                  type="number"
                  name="inStock"
                  placeholder="Stock"
                  value={newProduct.inStock}
                  onChange={handleProductChange}
                  required
                />
                <button type="submit">Create Product</button>
              </form> */}
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
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* {selectedBlogId && (
                <div className="blog-details">
                  {blogs
                    .filter((blog) => blog.id === selectedBlogId)
                    .map((blog) => (
                      <div key={blog.id} className="details-content-blog">
                        <h3>Blog Details</h3> <hr />
                        <h4>Title: {blog.title}</h4>
                        <p>
                          Image:{" "}
                          <img
                            className="img-admin"
                            src={blog.image}
                            alt={blog.title}
                          />
                        </p>
                        <p>Content: {blog.content}</p>
                        <p>Date of Publish: {blog.dateOfPublish}</p>
                        <p>Status: {blog.status}</p>
                        <button onClick={handleCloseBlogDetails}>Close</button>
                      </div>
                    ))}
                </div>
              )} */}

              {/* <h3>Add New Blog</h3>
              <form onSubmit={handleCreateBlog}>
                <input
                  type="text"
                  name="title"
                  placeholder="Blog Title"
                  value={newBlog.title}
                  onChange={handleBlogChange}
                  required
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={newBlog.image}
                  onChange={handleBlogChange}
                />
                <textarea
                  name="content"
                  placeholder="Blog Content"
                  value={newBlog.content}
                  onChange={handleBlogChange}
                  required
                />
                <input
                  type="date"
                  name="dateOfPublish"
                  value={newBlog.dateOfPublish.substring(0, 10)} // Ensure it's in YYYY-MM-DD format
                  onChange={handleBlogChange}
                  required
                />
                <input
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={newBlog.status}
                  onChange={handleBlogChange}
                  required
                />
                <button type="submit">Create Blog</button>
              </form> */}

              {/* {editBlog && (
                <>
                  <h3>Edit Blog</h3>
                  <form onSubmit={handleUpdateBlog}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Blog Title"
                      value={editBlog.title}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, title: e.target.value })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="image"
                      placeholder="Image URL"
                      value={editBlog.image}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, image: e.target.value })
                      }
                    />
                    <textarea
                      name="content"
                      placeholder="Blog Content"
                      value={editBlog.content}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, content: e.target.value })
                      }
                      required
                    />
                    <input
                      type="date"
                      name="dateOfPublish"
                      value={editBlog.dateOfPublish.substring(0, 10)}
                      onChange={(e) =>
                        setEditBlog({
                          ...editBlog,
                          dateOfPublish: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="status"
                      placeholder="Status"
                      value={editBlog.status}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, status: e.target.value })
                      }
                      required
                    />
                    <button type="submit">Update Blog</button>
                  </form>
                </>
              )} */}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="card">
              <h3>Order Management</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    Order #{order.id} - Status: {order.status}
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order)}
                    >
                      <option value="paid">Thanh toán</option>
                      <option value="shipping">Đang giao</option>
                      <option value="delivered">Đã giao</option>
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
        overlayClassName="overlay_admin"
      >
        {renderModalContent()}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ManageAdmin;
