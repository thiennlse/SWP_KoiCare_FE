import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import logo from "../Assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleNavigation = (target) => {
    navigate("/home");
    setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogout = () => {
    toast.success("Logout successful!", { autoClose: 1500 });
    setTimeout(() => {
      localStorage.removeItem("user");
      navigate("/login");
    }, 1500);
  };

  const toggleDropdown = (visible) => {
    setDropdownVisible(visible);
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
              <a onClick={() => handleNavigation("contact_scroll")}>
                Contact Us
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation("blog_scroll")}>Blog</a>
            </li>
          </ul>

          <div className="nav_icons_header">
            <a href="/cart">
              <TiShoppingCart className="icon_header" />
            </a>

            {user ? (
              <div className="user_info">
                <span className="img_profile">
                  <img src={user.image}></img>
                </span>
                <div
                  className="profile_dropdown"
                  onMouseEnter={() => toggleDropdown(true)}
                  onMouseLeave={() => toggleDropdown(false)}
                >
                  <span className="user_name" onClick={() => navigate("/")}>
                    {user.fullName}
                  </span>
                  {dropdownVisible && (
                    <div className="dropdown_menu">
                      <a href="/profile">My Account</a>
                      <a href="/aquariummanagement">Aquarium Management</a>
                      <a href="fishmanagement">Koi Fish Management</a>
                      <a href="/orders">Purchase Order</a>
                    </div>
                  )}
                </div>

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
