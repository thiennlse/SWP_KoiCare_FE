import Header from "./Components/header/header";
import Footer from "./Components/footer/footer";
import { Outlet } from "react-router-dom"; // Outlet sẽ render các trang con

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="main-content">
        <Outlet /> {/* Render các trang con ở đây */}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
