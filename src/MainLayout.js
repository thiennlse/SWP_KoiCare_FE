import Header from "./Components/header/header";
import Footer from "./Components/footer/footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
