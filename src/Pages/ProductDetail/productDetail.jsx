import "./productDetail.css";
import img1 from "../../Components/Assets/KoiFood.jpeg";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function ProductDetail() {
  const location = useLocation();
  const { product } = location.state;
  console.log(product);

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

    localStorage.setItem("toastMessage", "Sản phẩm đã được thêm vào giỏ hàng!");
    window.location.href = "/cart";
  };

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
      <ToastContainer />
    </div>
  );
}

export default ProductDetail;
