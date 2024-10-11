import "./purchase.css";
import img1 from "../../Components/Assets/KoiFood.jpeg";

const Purchase = () => {
  return (
    <>
      <div className="page-container">
        <ProductInfo />
      </div>
    </>
  );
};

function ProductInfo() {
  const productData = {
    name: "Koi Fish Food",
    details: [
      "High Protein - This food is designed to promote growth and health in koi fish.",
      "500g Pack - Perfect for small to medium-sized ponds with a variety of koi.",
      "Contains essential vitamins and minerals to ensure optimal health and coloration of your fish.",
      "Recommended feeding rate is 2-3 times per day, depending on water temperature.",
    ],
    price: 2000,
  };

  return (
    <div className="product-wrapper">
      <img src={img1} alt="Koi Food" />
      <div className="product-details">
        <h2>{productData.name}</h2>
        <p>Details:</p>
        <ul>
          {productData.details.map((detail, index) => (
            <li key={index}>- {detail}</li>
          ))}
        </ul>
        <button>{productData.price}$ - Buy</button>
      </div>
    </div>
  );
}

export default Purchase;
