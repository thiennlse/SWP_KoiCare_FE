import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import OrderChart from "./OrderChart";
import RevenueChart from "./RevenueChart";
import { toast } from "react-toastify";

export default function DashBoard({
  activeTab,
  users,
  products,
  blogs,
  orders,
  revenueData,
  handleRoleChange,
  rolesList,
  userRole,
  openModal,
  userId,
  openDeleteProductModal,
  openDeleteBlogModal,
  dateRange,
  setDateRange,
  handleDateSearch,
  filteredDateRange,
  orderStatuses,
  handleStatusChange,
}) {
  const [revenueDataShopOwner, setRevenueDataShopOwner] = useState({
    labels: [],
    data: [],
  });
  const [subscriptionOrders, setSubscriptionOrders] = useState([]);

  useEffect(() => {
    const fetchSubscriptionOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Order?page=1&pageSize=100"
        );
        const filteredOrders = response.data.filter((order) =>
          order.orderProducts.some((product) => product.subcriptionId)
        );
        setSubscriptionOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching subscription orders:", error);
      }
    };
    fetchSubscriptionOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const monthlyRevenue = Array(12).fill(0);
        orders.forEach((order) => {
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
        setRevenueDataShopOwner({ labels, data: monthlyRevenue });
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch order data.", { autoClose: 500 });
      }
    };

    fetchOrders();
  }, [orders]);

  return (
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
              <div className="stat-number">{subscriptionOrders.length}</div>
              <div className="stat-title">Total Orders</div>
            </div>
          </div>
          <div className="chart-container">
            <RevenueChart revenueData={revenueData} />
            <br /> <br />
            <br />
            <OrderChart orders={subscriptionOrders} />
          </div>
        </div>
      )}

      {activeTab === "dashboardShop" && (
        <div className="card_admin">
          <h3>Dash Board Shop Owner</h3>
          <div className="dashboard-cards">
            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-number">{orders.length}</div>
              <div className="stat-title">Total Orders</div>
            </div>
          </div>
          <div className="chart-container">
            <RevenueChart revenueData={revenueDataShopOwner} /> <br />
            <br />
            <br />
            <OrderChart orders={orders} />
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="user-management-section">
          <div className="user-management-header">
            <h3>User Management</h3>
          </div>
          <div className="user-management-content">
            <table className="user-management-table">
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
                    <td>{user.fullName ? user.fullName : "New Customer"}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={user.roleId}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value={user.roleId}>{user.role.name}</option>
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

      {activeTab === "products" && userRole === "ShopOwner" && (
        <div className="product-management-section">
          <div className="product-management-header">
            <h3>Product Management</h3>
            <button
              className="product-create-button"
              onClick={() => openModal("createProduct")}
            >
              Create Product
            </button>
          </div>
          <div className="product-management-content">
            <table className="product-management-table">
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
                {products
                  .filter((product) => product.userId === userId)
                  .map((product) => (
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
                          <span style={{ color: "#999", fontStyle: "italic" }}>
                            No Image
                          </span>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.cost.toLocaleString("en-US")} VND</td>
                      <td className="product-description-cell">
                        <div className="product-content">
                          {product.description}
                        </div>
                      </td>
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
                            onClick={() => openModal("productDetails", product)}
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

      {activeTab === "blogs" &&
        (userRole === "Admin" || userRole === "Staff") && (
          <div className="blog-management-section">
            <div className="blog-management-header">
              <h3>Blog Management</h3>
              <button
                className="blog-create-button"
                onClick={() => openModal("createBlog")}
              >
                Create Blog
              </button>
            </div>
            <div className="blog-management-content">
              <table className="blog-management-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
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
                          <span style={{ color: "#999", fontStyle: "italic" }}>
                            No Image
                          </span>
                        )}
                      </td>
                      <td>{blog.title}</td>
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
        <div className="order-management-section">
          <div className="order-management-header">
            <h3>Order Management</h3>
            <div className="date-filter">
              <div>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label>End Date:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                className="search-button-order"
                onClick={handleDateSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="order-management-content">
            <table className="order-management-table">
              <thead>
                <tr>
                  <th>Order Code#</th>
                  <th>Order Date</th>
                  <th>Description</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => {
                    if (
                      !filteredDateRange.startDate ||
                      !filteredDateRange.endDate
                    )
                      return true;
                    const orderDate = new Date(order.orderDate).setHours(
                      0,
                      0,
                      0,
                      0
                    );
                    const startDate = new Date(
                      filteredDateRange.startDate
                    ).setHours(0, 0, 0, 0);
                    const endDate = new Date(
                      filteredDateRange.endDate
                    ).setHours(0, 0, 0, 0);
                    return orderDate >= startDate && orderDate <= endDate;
                  })
                  .map((order) => (
                    <tr key={order.id}>
                      <td>#{order.code}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        {order.orderProducts
                          .filter((op) => op.product)
                          .map((op) => `${op.product.name} x ${op.quantity}`)
                          .join(", ")}
                      </td>
                      <td>{order.totalCost.toLocaleString("en-US")} VND</td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          style={
                            order.status === "PAID"
                              ? { backgroundColor: "#d4edda", color: "#155724" }
                              : order.status === "IN TRANSIT"
                              ? { backgroundColor: "#fff3cd", color: "#856404" }
                              : order.status === "DELIVERED"
                              ? { backgroundColor: "#cce5ff", color: "#004085" }
                              : { backgroundColor: "#e2e3e5", color: "#333" }
                          }
                        >
                          <option value={order.status}>{order.status}</option>
                          {orderStatuses
                            .filter((status) => status.name !== order.status)
                            .map((status) => (
                              <option
                                key={status.id}
                                value={status.name}
                                style={
                                  status.name === "PAID"
                                    ? {
                                        backgroundColor: "#d4edda",
                                        color: "#155724",
                                      }
                                    : status.name === "IN TRANSIT"
                                    ? {
                                        backgroundColor: "#fff3cd",
                                        color: "#856404",
                                      }
                                    : status.name === "DELIVERED"
                                    ? {
                                        backgroundColor: "#cce5ff",
                                        color: "#004085",
                                      }
                                    : {
                                        backgroundColor: "#e2e3e5",
                                        color: "#333",
                                      }
                                }
                              >
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

      {activeTab === "subscriptionOrders" && (
        <div className="order-management-section">
          <div className="order-management-header">
            <h3>Subscription Orders</h3>
            <div className="date-filter">
              <div>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label>End Date:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                className="search-button-order"
                onClick={handleDateSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="order-management-content">
            <table className="order-management-table">
              <thead>
                <tr>
                  <th>Order Code#</th>
                  <th>Order Date</th>
                  <th>Description</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionOrders
                  .filter((order) => {
                    if (
                      !filteredDateRange.startDate ||
                      !filteredDateRange.endDate
                    )
                      return true;
                    const orderDate = new Date(order.orderDate).setHours(
                      0,
                      0,
                      0,
                      0
                    );
                    const startDate = new Date(
                      filteredDateRange.startDate
                    ).setHours(0, 0, 0, 0);
                    const endDate = new Date(
                      filteredDateRange.endDate
                    ).setHours(0, 0, 0, 0);
                    return orderDate >= startDate && orderDate <= endDate;
                  })
                  .map((order) => (
                    <tr key={order.id}>
                      <td>#{order.code}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>{order.description}</td>
                      <td>{order.totalCost.toLocaleString("en-US")} VND</td>
                      <td
                        style={{ backgroundColor: "#d4edda", color: "#155724" }}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
