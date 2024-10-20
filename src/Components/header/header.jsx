import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./header.css";
import logo from "../Assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import Avatar, { genConfig } from "react-nice-avatar";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const config = genConfig({ sex: "man", hairStyle: "mohawk" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://koicareapi.azurewebsites.net/api/Member/${userId}`
        );
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

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

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("cart");

    setTimeout(() => {
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
            <div>
              <a href="/cart">
                <TiShoppingCart className="icon_header" />
              </a>
            </div>
            {user ? (
              <div className="user_info">
                <span className="img_profile">
                  {user.image ? (
                    <img src={user.image} alt="User Profile" />
                  ) : (
                    <Avatar
                      style={{ width: "4rem", height: "4rem" }}
                      {...config}
                    />
                  )}
                </span>
                <div
                  className="profile_dropdown"
                  onMouseEnter={() => toggleDropdown(true)}
                  onMouseLeave={() => toggleDropdown(false)}
                >
                  <span className="user_name" onClick={() => navigate("/")}>
                    {user.fullName ? user.fullName : " New Customer"}
                  </span>
                  {dropdownVisible && (
                    <div className="dropdown_menu">
                      <a href="/profile">My Account</a>
                      <a href="/aquariummanagement">Aquarium Management</a>
                      <a href="fishmanagement">Koi Fish Management</a>
                      <a href="/orderHistory">Order History</a>
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
