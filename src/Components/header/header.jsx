import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import logo from "../Assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import Avatar, { genConfig } from "react-nice-avatar";
import axiosInstance from "../../Pages/axiosInstance";
import koiFood from "../Assets/KoiFood.jpeg";

function Header() {
  const [user, setUser] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [servicesDropdownVisible, setServicesDropdownVisible] = useState(false);
  const [cartDropdownVisible, setCartDropdownVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const role = JSON.parse(localStorage.getItem("role"));
  const config = genConfig("hi@dapi.to");
  const handleBackToAdmin = () => {
    window.location.href = "/admin";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/api/Member/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const updateCartItems = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };

    updateCartItems();
    window.addEventListener("storage", updateCartItems);
    const interval = setInterval(updateCartItems, 1000);

    return () => {
      window.removeEventListener("storage", updateCartItems);
      clearInterval(interval);
    };
  }, []);

  const toggleCartDropdown = (visible) => {
    setCartDropdownVisible(visible);
  };

  const handleLogout = () => {
    toast.success("Logout successful!", { autoClose: 1500 });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("cart");
    localStorage.removeItem("emailUser");
    localStorage.removeItem("orderCode");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const toggleDropdown = (visible) => {
    setDropdownVisible(visible);
  };

  const toggleServicesDropdown = (visible) => {
    setServicesDropdownVisible(visible);
  };

  const handleNavigation = (target) => {
    navigate("/home");
    setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.scrollBy(0, -120);
      }
    }, 100);
  };

  const handleCartClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header className="header">
      <div className="content">
        <div className="header_logo">
          <img src={logo} width={148} height={100} alt="logo" />
        </div>

        <nav className="nav_links">
          <ul className="nav_list">
            <li>
              <a onClick={() => handleNavigation("banner_scroll")}>Home</a>
            </li>
            <li>
              <a onClick={() => handleNavigation("products_scroll")}>Product</a>
            </li>

            <li>
              <a onClick={() => handleNavigation("blog_scroll")}>Blog</a>
            </li>
            <li
              onMouseEnter={() => toggleServicesDropdown(true)}
              onMouseLeave={() => toggleServicesDropdown(false)}
            >
              <a className="services_link">Services</a>
              {servicesDropdownVisible && (
                <div className="nav_list ">
                  <div className="services_menu">
                    <Link to="/calcFood" onClick={handleScrollToTop}>
                      Calculate Food{" "}
                    </Link>
                    <Link to="/calcSalt" onClick={handleScrollToTop}>
                      Calculate Salt
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/introducing" onClick={handleScrollToTop}>
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="nav_icons_header">
            <div
              className="cart-icon-container"
              onMouseEnter={() => toggleCartDropdown(true)}
              onMouseLeave={() => toggleCartDropdown(false)}
            >
              <Link to="/cart" onClick={handleCartClick}>
                <TiShoppingCart className="icon_header" />
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </Link>

              {cartDropdownVisible && cartItems.length > 0 && (
                <div className="cart-preview-dropdown">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-preview-item">
                      <img src={item.image || koiFood} alt={item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-price">
                          {item.cost.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="cart-preview-footer">
                    <Link
                      to="/cart"
                      className="view-cart-button"
                      onClick={handleCartClick}
                    >
                      View My Shopping Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {role === "Member" ? (
              <div className="user_info">
                <span className="img_profile">
                  {user.image ? (
                    <img src={user.image} alt="User Profile" />
                  ) : (
                    <Avatar
                      style={{
                        width: "4rem",
                        height: "4rem",
                        marginRight: "15px",
                      }}
                      {...config}
                    />
                  )}
                </span>

                <div
                  className="profile_dropdown"
                  onMouseEnter={() => toggleDropdown(true)}
                  onMouseLeave={() => toggleDropdown(false)}
                >
                  <span className="user_name">
                    {role === "Member" && user.fullName
                      ? user.fullName
                      : "New Customer"}
                  </span>

                  {dropdownVisible && (
                    <div className="dropdown_menu">
                      <Link to="/profile" onClick={handleScrollToTop}>
                        Profile Information
                      </Link>
                      <Link
                        to="/aquariummanagement"
                        onClick={handleScrollToTop}
                      >
                        Aquarium Management
                      </Link>
                      <Link to="/water" onClick={handleScrollToTop}>
                        Water Management
                      </Link>
                      <Link to="/fishmanagement" onClick={handleScrollToTop}>
                        Koi Fish Management
                      </Link>
                      <Link to="/orderHistory" onClick={handleScrollToTop}>
                        Order History
                      </Link>
                      <Link to="/koiStatistic" onClick={handleScrollToTop}>
                        Koi Statistics
                      </Link>
                      <Link to="/pondStatistic" onClick={handleScrollToTop}>
                        Pond Statistics
                      </Link>
                    </div>
                  )}
                </div>

                <span className="logout_button" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            ) : role === "Admin" ? (
              <div className="admin-nav">
                <button className="back-to-admin" onClick={handleBackToAdmin}>
                  Back to Admin
                </button>
                <span className="logout_button" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            ) : role === "Staff" ? (
              <div className="admin-nav">
                <button className="back-to-admin" onClick={handleBackToAdmin}>
                  Back to Staff
                </button>
                <span className="logout_button" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            ) : role === "ShopOwner" ? (
              <div className="admin-nav">
                <button className="back-to-admin" onClick={handleBackToAdmin}>
                  Back to Shop Owner
                </button>
                <span className="logout_button" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            ) : (
              <a href="/login">
                <CgProfile className="icon_header" />
              </a>
            )}
          </div>
        </nav>
      </div>

      <ToastContainer />
    </header>
  );
}

export default Header;
