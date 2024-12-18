import "./HomePage.css";
import axiosInstance from "../axiosInstance";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowUp } from "react-icons/fa";
import CalcAds from "./calcAds";
import SubScription from "./subscription";
import koiFood from "../../Components/Assets/KoiFood.jpeg";
import { FaStore } from "react-icons/fa";
import blog_image_1 from "../../Components/Assets/blog_imgae_1.png";

const bannerImages = [
  {
    img: "https://res.cloudinary.com/dkedkbs8d/image/upload/v1732030738/nflxazt9erg8ouacwwew.png",
    title: "Your Fish",
  },
  {
    img: "https://res.cloudinary.com/dkedkbs8d/image/upload/v1732030854/odeyjjnj3zpyo4luzkkp.png",
    title: "Your Fish",
  },
  {
    img: "https://res.cloudinary.com/dkedkbs8d/image/upload/v1732030887/zpur3kgyvkekkkx2hm0i.png",
    title: "Your Fish",
  },
];

const scrollToBestSelling = () => {
  const bestSellingSection = document.getElementById("products_scroll");
  if (bestSellingSection) {
    bestSellingSection.scrollIntoView({ behavior: "smooth" });
  }
};

const HomePage = () => {
  const [blogData, setBlogData] = useState([]);
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await axiosInstance.get("/api/Blog");
        const publicBlogs = res.data.filter(
          (blog) => blog.status === "Publish"
        );
        setBlogData(publicBlogs);
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
      <SubScription />
      <CalcAds />
      <div id="products_scroll">
        <Products />
      </div>

      <div id="blog_scroll">
        <BlogSection blogs={blogData} />
      </div>
      <ScrollToTop />
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
          loading="lazy"
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
            <button className="shop_now_btn" onClick={scrollToBestSelling}>
              SHOP NOW ➔
            </button>
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
      <ToastContainer containerId="containerHome" />
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [members, setMembers] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProductsAndMembers = async () => {
      try {
        const productResponse = await axiosInstance.get(
          "/api/Product?page=1&pagesize=100"
        );
        const memberResponse = await axiosInstance.get("/api/Member");
        setProducts(productResponse.data);
        setMembers(memberResponse.data);
        console.log(memberResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products or members:", error);
        setLoading(false);
      }
    };

    fetchProductsAndMembers();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (selectedShop === "") return true;
      const member = members.find((member) => member.id === product.userId);
      return member?.fullName === selectedShop;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "price") {
      return a.cost - b.cost;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  function handleAddToCart(productObj) {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role !== "Member") {
      toast.warn("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        autoClose: 500,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === productObj.id);

    if (productInCart) {
      if (productInCart.quantity >= productObj.inStock) {
        toast.error("Số lượng vượt quá tồn kho!", {
          autoClose: 500,
        });
        return;
      }
      productInCart.quantity += 1;
    } else {
      if (productObj.inStock <= 0) {
        toast.error("Sản phẩm đã hết hàng!", {
          autoClose: 500,
        });
        return;
      }
      cart.push({ ...productObj, quantity: 1 });
    }

    toast.success(`${productObj.name} đã được thêm vào giỏ hàng!`, {
      autoClose: 500,
    });

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
      <div className="product-search">
        <h1 className="product_title">Best Selling Products</h1>
        <div className="filter-sort-container">
          <input
            type="text"
            className="search-product"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="name">Product Name</option>
            <option value="price">Price</option>
          </select>
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="">All Shops</option>
            {members
              .filter((members) => members.role.name === "ShopOwner")
              .map((member) => (
                <option key={member.id} value={member.fullName}>
                  {member.role.id === 2 ? member.fullName : ""}
                </option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul className="products">
          {currentProducts.map((product) => {
            const member = members.find(
              (member) => member.id === product.userId
            );
            return (
              <Product
                key={product.id}
                productObj={product}
                onAddToCart={handleAddToCart}
                shopName={member ? member.fullName : "Unknown Shop"}
              />
            );
          })}
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

function Product({ productObj, onAddToCart, shopName }) {
  const formattedCost = productObj.cost.toLocaleString("en-US");
  const navigate = useNavigate();

  function handleClick(e) {
    if (e.target.classList.contains("product_btn")) {
      return;
    }

    navigate(`/product/${productObj.id}`, { state: { product: productObj } });
    window.scrollTo(0, 0);
  }

  return (
    <li onClick={handleClick}>
      <div className="image_product">
        <img
          loading="lazy"
          src={productObj.image === "" ? koiFood : productObj.image}
          alt={productObj.name}
          onClick={handleClick}
        />
      </div>
      <div className="product_price">
        <p className="name-ellipsis">{productObj.name}</p>
        <p className="shop_name">
          <FaStore /> {shopName}
        </p>
        <p className="product_description ellipsis">{productObj.description}</p>
        <p>{formattedCost} Vnd</p>
      </div>

      <div className="button-container">
        {productObj.inStock === 0 ? (
          <button className="product_btn out_of_stock" disabled>
            Out of Stock
          </button>
        ) : (
          <button
            className="product_btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(productObj);
            }}
          >
            Add To Cart
          </button>
        )}
      </div>
    </li>
  );
}

function BlogSection({ blogs }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const blogsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const navigate = useNavigate();

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

  const handleBlogClick = (blog, e) => {
    navigate(`/blog/${blog.id}`, {
      state: {
        blog: {
          id: blog.id,
          title: blog.title,
          content: blog.content,
          image: blog.image || blog_image_1,
          createdAt: blog.createdAt,
        },
      },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div id="blog_scroll" className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="blog_title">Latest Blog Posts</h1>
        <button className="btn btn-primary" onClick={handleReadAll}>
          {showAll ? "SHOW LESS" : "READ ALL"} ➔
        </button>
      </div>

      <div className="row">
        {(showAll ? blogs : currentBlogs).map((blog, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div
              className="card h-100"
              onClick={(e) => handleBlogClick(blog, e)}
            >
              <img
                loading="lazy"
                src={blog.image ? blog.image : blog_image_1}
                className="card-img-top"
                alt={blog.title}
              />
              <div className="card-body">
                <h5 className="card-title blog-title-ellipsis">{blog.title}</h5>
                <p className="card-text blog-content-ellipsis">
                  {blog.content}
                </p>
                <button
                  className="btn btn-outline-primary read-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlogClick(blog, e);
                  }}
                >
                  READ MORE
                </button>
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

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      <FaArrowUp />
    </button>
  );
};

export default HomePage;
