import "./HomePage.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const data = [
  {
    img: "", // Đường dẫn hình ảnh sẽ được điền ở đây
    name: "Sản phẩm A",
  },
  {
    img: "",
    name: "Sản phẩm B",
  },
  {
    img: "",
    name: "Sản phẩm C",
  },
  {
    img: "",
    name: "Sản phẩm D",
  },
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <div>
        <p className="product_title">Best Selling Products</p>
        <Home />
      </div>
      <Footer />
    </div>
  );
};

function Home() {
  return (
    <>
      <Products />
    </>
  );
}
function Products() {
  return (
    <>
      <ul className="products">
        {data.map((product) => (
          <Product productObj={product} />
        ))}
      </ul>
    </>
  );
}
function Product({ productObj }) {
  return (
    <>
      <li>
        <img src={productObj.img} alt="product"></img>
        <p>{productObj.name}</p>
        <div>
          <button>Add To Cart</button>
          <button>❤️</button>
        </div>
      </li>
    </>
  );
}

export default HomePage;
