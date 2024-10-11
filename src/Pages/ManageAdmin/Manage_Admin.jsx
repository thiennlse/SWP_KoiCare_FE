import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { FaChevronDown, FaRegCircle, FaCircle } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import "./Manage_Admin.css";

const ManageAdmin = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState("");

  const toggleDashboardMenu = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  const handleSubmenuClick = (submenu) => {
    setActiveSubmenu(submenu);
  };

  return (
    <div className="admin_dashboard">
      <aside className="sidebar">
        <div className="profile">
          <img src="/path/to/profile_pic.png" alt="Admin" />
          <h2>Alexander Lacazette</h2>
        </div>

        <div className="sidebar_search">
          <input
            type="text"
            placeholder="Search..."
            className="sidebar_search_input"
          />
          <button className="sidebar_search_button">
            <IoSearch />
          </button>
        </div>

        <nav>
          <ul>
            <a
              href="#"
              onClick={toggleDashboardMenu}
              className="dashboard_link"
            >
              <AiOutlineDashboard className="icon_left" /> Dashboard
              <FaChevronDown className="icon_right" />
            </a>
            {isDashboardOpen && (
              <ul className="submenu">
                <li>
                  <a
                    href="#"
                    className={activeSubmenu === "total" ? "active" : ""}
                    onClick={() => handleSubmenuClick("total")}
                  >
                    {activeSubmenu === "total" ? <FaCircle /> : <FaRegCircle />}
                    Total
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={activeSubmenu === "users" ? "active" : ""}
                    onClick={() => handleSubmenuClick("users")}
                  >
                    {activeSubmenu === "users" ? <FaCircle /> : <FaRegCircle />}
                    Users Management
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={activeSubmenu === "blogs" ? "active" : ""}
                    onClick={() => handleSubmenuClick("blogs")}
                  >
                    {activeSubmenu === "blogs" ? <FaCircle /> : <FaRegCircle />}
                    Blogs Management
                  </a>
                </li>
              </ul>
            )}
          </ul>
        </nav>
      </aside>

      <div className="main_content_admin">
        <header className="toolbar">
          <nav className="toolbar_admin">
            <a href="#" className="nav_link_admin home_admin">
              Home
            </a>
            <a href="#" className="nav_link_admin">
              Contact
            </a>
            <a href="#" className="logout">
              <HiOutlineLogout />
            </a>
          </nav>
        </header>

        <main className="dashboard_content">
          <div className="dashboard_stats">
            <div className="stat_card blue">
              <h3>18</h3>
              <p>Visitors</p>
              <a href="#">
                More info <i className="fas fa_info_circle"></i>
              </a>
            </div>
            <div className="stat_card green">
              <h3>0</h3>
              <p>Requirements</p>
              <a href="#">
                More info <i className="fas fa_info_circle"></i>
              </a>
            </div>
            <div className="stat_card yellow">
              <h3>4</h3>
              <p>User Registrations</p>
              <a href="#">
                More info <i className="fas fa_info_circle"></i>
              </a>
            </div>
            <div className="stat_card red">
              <h3>0</h3>
              <p>Reports</p>
              <a href="#">
                More info <i className="fas fa_info_circle"></i>
              </a>
            </div>
          </div>

          <div className="dashboard_finances">
            <div className="finance_card">
              <h4>Platform fees</h4>
              <p>$18,230.00</p>
              <a href="#">View Report</a>
            </div>
            <div className="finance_card">
              <h4>Turnover</h4>
              <p>820</p>
              <a href="#">View Report</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAdmin;
