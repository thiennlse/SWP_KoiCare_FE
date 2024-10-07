import { useState } from "react";
import "./cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const Cart = () => {
  return (
    <>
      <Header />
      {/* lam cai header khac co search san pham va Ve trang chu */}
      <div className="body-cart">
        <Products />
        <Payment />
      </div>
      <Footer />
    </>
  );
};

const mockProducts = [
  { id: 1, name: "Product 1", price: 100000, quantity: 2, stock: 5 },
  { id: 2, name: "Product 2", price: 200000, quantity: 1, stock: 3 },
  { id: 3, name: "Product 3", price: 150000, quantity: 3, stock: 8 },
  { id: 4, name: "Product 4", price: 300000, quantity: 1, stock: 10 },
  { id: 5, name: "Product 5", price: 250000, quantity: 2, stock: 6 },
  { id: 6, name: "Product 6", price: 120000, quantity: 5, stock: 2 },
  { id: 7, name: "Product 7", price: 400000, quantity: 1, stock: 4 },
  { id: 8, name: "Product 8", price: 600000, quantity: 1, stock: 1 },
  { id: 9, name: "Product 9", price: 350000, quantity: 4, stock: 7 },
  { id: 10, name: "Product 10", price: 450000, quantity: 2, stock: 3 },
];

function Products() {
  return (
    <div className="container product-container">
      <div className="row bg-light py-2 text-center">
        <div className="col-1">
          <input type="checkbox" />
        </div>

        <div className="col-5 product-name ">Sản phẩm</div>
        <div className="col-2">Đơn Giá</div>
        <div className="col-2">Số Lượng</div>
        <div className="col-2">Số tiền</div>
      </div>

      <div className="cart-container">
        {mockProducts.map((item) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function Product({ item }) {
  const [count, setCount] = useState(1);

  const handleIncrease = () => {
    if (count < item.stock) setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  return (
    <div className="row align-items-center text-center border-bottom py-2">
      <div className="col-1">
        <input type="checkbox" />
      </div>

      <div className="col-5 product-detail">
        <img src="#" alt={item.name} className="img-fluid"></img>
        <div>{item.name}</div>
      </div>

      <div className="col-2">{item.price}đ</div>
      <div className="col-2">
        <div className="calc-count d-flex justify-content-center">
          <button
            className="btn btn-outline-secondary"
            onClick={handleDecrease}
            style={{ width: "40px" }}
          >
            -
          </button>
          <input
            type="text"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-control mx-2 text-center"
            style={{ width: "40px" }}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleIncrease}
            style={{ width: "40px" }}
          >
            +
          </button>
        </div>
        <div className="product-remain text-danger">
          Còn {item.stock} sản phẩm
        </div>
      </div>
      <div className="col-2 text-danger">{item.price * count}đ</div>
      <div className="col-12 text-end mt-2">
        <button className="btn btn-danger btn-sm">Xóa</button>
      </div>
    </div>
  );
}

function Payment() {
  return <></>;
}

export default Cart;
