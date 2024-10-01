import "./HomePage.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import img1 from "../../Components/Assets/KoiFood.jpeg";
import { FaHeart } from "react-icons/fa";
import React, { useState } from "react";

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
      </div>
      <Footer />
    </div>
  );
};

function Home() {
  return (
    <>
      <Products />
    </>
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
      <a href="Purchase">
        <img src={productObj.img} alt="product"></img>
      </a>
      <p>{productObj.name}</p>
      <div>
        <button>Add To Cart</button>
        <button onClick={toggleFavorite}>
          <FaHeart
            className="heart_icon"
            style={{ color: isFavorite ? "red" : "black" }}
          />
        </button>
      </div>
    </li>
  );
}

export default HomePage;
