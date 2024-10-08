import { useEffect, useState } from "react";
import "./cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import axios from "axios";

const Cart = () => {
  return (
    <>
      <Header />
      {/* lam cai header khac co search san pham va Ve trang chu */}
      <div className="body-cart">
        <Products />
      </div>
      <Footer />
    </>
  );
};

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("https://koicare.azurewebsites.net/api/Product")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

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
        {products.map((item) => (
          <Product key={item.id} item={item} />
        ))}
      </div>

      <Payment
      // totalPayment={totalPayment}
      // selectedProducts={selectedProducts}
      />
    </div>
  );
}

function Product({ item }) {
  const [count, setCount] = useState(1);

  const handleDelete = () => {};

  const handleIncrease = () => {
    if (count < item.inStock) setCount(count + 1);
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
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "80px", height: "80px", marginRight: "20px" }}
        ></img>
        <div>{item.name}</div>
      </div>

      <div className="col-2">{item.cost} vnd</div>
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
            value={count < item.inStock ? count : item.inStock}
            onChange={(e) =>
              count < item.inStock
                ? setCount(Number(e.target.value))
                : setCount(Number(item.inStock))
            }
            className="form-control mx-2 text-center"
            style={{ width: "100px" }}
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
          Còn {item.inStock} sản phẩm
        </div>
      </div>
      <div className="col-2 text-danger">
        {count === item.inStock ? item.cost * item.inStock : item.cost * count}{" "}
        vnd
      </div>
      <div className="col-12 text-end mt-2">
        <button className="btn btn-danger btn-sm" onclick={handleDelete}>
          Xóa
        </button>
      </div>
    </div>
  );
}

function Payment({ totalPayment, selectedProducts }) {
  return (
    <div className="row align-items-center text-center py-2">
      <div className="col-1">
        <input type="checkbox" />
      </div>
      <div className="col">Chọn tất cả</div>
      <div className="col">Tổng thanh toán vnd</div>
      <div className="col">
        <button className="btn btn-primary">Mua hàng</button>
      </div>
    </div>
  );
}

export default Cart;
