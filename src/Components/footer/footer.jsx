import React from "react";
import "./footer.css";
import logo from "../Assets/logo.png";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer_content">
                <div className="footer_logo">
                    <img src={logo} alt="logo" />
                    <p>Subscribe to our newsletter to get updates about our grand offers.</p>
                    <div className="social_icons">
                        <a href="#"><FaFacebookF className="fab fa-facebook" /></a>
                        <a href="#"><FaTwitter className="fab fa-twitter" /></a>
                        <a href="#"><FaPinterest className="fab fa-pinterest" /></a>
                        <a href="#"><RiInstagramFill className="fab fa-instagram" /></a>
                        <a href="#"><FaYoutube className="fab fa-youtube" /></a>
                    </div>
                </div>
                
                <nav className="nav_links_lists">
                        <li><strong>Quick Links</strong></li>
                    <ul className="nav_lists">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Offer</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Contact us</a></li>
                    </ul>             
                </nav>
            </div>
            <hr/>
            <p className="copyright">© 2024 KoiCareSystem . All rights reserved.</p>
        </footer>
    );
}

export default Footer;
