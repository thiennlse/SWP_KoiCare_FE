import "./HomePage.css";
import axios from "axios";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import img1 from "../../Components/Assets/KoiFood.jpeg";
import { FaHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useState, useEffect } from "react";

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

const data = [
  {
    img: img1,
    name: "Sản phẩm A Sản phẩm ASản phẩm ASản phẩm ASản phẩm ASản phẩm A ",
    price: "200.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm B",
    price: "250.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm C",
    price: "300.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm D",
    price: "350.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm E",
    price: "400.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm F",
    price: "450.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm G",
    price: "500.000đ",
  },
  {
    img: img1,
    name: "Sản phẩm H",
    price: "550.000đ",
  },
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <div>
        <Home />
        <BlogSection blogs={blogData} />
      </div>
      <Footer />
    </div>
  );
};

function Home() {
  return (
    <>
      <div id="banner_scroll">
        <Banner />
      </div>
      <div id="products_scroll">
        <Products />
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

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({}); // Store quantities for products
  const productsPerPage = 8; // Display 8 products per page

  useEffect(() => {
    // Fetch products from the API
    axios
      .get("https://koicare.azurewebsites.net/api/Product")
      .then((response) => {
        setProducts(response.data); // Update the state with the fetched products
        setLoading(false); // Set loading to false after the data is fetched
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Get current products for the page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Function to handle page change
  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [index]: newQuantity,
    }));
  };

  return (
    <div id="products_scroll" className="product_wrapper">
      <h1 className="product_title">Best Selling Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <ul className="products">
            {currentProducts.map((product, index) => (
              <Product
                key={index}
                productObj={product}
                quantity={quantities[index] || 1} // Get the stored quantity or default to 1
                updateQuantity={updateQuantity} // Pass the update function
              />
            ))}
          </ul>

          <div className="pagination_buttons">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous Page
            </button>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage >= Math.ceil(products.length / productsPerPage)
              }
            >
              Next Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Product({ productObj }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <li>
      <a href="Purchase">
        <img src={productObj.image} alt={productObj.name} />
      </a>
      <div className="product_price">
        <p>{productObj.name}</p>
        <p>{productObj.cost} Vnd</p>
      </div>

      <div className="calc">
        {count > 1 ? (
          <button onClick={() => setCount((c) => c - 1)}>-</button>
        ) : (
          <button onClick={() => setCount((c) => c)}>-</button>
        )}
        <input
          type="text"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        ></input>
        <button onClick={() => setCount((c) => c + 1)}>+</button>
      </div>

      <div>
        <button className="product_btn">Add To Cart</button>
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
