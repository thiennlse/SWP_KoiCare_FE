import "./FishManagement.css";
import Header from "../../../Components/header/header";
import Footer from "../../../Components/footer/footer";
import koi1 from "../../../Components/Assets/koi1.png"
import koi2 from "../../../Components/Assets/koi2.png"

const FishManagement = () => {
  const fishList = [
    {
        name: "Koi Fish 1",
        age: "2 years",
        cost: "$200",
        image: koi1
    },
    {
        name: "Koi Fish 2",
        age: "3 years",
        cost: "$300",
        image: koi2
    }
  ];

  return (
    <div>
      <Header />
      <div className="fish-management-container">
        <h1 className="management-title">Fish Management</h1>
        <FishList fishList={fishList} />
      </div>
      <Footer />
    </div>
  );
};

const FishList = ({ fishList }) => {
    return (
      <div className="fish-list">
        {fishList.map((fish, index) => (
          <div key={index} className="fish-card">
            <img src={fish.image} alt={fish.name} /> 
            <div className="fish-info">
              <h3 className="fish-name">{fish.name}</h3>
              <p><strong>Age:</strong> {fish.age}</p>
              <p><strong>Cost:</strong> {fish.cost}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  

export default FishManagement;
