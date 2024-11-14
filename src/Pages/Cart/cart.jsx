import { useEffect, useState } from "react";
import "./cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import koiFood from "../../Components/Assets/KoiFood.jpeg";
import { toast, ToastContainer } from "react-toastify";
import { FaStore } from "react-icons/fa";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [members, setMembers] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "CANCELLED") {
    toast.warn("Thanh toán đã bị hủy!", { autoClose: 1500 });

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    localStorage.removeItem("selectedProducts");
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/api/Member");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(storedCart);
  }, []);

  const groupProductsByShop = () => {
    const groupedProducts = {};

    products.forEach((product) => {
      const member = members.find((member) => member.id === product.userId);
      const shopName = member ? member.fullName : "Unknown Shop";

      if (!groupedProducts[shopName]) {
        groupedProducts[shopName] = [];
      }
      groupedProducts[shopName].push(product);
    });

    return groupedProducts;
  };

  const renderGroupedProducts = () => {
    const groupedProducts = groupProductsByShop();
    return Object.keys(groupedProducts).map((shopName) => (
      <div key={shopName} className="shop-section">
        <h3 className="shop-name">
          <FaStore />
          {shopName}
        </h3>
        {groupedProducts[shopName].map((product) => (
          <Product
            key={product.id}
            item={product}
            handleSelectProduct={handleSelectProduct}
            handleUpdateQuantityAndRecalculate={
              handleUpdateQuantityAndRecalculate
            }
            isSelected={selectedProducts.some((p) => p.id === product.id)}
          />
        ))}
      </div>
    ));
  };

  const handleSelectProduct = (item) => {
    const isSelected = selectedProducts.find(
      (product) => product.id === item.id
    );
    let updatedSelectedProducts;

    if (isSelected) {
      updatedSelectedProducts = selectedProducts.filter(
        (product) => product.id !== item.id
      );
    } else {
      updatedSelectedProducts = [...selectedProducts, item];
    }

    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPayment(updatedSelectedProducts);
  };

  const calculateTotalPayment = (selected) => {
    const total = selected.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setTotalPayment(total);
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products);
    }
    setIsSelectAll(!isSelectAll);
    calculateTotalPayment(isSelectAll ? [] : products);
  };

  const handleUpdateQuantityAndRecalculate = (id, newQuantity) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProducts(updatedProducts);
    calculateTotalPayment(selectedProducts);
  };

  const handlePurchase = () => {
    toast.success("Purchase successful!");
  };

  return (
    <>
      <div className="head-cart">
        <div className="row">
          <div className="col">Product</div>
          <div className="col">Unit Price</div>
          <div className="col">Quantity</div>
          <div className="col">Total Price</div>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="body-cart">
          {renderGroupedProducts()}
          <div className="row align-items-center text-center py-2 payment-cart">
            <div className="col-2 tick-all">
              <input
                type="checkbox"
                checked={isSelectAll}
                onChange={handleSelectAll}
              />
              <span className="ms-2">Select All</span>
            </div>
            <div className="col">Total Payment: {totalPayment} vnd</div>
            <div className="col">
              <button className="btn btn-primary" onClick={handlePurchase}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/product">
            <button className="btn btn-warning">Shop now</button>
          </a>
        </div>
      )}
      <ToastContainer containerId="containerCancel" />
    </>
  );
};

function Product({
  item,
  handleSelectProduct,
  handleUpdateQuantityAndRecalculate,
  isSelected,
}) {
  const [count, setCount] = useState(item.quantity);

  const handleIncrease = () => {
    if (count < item.inStock) {
      const newCount = count + 1;
      setCount(newCount);
      handleUpdateQuantityAndRecalculate(item.id, newCount);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      handleUpdateQuantityAndRecalculate(item.id, newCount);
    }
  };

  return (
    <div className="row align-items-center text-center border-bottom py-2">
      <div className="col-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleSelectProduct(item)}
        />
      </div>
      <div className="col-2 product-detail">
        <img
          src={item.image ? item.image : koiFood}
          alt={item.name}
          style={{ width: "80px", height: "80px", marginRight: "20px" }}
        />
        <div>{item.name}</div>
      </div>
      <div className="col-3 cart-price">{item.cost} vnd</div>
      <div className="col-3">
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
            className="form-control mx-2 text-center"
            style={{ width: "100px" }}
            readOnly
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
          {item.inStock} products remaining
        </div>
      </div>
      <div className="col-3 text-danger">{item.cost * count} vnd</div>{" "}
    </div>
  );
}

export default Cart;
