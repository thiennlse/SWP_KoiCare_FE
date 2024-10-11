
import "./HomePage.css";
import axios from "axios";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import { useState, useEffect } from "react";

import koiFood from "../../Components/Assets/KoiFood.jpeg";

import banner_image_1 from "../../Components/Assets/banner_image_1.png";
import banner_image_2 from "../../Components/Assets/banner_image_2.png";
import banner_image_3 from "../../Components/Assets/banner_image_3.png";

import blog_image_1 from "../../Components/Assets/blog_imgae_1.png";
import blog_image_2 from "../../Components/Assets/blog_imgae_2.png";
import blog_image_3 from "../../Components/Assets/blog_imgae_3.png";

const bannerImages = [
  { img: banner_image_1, title: "Your Fish" },
  { img: banner_image_2, title: "Your Fish" },
  { img: banner_image_3, title: "Your Fish" },
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <div>
        <Home />
      </div>
      <Footer />
    </div>
  );
};

function Home() {
  const cart = [];

  return (
    <>
      <div id="banner_scroll">
        <Banner />
      </div>
      <div id="products_scroll">
        <Products cart={cart} />
      </div>
      <div id="blog_scroll">
        <BlogSection blogs={blogData} />
      </div>
    </>
  );
}

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="banner">
      <div className="banner_content">
        <img
          src={bannerImages[currentIndex].img}
          alt="Banner"
          className="banner_image"
        />
        <div className="banner_text">
          <h1>
            Best Destination <br />
            For <span>{bannerImages[currentIndex].title}</span>
          </h1>
          <div className="banner_actions">
            <button className="shop_now_btn">SHOP NOW ➔</button>
            <p className="save_text">Save 10-20% OFF</p>
          </div>
        </div>
      </div>
      <div className="banner_dots">
        {bannerImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

function Products({ cart }) {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [items, SetItems] = useState();

  function handleAddToCart(productId) {
    // Lấy giỏ hàng từ local storage, nếu chưa có thì tạo mảng rỗng
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const productInCart = cart.find((item) => item.id === productId);

    if (productInCart) {
      // Nếu sản phẩm đã có, tăng số lượng
      productInCart.quantity += 1;
    } else {
      // Nếu sản phẩm chưa có, thêm mới với số lượng 1
      const selectedProduct = products.find(
        (product) => product.id === productId
      );
      cart.push({ ...selectedProduct, quantity: 1 });
    }

    // Lưu giỏ hàng đã cập nhật vào local storage
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  useEffect(() => {
    axios
      .get("https://koicare.azurewebsites.net/api/Product")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div id="products_scroll" className="product_wrapper">
      <h1 className="product_title">Best Selling Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul className="products">
          {products.map((product, index) => (
            <Product
              key={index}
              productObj={product}
              onAddToCart={handleAddToCart}
              items={items}
              SetItems={SetItems}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Product({ productObj, onAddToCart, items, SetItems }) {
  const formattedCost = productObj.cost.toLocaleString("en-US");
  return (
    <li>
      <div className="image_product">
        <a href="Purchase">
          <img
            src={productObj.image === "" ? koiFood : productObj.image}
            alt={productObj.name}
          ></img>
        </a>
      </div>
      <div className="product_price">
        <p>{productObj.name}</p>
        <p>{formattedCost} Vnd</p>
      </div>

      <div>
        <button
          className="product_btn"
          onClick={() => onAddToCart(productObj.id)}
        >
          Add To Cart
        </button>
      </div>
    </li>
  );
}

const blogData = [
  {
    date: "20 Feb",
    title: "10 Reasons To Be Helpful Towards Animals",
    content:
      "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: blog_image_1,
  },
  {
    date: "21 Feb",
    title: "How To Know Your Pet Is Hungry",
    content:
      "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: blog_image_2,
  },
  {
    date: "22 Feb",
    title: "Best Home For Your Pets",
    content:
      "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: blog_image_3,
  },
];

function BlogSection({ blogs }) {
  return (
    <div id="blog_scroll" className="blog_section">
      <div className="blog_header">
        <h1 className="blog_title">Latest Blog Post</h1>
        <button className="read_all_btn">READ ALL ➔</button>
      </div>
      <div className="blog_container">
        {blogs.map((blog, index) => (
          <div key={index} className="blog_card">
            <a href="#">
              <img src={blog.image} alt={blog.title} className="blog_image" />
            </a>
            <div className="blog_content">
              <div className="blog_date">
                <span>{blog.date}</span>
              </div>
              <a href="#">
                <h2 className="blog_card_title">{blog.title}</h2>
              </a>
              <p className="blog_excerpt">{blog.content}</p>
              <a href="#" className="read_more">
                READ MORE
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
