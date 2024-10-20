import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy sản phẩm đã đặt từ localStorage hoặc có thể là từ API
    const fetchOrders = () => {
      try {
        // Lấy dữ liệu selectedProduct từ localStorage
        const selectedProducts =
          JSON.parse(localStorage.getItem("selectedProducts")) || [];

        console.log(selectedProducts);
        // Giả lập đơn hàng với dữ liệu của selectedProducts
        const mockOrder = {
          id: "001", // Mã đơn hàng giả định
          orderDate: new Date().toISOString(),
          products: selectedProducts,
          totalAmount: selectedProducts.reduce(
            (total, product) => total + product.cost * product.quantity,
            0
          ),
        };

        // Giả lập lưu trữ đơn hàng
        setOrders([mockOrder]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-container container mt-4">
      <h2>Lịch sử đơn hàng</h2>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
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
  return (
    <div className="order-item border-bottom py-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="order-info">
          <h5>Đơn hàng #{order.id}</h5>
          <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Tổng tiền: {order.totalAmount} vnd</p>
        </div>
        <div>
          <button className="btn btn-outline-primary">Xem chi tiết</button>
        </div>
      </div>

      <div className="order-products">
        {order.products.map((product) => (
          <div key={product.id} className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "80px", height: "80px", marginRight: "20px" }}
              />
              <span>{product.name}</span>
            </div>
            <div>
              <span>
                {product.quantity} x {product.cost} vnd
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
