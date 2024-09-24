import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./Pages/Login/Login";
import Header from "./Components/header/header";
import Body from "./Pages/HomePage/HomePage";
import Footer from "./Components/footer/footer";
 

function App() {
  return (
    <div>
      {/* <LoginForm /> */}
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
