import "./HomePage.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import img1 from "../../Components/Assets/KoiFood.jpeg";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react"; 

import banner_image_1 from "../../Components/Assets/banner_image_1.png";
import banner_image_2 from "../../Components/Assets/banner_image_2.png";
import banner_image_3 from "../../Components/Assets/banner_image_3.png";

const bannerImages = [
  { img: banner_image_1, title: "Your Fish" },
  { img: banner_image_2, title: "Your Fish" },
  { img: banner_image_3, title: "Your Fish" }
];

const data = [
  {
    img: img1,
    name: "Sản phẩm A",
  },
  {
    img: img1,
    name: "Sản phẩm B",
  },
  {
    img: img1,
    name: "Sản phẩm C",
  },
  {
    img: img1,
    name: "Sản phẩm D",
  },
  {
    img: img1,
    name: "Sản phẩm E",
  },
  {
    img: img1,
    name: "Sản phẩm F",
  },
  {
    img: img1,
    name: "Sản phẩm G",
  },
  {
    img: img1,
    name: "Sản phẩm H",
  },
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <div>
        <p className="product_title">Best Selling Products</p>
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
      <Banner />
      <Products />
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
  return (
    <>
      <ul className="products">
        {data.map((product, index) => (
          <Product key={index} productObj={product} />
        ))}
      </ul>
    </>
  );
}

function Product({ productObj }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <li>
      <img src={productObj.img} alt="product"></img>
      <p>{productObj.name}</p>
      <div>
        <button className="product_btn">Add To Cart</button>
        <button className="product_btn" onClick={toggleFavorite}>
          <FaHeart
            className="heart_icon"
            style={{ color: isFavorite ? "red" : "black" }}
          />
        </button>
      </div>
    </li>
  );
}

const blogData = [
  {
    date: "20 Feb",
    title: "10 Reasons To Be Helpful Towards Animals",
    content: "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: "path-to-your-image1.jpg",
  },
  {
    date: "21 Feb",
    title: "How To Know Your Pet Is Hungry",
    content: "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: "path-to-your-image2.jpg",
  },
  {
    date: "22 Feb",
    title: "Best Home For Your Pets",
    content: "At the core of our practice is the idea that cities are the incubators of our greatest achievements...",
    image: "path-to-your-image3.jpg",
  },
];

function BlogSection({ blogs }) {
  return (
    <div className="blog_section">
      <div className="blog_header">
        <h1 className="blog_title">Latest Blog Post</h1>
        <button className="read_all_btn">READ ALL ➔</button>
      </div>
      <div className="blog_container">
        {blogs.map((blog, index) => (
          <div key={index} className="blog_card">
            <img src={blog.image} alt={blog.title} className="blog_image" />
            <div className="blog_content">
              <div className="blog_date">
                <span>{blog.date}</span>
              </div>
              <h2 className="blog_card_title">{blog.title}</h2>
              <p className="blog_excerpt">{blog.content}</p>
              <a href="#" className="read_more">READ MORE</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
