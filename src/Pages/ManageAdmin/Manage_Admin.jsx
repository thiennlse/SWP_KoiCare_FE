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
import DeleteBlogModal from "./Modal/DeleteBlogModal";
import SideBar from "./Sidebar";

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
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] });

  const [deleteProductModalIsOpen, setDeleteProductModalIsOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteBlogModalIsOpen, setDeleteBlogModalIsOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [filteredDateRange, setFilteredDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const token = JSON.parse(localStorage.getItem("token"));
  const userRole = JSON.parse(localStorage.getItem("role"));
  const userId = JSON.parse(localStorage.getItem("userId"));
  const searchTerm = "";
  const [accountName, setAccountName] = useState("");

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

  useEffect(() => {
    fetchData();
  }, [token, userId, searchTerm]);

  useEffect(() => {
    if (userRole === "Admin") {
      setActiveTab("dashboard");
    } else if (userRole === "Staff") {
      setActiveTab("blogs");
    } else if (userRole === "ShopOwner") {
      setActiveTab("dashboardShop");
    }
    fetchData();
  }, [token, userId, userRole]);

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
        toast.success("User  role updated successfully!", { autoClose: 500 });
        fetchData();
      })
      .catch((err) => {
        console.error("Error updating user role:", err);
        toast.error("Failed to update user role.", { autoClose: 500 });
      });
  };

  const fetchData = async () => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const userRole = JSON.parse(localStorage.getItem("role"));

    try {
      const response = await axiosInstance.get(
        `/api/Order?page=1&pageSize=100`
      );
      if (response.status === 200) {
        const filteredOrders = response.data
          .filter((order) => {
            if (userRole === "Admin") {
              return true;
            } else if (userRole === "ShopOwner") {
              return order.orderProducts?.some(
                (product) => product.product?.userId === userId
              );
            }
            return false;
          })
          .map((order) => {
            const filteredOrderProducts = order.orderProducts?.filter(
              (product) => product.product?.userId === userId
            );

            const totalCost = filteredOrderProducts.reduce((sum, product) => {
              if (product.product && product.product.cost) {
                return sum + product.product.cost * product.quantity;
              }
              return sum;
            }, 0);

            return {
              ...order,
              orderProducts: filteredOrderProducts,
              totalCost: totalCost,
              description: filteredOrderProducts
                .map((product) => product.product?.description)
                .join(", "),
            };
          });

        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      toast.error("Error fetching orders:", error, { autoClose: 500 });
    }

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
      .get("/api/Blog?page=1&pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs:", err));
  };

  const handleLogout = () => {
    toast.success("Logout successful!", { autoClose: 500 });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("cart");

    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, 500);
  };

  const handleDateSearch = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.warning("Please select both start and end dates", {
        autoClose: 500,
      });
      return;
    }
    setFilteredDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    fetchData();
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
        toast.success("Product created successfully!", { autoClose: 500 });
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        toast.error("Failed to create product.", { autoClose: 500 });
      });
  };

  const handleUpdateProduct = (productData) => {
    axiosInstance
      .patch(`/api/Product/update/${productData.id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Product updated successfully!", { autoClose: 500 });
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
        toast.success("Product deleted successfully!", { autoClose: 500 });
        fetchData();
        closeDeleteProductModal();
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  const handleCreateBlog = (blogData) => {
    const formattedBlogData = {
      memberId: JSON.parse(localStorage.getItem("userId")) || 0,
      title: blogData.title,
      content: blogData.content,
      dateOfPublish: new Date(blogData.dateOfPublish).toISOString(),
      status: blogData.status,
      image: blogData.image,
    };
    axiosInstance
      .post("/api/Blog/add", formattedBlogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.success("Blog created successfully!", { autoClose: 500 });
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error creating blog:", err);
        toast.error("Failed to create blog.", { autoClose: 500 });
      });
  };

  const handleUpdateBlog = (blogData) => {
    axiosInstance
      .patch(`/api/Blog/update/${blogData.id}`, blogData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Blog updated successfully!", { autoClose: 500 });
        fetchData();
        closeModal();
      })
      .catch((err) => {
        console.error("Error updating blog:", err);
        toast.error("Failed to update blog.", { autoClose: 500 });
      });
  };

  const handleDeleteBlogConfirmation = () => {
    axiosInstance
      .delete(`/api/Blog/Delete?id=${selectedBlog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Blog deleted successfully!", { autoClose: 500 });
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
      subcriptionId: 0,
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
        toast.success("Order status updated successfully!", { autoClose: 500 });
        fetchData();
      })
      .catch((err) => {
        console.error("Error updating order status:", err);
        toast.error("Failed to update order status.", { autoClose: 500 });
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Order?page=1&pageSize=100"
        );
        if (response.status === 200) {
          const orders = response.data;
          const monthlyRevenue = Array(12).fill(0);

          const ordersSubcribe = orders
            .map((order) => ({
              ...order,
              orderProducts: order.orderProducts.filter(
                (orderProduct) => orderProduct.subcriptionId != null
              ),
            }))
            .filter((order) => order.orderProducts.length > 0);

          ordersSubcribe.forEach((order) => {
            const orderMonth = new Date(order.orderDate).getMonth();
            monthlyRevenue[orderMonth] += order.totalCost;
          });

          const labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          setRevenueData({ labels, data: monthlyRevenue });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch order data.", { autoClose: 500 });
      }
    };

    fetchOrders();
  }, []);

  axiosInstance
    .get(`/api/Member/${userId}`)
    .then((res) => setAccountName(res.data.fullName));

  return (
    <div className="admin_dashboard">
      <header className="header-admin">
        <span className="logout_button_admin" onClick={handleLogout}>
          Logout
        </span>
      </header>

      <SideBar
        handleRoleChange={handleRoleChange}
        handleStatusChange={handleStatusChange}
        handleBackToHome={handleBackToHome}
        handleDateSearch={handleDateSearch}
        orderStatuses={orderStatuses}
        rolesList={rolesList}
        openDeleteBlogModal={openDeleteBlogModal}
        openDeleteProductModal={openDeleteProductModal}
        openModal={openModal}
        accountName={accountName}
        filteredDateRange={filteredDateRange}
        setDateRange={setDateRange}
        revenueData={revenueData}
        blogs={blogs}
        products={products}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        users={users}
        orders={orders}
        userId={userId}
        dateRange={dateRange}
      />
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
