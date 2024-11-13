import { useEffect, useState } from "react";
import "./cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import koiFood from "../../Components/Assets/KoiFood.jpeg";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "CANCELLED") {
    toast.warn("Thanh toán đã bị hủy!", { autoClose: 1500 });

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(storedCart);
  }, []);

  useEffect(() => {
    if (selectedProducts.length === products.length && products.length > 0) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedProducts, products]);

  const calculateTotalPayment = (selected) => {
    const total = selected.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setTotalPayment(total);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => ({ ...product })));
      calculateTotalPayment(products);
    } else {
      setSelectedProducts([]);
      setTotalPayment(0);
    }
    setIsSelectAll(e.target.checked);
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

  const handleUpdateQuantityAndRecalculate = (productId, newQuantity) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));

    const updatedSelectedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPayment(updatedSelectedProducts);
  };

  return (
    <>
      {products.length > 0 ? (
        <div className="body-cart">
          <Products
            products={products}
            handleSelectProduct={handleSelectProduct}
            handleUpdateQuantityAndRecalculate={
              handleUpdateQuantityAndRecalculate
            }
            totalPayment={totalPayment}
            handleSelectAll={handleSelectAll}
            selectedProducts={selectedProducts}
            isSelectAll={isSelectAll}
          />
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

function Products({
  products,
  handleSelectProduct,
  handleUpdateQuantityAndRecalculate,
  totalPayment,
  handleSelectAll,
  selectedProducts,
  isSelectAll,
}) {
  const handlePurchase = async () => {
    if (selectedProducts.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một sản phẩm!", { autoClose: 1500 });
      return;
    }

    try {
      const payload = {
        orderRequest: selectedProducts.map((product) => ({
          productId: product.id,
          cost: product.cost,
          quantity: product.quantity,
        })),
        subscriptionId: 0,
        cancelUrl: `${window.location.origin}/cart`,
        returnUrl: `${window.location.origin}/orderHistory`,
      };
      const response = await axiosInstance.post(
        "/api/Checkout/create-payment-link",
        payload
      );
      if (response.status === 200 && response.data) {
        const paymentUrl = response.data;
        localStorage.setItem("orderCode", response.data.orderCode);
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(selectedProducts)
        );
        window.location.href = paymentUrl;
      }
    } catch (error) {
      toast.error("Thanh toán thất bại! Không đủ số lượng sản phẩm", {
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="container product-container">
      <div className="row bg-secondary py-2 text-center head-cart">
        <div className="col-5 product-name text-center ">Product</div>
        <div className="col-3">Unit Price</div>
        <div className="col-2">Quantity</div>
        <div className="col-2">Total Price</div>
      </div>

      <div className="cart-container">
        {products.length > 0 ? (
          products.map((product) => (
            <Product
              key={product.id}
              item={product}
              handleSelectProduct={handleSelectProduct}
              handleUpdateQuantityAndRecalculate={
                handleUpdateQuantityAndRecalculate
              }
              isSelected={selectedProducts.some((p) => p.id === product.id)}
            />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="row align-items-center text-center py-2 payment-cart">
        <div className="col-2 tick-all">
          <input
            type="checkbox"
            checked={isSelectAll}
            onChange={handleSelectAll}
          />
          <span className="ms-2">Select All</span>
        </div>
        <div className="col ">Total Payment: {totalPayment} vnd</div>
        <div className="col">
          <button className="btn btn-primary" onClick={handlePurchase}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Product({
  item,
  handleSelectProduct,
  handleUpdateQuantityAndRecalculate,
  isSelected,
}) {
  const [count, setCount] = useState(item.quantity);

  function handleIncrease() {
    if (count < item.inStock) {
      const newCount = count + 1;
      setCount(newCount);
      handleUpdateQuantityAndRecalculate(item.id, newCount);
    }
  }

  function handleDecrease() {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      handleUpdateQuantityAndRecalculate(item.id, newCount);
    }
  }

  return (
    <div className="row align-items-center text-center border-bottom py-2">
      <div className="col-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleSelectProduct(item)}
        />
      </div>

      <div className="col-5 product-detail">
        <img
          src={item.image ? item.image : koiFood}
          alt={item.name}
          style={{ width: "80px", height: "80px", marginRight: "20px" }}
        />
        <div>{item.name}</div>
      </div>

      <div className="col-3">{item.cost} vnd</div>

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
      <div className="col-2 text-danger">{item.cost * count} vnd</div>
    </div>
  );
}

export default Cart;
