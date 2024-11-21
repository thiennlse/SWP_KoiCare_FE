import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import koiFood from "../../Components/Assets/KoiFood.jpeg";
import { useLocation } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const memberId = localStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    const handleOrderPostAndFetch = async () => {
      const searchParams = new URLSearchParams(location.search);
      const status = searchParams.get("status");
      const orderCode = searchParams.get("orderCode");
      const selectedProducts = JSON.parse(
        localStorage.getItem("selectedProducts")
      );
      const subscriptionId = localStorage.getItem("subscriptionId");
      const isPaySubscribe = JSON.parse(localStorage.getItem("paySubscibe"));
      const email = JSON.parse(localStorage.getItem("emailUser"));

      if (status === "PAID") {
        const productIds = selectedProducts?.map((product) => product.id);
        const quantities = selectedProducts?.map((product) => product.quantity);
        const totalCost = selectedProducts?.reduce(
          (sum, product) => sum + product.cost * product.quantity,
          0
        );
        const description = selectedProducts
          ?.map((product) => `${product.name} x ${product.quantity}`)
          .join(", ");

        let subCost = 0;
        let subPackage = "";

        try {
          const response = await axiosInstance.get(
            `api/subcriptions/${subscriptionId}`
          );
          subCost = response.data.price;
          subPackage = response.data.name;
          console.log(subCost, subPackage);
        } catch (error) {
          console.error("Error fetching subscription cost:", error);
        }
        const orderRequest = {
          productId: isPaySubscribe ? [0] : productIds,
          subcriptionId: isPaySubscribe ? subscriptionId : 0,
          quantity: isPaySubscribe ? [0] : quantities,
          totalCost: isPaySubscribe ? subCost : totalCost,
          closeDate: new Date(
            new Date().getTime() - 3 * 60 * 1000
          ).toISOString(),
          code: orderCode,
          description: isPaySubscribe ? subPackage : description,
          status,
        };

        try {
          await axiosInstance.post("/api/Order/add", orderRequest);
          toast.success("Đơn hàng đã được thêm thành công!", {
            autoClose: 1500,
          });
          if (subscriptionId !== null) {
            await axiosInstance.post(
              `/api/Member/subcription/${subscriptionId}`
            );
            localStorage.setItem("subId", subscriptionId);
            localStorage.removeItem("subscriptionId");
            localStorage.removeItem("paySubscibe");
          }
          localStorage.removeItem("cart");

          setTimeout(async () => {
            await axiosInstance.post(`/api/Checkout/send-email/${orderCode}`, {
              recipientEmail: email,
            });
          }, 5000);

          await fetchOrders(searchTerm);

          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          localStorage.removeItem("selectedProducts");
        } catch (error) {
          console.log(error);
          toast.error("Lỗi khi thêm đơn hàng!", { autoClose: 1500 });
        }
      }
    };

    handleOrderPostAndFetch();
  }, [location.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchOrders = async (searchTerm = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/Order?page=1&pageSize=100&searchTerm=${searchTerm}`
      );
      if (response.status === 200) {
        const filteredOrders = response.data.filter(
          (order) => order.memberId === parseInt(memberId)
        );
        setOrders(filteredOrders);
      }
    } catch (error) {
      toast.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(debouncedSearchTerm);
  }, [memberId, debouncedSearchTerm]);

  return (
    <div
      className=" container mt-5"
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Order history</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderItem key={order.code} order={order} />
          ))}
        </div>
      ) : (
        <div className=" text-center mt-4">
          <p>You have no orders yet.</p>
          <a href="/product">
            <button className="btn btn-warning">Shop Now</button>
          </a>
        </div>
      )}
    </div>
  );
};

const OrderItem = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const products = order.orderProducts ? order.orderProducts : [];
  const memberExpired = JSON.parse(localStorage.getItem("memberExpired"));
  const getSubscriptionType = (subcriptionId) => {
    if (subcriptionId === 1) {
      return "Standard";
    } else if (subcriptionId === 2) {
      return "Premium";
    }
    return "Unknown Subscription";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "IN TRANSIT":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case "DELIVERED":
        return { backgroundColor: "#cce5ff", color: "#004085" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#333" };
    }
  };

  return (
    <div className="order-item border-bottom py-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>Order #{order.code}</h5>
          <p>Order date: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Total amount: {order.totalCost.toLocaleString()} vnd</p>
          <div
            className="status-badge"
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              ...getStatusStyle(order.status),
            }}
          >
            <strong>Status:</strong> {order.status}
          </div>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide details" : "See details"}
        </button>
      </div>

      {showDetails && (
        <div className="order-products mt-4">
          {products.length > 0 ? (
            <div>
              {products.map((orderProduct, index) => {
                if (orderProduct.product) {
                  return (
                    <div
                      key={index}
                      className="product-item-history d-flex align-items-center mb-2"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      <img
                        src={orderProduct.product.image || koiFood}
                        alt={orderProduct.product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <strong className="product-name">
                          {orderProduct.product.name.length > 20
                            ? orderProduct.product.name.slice(0, 20) + "..."
                            : `${orderProduct.product.name} x${orderProduct.quantity}`}
                        </strong>
                        <p style={{ margin: "0", color: "#000" }}>
                          {orderProduct.product.cost.toLocaleString()} vnd
                        </p>
                        <p>
                          Total amount ({orderProduct.quantity} product):{" "}
                          {(
                            orderProduct.product.cost * orderProduct.quantity
                          ).toLocaleString()}{" "}
                          vnd
                        </p>
                      </div>
                    </div>
                  );
                } else if (orderProduct.subcriptionId) {
                  return (
                    <div
                      key={index}
                      className="subscription-item-history d-flex align-items-center mb-2"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      <div>
                        <p>
                          Subscription:{" "}
                          <strong>
                            {getSubscriptionType(orderProduct.subcriptionId)}{" "}
                            Package
                          </strong>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <span>There are no products or subscriptions in the order.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
