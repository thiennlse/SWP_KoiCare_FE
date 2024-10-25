import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import koiFood from "../../Components/Assets/KoiFood.jpeg";
import { useLocation } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const memberId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Order?page=1&pageSize=100"
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

    fetchOrders();
  }, [memberId]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const selectedProducts = JSON.parse(
      localStorage.getItem("selectedProducts")
    );

    const email = JSON.parse(localStorage.getItem("emailUser"));

    if (status === "PAID") {
      // Prepare order request
      const productIds = selectedProducts?.map((product) => product.id);
      const quantities = selectedProducts?.map((product) => product.quantity);
      const totalCost = selectedProducts?.reduce(
        (sum, product) => sum + product.cost * product.quantity,
        0
      );
      const description = selectedProducts
        ?.map((product) => `${product.name} x ${product.quantity}`)
        .join(", ");

      const orderRequest = {
        productId: productIds,
        quantity: quantities,
        totalCost: totalCost,
        closeDate: new Date().toISOString(),
        description: description,
        code: orderCode,
        status: status,
      };
      // Call the order/add API
      axiosInstance
        .post("/api/Order/add", orderRequest)
        .then(() => {
          toast.success("Đơn hàng đã được thêm thành công!", {
            autoClose: 1500,
          });
          localStorage.removeItem("cart");
        })
        .catch((error) => {
          toast.error("Lỗi khi thêm đơn hàng!", { autoClose: 1500 });
        });
      setTimeout(() => {
        axiosInstance.post(`/api/Checkout/send-email/${orderCode}`, {
          recipientEmail: email,
        });
      }, 5000);

      localStorage.removeItem("selectedProducts");
    }
  }, [location.search]);

  return (
    <div
      className=" container mt-4"
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Lịch sử đơn hàng</h2>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderItem key={order.code} order={order} />
          ))}
        </div>
      ) : (
        <div className="empty-order-history text-center mt-4">
          <p>Bạn chưa có đơn hàng nào.</p>
          <a href="/product">
            <button className="btn btn-warning">Mua sắm ngay</button>
          </a>
        </div>
      )}
    </div>
  );
};

const OrderItem = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const products = order.orderProducts ? order.orderProducts : [];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "Chưa thanh toán":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      case "Đang xử lý":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#333" };
    }
  };

  return (
    <div className="order-item border-bottom py-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>Đơn hàng #{order.code}</h5>
          <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Tổng tiền: {order.totalCost.toLocaleString()} vnd</p>
          <div
            className="status-badge"
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              ...getStatusStyle(order.status),
            }}
          >
            <strong>Trạng thái:</strong> {order.status}
          </div>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
        </button>
      </div>

      {showDetails && (
        <div className="order-products mt-4">
          {products.length > 0 ? (
            <div>
              {products.map((orderProduct, index) => (
                <div
                  key={index}
                  className="product-item d-flex align-items-center mb-2"
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
                    <strong>
                      {orderProduct.product.name.length > 20
                        ? orderProduct.product.name.slice(0, 20) + "..."
                        : orderProduct.product.name}
                    </strong>
                    <p style={{ margin: "0" }}>
                      {orderProduct.product.cost.toLocaleString()} vnd
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span>Không có sản phẩm trong đơn hàng.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
