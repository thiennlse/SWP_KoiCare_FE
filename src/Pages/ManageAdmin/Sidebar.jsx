import adminAvatar from "./../../Components/Assets/admin.png";
import {
  MdDashboard,
  MdPeople,
  MdShoppingCart,
  MdArticle,
} from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import DashBoard from "./Dashboard";

export default function SideBar({
  handleRoleChange,
  handleStatusChange,
  handleBackToHome,
  handleDateSearch,
  orderStatuses,
  rolesList,
  openDeleteBlogModal,
  openDeleteProductModal,
  openModal,
  accountName,
  filteredDateRange,
  setDateRange,
  revenueData,
  blogs,
  products,
  activeTab,
  setActiveTab,
  userRole,
  users,
  orders,
  userId,
  dateRange,
  revenueDataShopOwner,
}) {
  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <aside className="sidebar-admin">
        <div className="profile-admin">
          <img src={adminAvatar} alt="Admin" />
          <div className="admin-name">{accountName}</div>
        </div>
        <nav className="nav_admin">
          <ul>
            {userRole === "Admin" && (
              <li
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                <MdDashboard className="nav-icon-admin" />
                Dashboard
              </li>
            )}
            {userRole === "ShopOwner" && (
              <li
                className={activeTab === "dashboardShop" ? "active" : ""}
                onClick={() => setActiveTab("dashboardShop")}
              >
                <MdDashboard className="nav-icon-admin" />
                Dashboard
              </li>
            )}
            {userRole === "Admin" && (
              <li
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                <MdPeople className="nav-icon-admin" />
                User Management
              </li>
            )}
            {userRole === "ShopOwner" && (
              <li
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                <MdShoppingCart className="nav-icon-admin" />
                Product Management
              </li>
            )}
            {(userRole === "Admin" || userRole === "Staff") && (
              <li
                className={activeTab === "blogs" ? "active" : ""}
                onClick={() => setActiveTab("blogs")}
              >
                <MdArticle className="nav-icon-admin" />
                Blog Management
              </li>
            )}
            {userRole === "Admin" && (
              <li
                className={activeTab === "subscriptionOrders" ? "active" : ""}
                onClick={() => setActiveTab("subscriptionOrders")}
              >
                <FaClipboardList className="nav-icon-admin" />
                Order Subcription
              </li>
            )}
            {userRole === "ShopOwner" && (
              <li
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <FaClipboardList className="nav-icon-admin" />
                Order Management
              </li>
            )}
          </ul>
        </nav>
        <button className="back_button_admin" onClick={handleBackToHome}>
          Back to Home
        </button>
      </aside>
      <DashBoard
        activeTab={activeTab}
        users={users}
        products={products}
        blogs={blogs}
        orders={orders}
        revenueData={revenueData}
        handleRoleChange={handleRoleChange}
        rolesList={rolesList}
        userRole={userRole}
        openModal={openModal}
        userId={userId}
        openDeleteProductModal={openDeleteProductModal}
        openDeleteBlogModal={openDeleteBlogModal}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleDateSearch={handleDateSearch}
        filteredDateRange={filteredDateRange}
        orderStatuses={orderStatuses}
        handleStatusChange={handleStatusChange}
        revenueDataShopOwner={revenueDataShopOwner}
      />
    </div>
  );
}
