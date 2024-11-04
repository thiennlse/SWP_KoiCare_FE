import React from "react";
import { SiZalo } from "react-icons/si";
import { FaFacebookMessenger } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import "./ContactButtons.css";

const ContactButtons = () => {
  return (
    <div className="contact-buttons">
      <a
        href="https://zalo.me/0778138889"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-button zalo-button"
      >
        <SiZalo size={30} />
      </a>
      <a
        href="https://www.facebook.com/messages/t/479832175208645"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-button messenger-button"
      >
        <FaFacebookMessenger size={30} />
      </a>
      <a href="tel:0965015422" className="contact-button support-button">
        <BiSupport size={30} />
      </a>
    </div>
  );
};

export default ContactButtons;
