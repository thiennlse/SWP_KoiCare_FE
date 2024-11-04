import Header from "./Components/header/header";
import Footer from "./Components/footer/footer";
import ContactButtons from "./ContactButton/ContactButtons";
import { Outlet, useLocation } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  return (
    <div className="layout-container">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      {!isAdminPage && <ContactButtons />}
      <Footer />
    </div>
  );
};

export default MainLayout;
