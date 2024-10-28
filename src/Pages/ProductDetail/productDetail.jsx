import "./productDetail.css";
import img1 from "../../Components/Assets/KoiFood.jpeg";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

function ProductDetail() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { product } = location.state;
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Product?page=1&pagesize=100"
        );
        const products = response.data;

        const shuffledProducts = products.sort(() => 0.5 - Math.random());

        const randomProducts = shuffledProducts.slice(0, 4);

        setSuggestedProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching suggested products", error);
      }
    };

    fetchSuggestedProducts();
  }, []);

  const handleBuyNow = () => {
    const isLogin = localStorage.getItem("userId");

    if (!isLogin) {
      toast.warn("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === product.id);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  function handleBuySuggestedProducct(suggestedProduct) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === suggestedProduct.id);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.push({ ...suggestedProduct, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  }

  return (
    <div className="page-container">
      <div className="product-wrapper">
        <img src={product.image ? product.image : img1} alt="Koi Food" />
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <button onClick={handleBuyNow}>{product.cost}$ - Buy</button>
        </div>
      </div>

      {token ? (
        <div className="suggested-products">
          <h3>Suggested Products</h3>
          <div className="product-grid">
            {suggestedProducts.map((suggestedProduct) => (
              <div key={suggestedProduct.id} className="product-item">
                <img
                  src={suggestedProduct.image ? suggestedProduct.image : img1}
                  alt={suggestedProduct.name}
                />
                <h4>{suggestedProduct.name}</h4>
                <p>{suggestedProduct.cost} Vnd</p>
                <button
                  onClick={() => handleBuySuggestedProducct(suggestedProduct)}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}

      <ToastContainer />
    </div>
  );
}

export default ProductDetail;
