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
                        <li>Home</li>
                        <li>About us</li>
                        <li>Offer</li>
                        <li>
                            Services
                            <ul className="sub_services_list">  
                                <li><a href="#">Calculate Food</a></li>
                                <li><a href="#">Calculate Water</a></li>
                                <li><a href="#">Calculate Salt</a></li>
                            </ul>
                        </li>
                        <li>Contact us</li>
                    </ul>             
                </nav>
            </div>
            <hr/>
            <p className="copyright">© 2024 KoiCareSystem . All rights reserved.</p>
        </footer>
    );
}

export default Footer;
