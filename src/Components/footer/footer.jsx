import React from "react";
import "./footer.css";
import logo from "../Assets/logo.png";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="footer_logo">
          <img src={logo} alt="logo" />
          <p>
            Subscribe to our newsletter to get updates about our grand offers.
          </p>
          <div className="social_icons">
            <a
              href="https://www.facebook.com/groups/571573155376084"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="fab fa-facebook" />
            </a>
            <a href="#">
              <FaTwitter className="fab fa-twitter" />
            </a>
            <a href="#">
              <FaPinterest className="fab fa-pinterest" />
            </a>
            <a href="#">
              <RiInstagramFill className="fab fa-instagram" />
            </a>
            <a href="#">
              <FaYoutube className="fab fa-youtube" />
            </a>
          </div>
        </div>

        <nav className="nav_links_lists">
          <li>
            <strong>Quick Links</strong>
          </li>
          <ul className="nav_lists">
            <li>
              About us
              <ul className="sub_services_list">
                <li>
                  <a href="introducing">Introducing KoiCareSystem</a>
                </li>
              </ul>
            </li>
            <li>
              Services
              <ul className="sub_services_list">
                <li>
                  <a href="calcFood">Calculate Food</a>
                </li>
                <li>
                  <a href="calcSalt">Calculate Salt</a>
                </li>
              </ul>
            </li>
            <li>
              Contact us
              <ul className="sub_services_list" id="contact_scroll">
                <li className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div className="address-container">
                    189/17, Dang Van Bi Street, Truong Tho Ward,
                    <p>Thu Duc District, Ho Chi Minh City.</p>
                  </div>
                </li>
                <li className="contact-item">
                  <FaPhone className="contact-icon" />
                  <a href="callto:0965015422">(+84) 965015422</a>
                </li>
                <li className="contact-item">
                  <MdEmail className="contact-icon" />
                  <a href="mailto:thiennlse172858@fpt.edu.vn">
                    thiennlse172858@fpt.edu.vn
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
      <p className="copyright">© 2024 KoiCareSystem . All rights reserved.</p>
    </footer>
  );
}

export default Footer;
