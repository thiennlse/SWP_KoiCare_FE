import React from "react";
import "./HomePage.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";
import banner_image from "../../Components/Assets/banner_image.jpg"; // You can replace this with the path of the uploaded image

const HomePage = () => {
  return (
    <div>
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

function Home() {
  return (
    <div>
      <Banner />
      <Products />
    </div>
  );
}

function Banner() {
  return (
    <div className="banner">
      <div className="banner_content">
        <img src={banner_image} alt="Fish Banner" className="banner_image" />
        <div className="banner_text">
          <h1>Best Destination <br />For <span>Your Fish</span></h1>
          <div className="banner_actions">
            <button className="shop_now_btn">SHOP NOW ➔</button>
            <p className="save_text">Save 10-20% OFF</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function Products() {
  return <div>
    <p>asdsasddasa</p>
  </div>
}

export default HomePage;
