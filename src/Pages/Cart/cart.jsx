import { useEffect, useState } from "react";
import "./cart.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // Get cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(storedCart);
  }, []);

  // Calculate total payment for selected products
  const calculateTotalPayment = (selected) => {
    const total = selected.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setTotalPayment(total);
  };

  // Select or deselect all products
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // If checked, select all products
      setSelectedProducts(products.map((product) => ({ ...product })));
      calculateTotalPayment(products); // Calculate total for all products
    } else {
      // If unchecked, deselect all products
      setSelectedProducts([]);
      setTotalPayment(0); // Reset total to 0
    }
  };

  // Handle product selection
  const handleSelectProduct = (item) => {
    const isSelected = selectedProducts.find(
      (product) => product.id === item.id
    );
    let updatedSelectedProducts;

    if (isSelected) {
      // If the product is already selected, deselect it
      updatedSelectedProducts = selectedProducts.filter(
        (product) => product.id !== item.id
      );
    } else {
      // If the product is not selected, add it to the selected list
      updatedSelectedProducts = [...selectedProducts, item];
    }

    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPayment(updatedSelectedProducts); // Recalculate total payment
  };

  // Update quantity and recalculate total
  const handleUpdateQuantityAndRecalculate = (productId, newQuantity) => {
    let updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    setProducts(updatedProducts);

    // Update selected products and recalculate total if the product is selected
    const updatedSelectedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPayment(updatedSelectedProducts); // Update total payment
  };

  // Delete product from cart and update total payment
  const handleDeleteProduct = (item) => {
    let updatedProducts = products.filter((product) => product.id !== item.id);
    setProducts(updatedProducts);

    // Update cart in localStorage
    localStorage.setItem("cart", JSON.stringify(updatedProducts));

    // Update selected products
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.id !== item.id
    );
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPayment(updatedSelectedProducts); // Update total payment
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
            handleDeleteProduct={handleDeleteProduct}
            totalPayment={totalPayment}
            handleSelectAll={handleSelectAll}
            selectedProducts={selectedProducts}
          />
        </div>
      ) : (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn còn trống</p>
          <a href="/product">
            <button className="btn btn-warning">Mua ngay</button>
          </a>
        </div>
      )}
    </>
  );
};

function Products({
  products,
  handleSelectProduct,
  handleUpdateQuantityAndRecalculate,
  handleDeleteProduct,
  totalPayment,
  handleSelectAll,
  selectedProducts,
}) {
  return (
    <div className="container product-container">
      <div className="row bg-secondary py-2 text-center head-cart">
        <div className="col-5 product-name">Sản phẩm</div>
        <div className="col-2">Đơn Giá</div>
        <div className="col-2">Số Lượng</div>
        <div className="col-2">Số tiền</div>
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
              handleDeleteProduct={handleDeleteProduct}
              isSelected={selectedProducts.some((p) => p.id === product.id)}
            />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {/* Checkbox for Select All */}
      <div className="row align-items-center text-center py-2 payment-cart">
        <div className="col-2 tick-all">
          <input type="checkbox" onChange={handleSelectAll} />
          <span className="ms-2">Chọn tất cả</span>
        </div>
        <div className="col ">Tổng thanh toán: {totalPayment} vnd</div>
        <div className="col">
          <button className="btn btn-primary">Mua hàng</button>
        </div>
      </div>
    </div>
  );
}

function Product({
  item,
  handleSelectProduct,
  handleUpdateQuantityAndRecalculate,
  handleDeleteProduct,
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

      <div className="col-5 product-detail">
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "80px", height: "80px", marginRight: "20px" }}
        />
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
          Còn {item.inStock} sản phẩm
        </div>
      </div>
      <div className="col-2 text-danger">{item.cost * count} vnd</div>
      <div className="col-12 text-end mt-2">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDeleteProduct(item)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export default Cart;
