import "./HomePage.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await axios.get(
          "https://koicareapi.azurewebsites.net/api/Blog"
        );
        setBlogData(res.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogData();
  }, []);

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
};

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
  const productsPerPage = 4;

  useEffect(() => {
    axios
      .get("https://koicareapi.azurewebsites.net/api/Product")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  function handleAddToCart(productObj) {
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
    toast.success(`${productObj.name} đã được thêm vào giỏ hàng!`, {
      autoClose: 2000,
    });

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === productObj.id);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      const selectedProduct = products.find(
        (product) => product.id === productObj.id
      );
      cart.push({ ...selectedProduct, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="products_scroll" className="product_wrapper">
      <h1 className="product_title">Best Selling Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul className="products">
          {currentProducts.map((product, index) => (
            <Product
              key={index}
              productObj={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </ul>
      )}

      <nav
        aria-label="Page navigation"
        className="d-flex justify-content-center mt-4"
      >
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function Product({ productObj, onAddToCart }) {
  const formattedCost = productObj.cost.toLocaleString("en-US");
  const navigate = useNavigate();

  function handleClick() {
    console.log(productObj);
    navigate(`/product/${productObj.id}`, { state: { product: productObj } });
  }
  return (
    <li>
      <div className="image_product">
        <img
          src={productObj.image === "" ? koiFood : productObj.image}
          alt={productObj.name}
          onClick={handleClick}
        ></img>
      </div>
      <div className="product_price">
        <p>{productObj.name}</p>
        <p>{formattedCost} Vnd</p>
      </div>

      <div>
        <button className="product_btn" onClick={() => onAddToCart(productObj)}>
          Add To Cart
        </button>
      </div>
    </li>
  );
}

function BlogSection({ blogs }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const blogsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleReadAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div id="blog_scroll" className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">Latest Blog Posts</h1>
        <button className="btn btn-primary" onClick={handleReadAll}>
          {showAll ? "SHOW LESS" : "READ ALL"} ➔
        </button>
      </div>

      <div className="row">
        {(showAll ? blogs : currentBlogs).map((blog, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={blog.image ? blog.image : blog_image_1}
                className="card-img-top"
                alt={blog.title}
              />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content}</p>
                <a href="#" className="btn btn-outline-primary">
                  READ MORE
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && (
        <nav
          aria-label="Page navigation"
          className="d-flex justify-content-center mt-4"
        >
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} of {totalPages}
              </span>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default HomePage;
