import React from "react";
import "./header.css";
import logo from "../Assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";

function Header() {
  return (
    <header className="header">
      <div className="content">
        <div className="header_logo">
          <img src={logo} width={148} height={100} alt="logo" />
        </div>

        <nav className="nav_links">
          <ul className="nav-list">
            {" "}
            {/* Changed className from nav-links to nav-list */}
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/product">Product</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>

          <div className="nav-icons_header">
            <a href="#">
              <TiShoppingCart className="icon_header" />
            </a>
            <a href="/login">
              <CgProfile className="icon_header" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
