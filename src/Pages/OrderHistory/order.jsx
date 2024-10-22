import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const memberId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Order?page=1&pageSize=10"
        );
        if (response.status === 200) {
          const filteredOrders = response.data.filter(
            (order) => order.memberId === parseInt(memberId)
          );
          setOrders(filteredOrders);
          console.log("Filtered Orders:", ...filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [memberId]);

  return (
    <div className="order-history-container container mt-4">
      <h2>Lịch sử đơn hàng</h2>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderItem key={order.code} order={order} />
          ))}
        </div>
      ) : (
        <div className="empty-order-history">
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
  const products = order.description ? order.description.split(",") : [];

  return (
    <div className="order-item border-bottom py-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="row w-100">
          <div className="col-4 text-center">
            <h5>Đơn hàng #{order.code}</h5>
          </div>
          <div className="col-4 text-center">
            <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          <div className="col-4 text-center">
            <p>Tổng tiền: {order.totalCost} vnd</p>
          </div>
          <div className="col-4 text-center">
            <p>Trạng thái: {order.status}</p>
          </div>
        </div>
        <div>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="order-products">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <span>{product.trim()}</span>
                </div>
              </div>
            ))
          ) : (
            <span>Không có sản phẩm trong đơn hàng.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
