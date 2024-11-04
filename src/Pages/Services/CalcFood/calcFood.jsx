import "./calcFood.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CalcFood = () => {
  const [poolList, setPoolList] = useState([]);
  const [filteredFishList, setFilteredFishList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [calculationResultHTML, setCalculationResultHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const memberId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
      fetchFoodList();
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  useEffect(() => {
    if (poolList.length > 0) {
      fetchFish();
    }
  }, [poolList]);

  const fetchFoodList = () => {
    axiosInstance
      .get("/api/Food?page=1&pageSize=100")
      .then((res) => {
        setFoodList(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch food data.", { autoClose: 1500 });
      });
  };

  const getFoodName = (foodId) => {
    const food = foodList.find((f) => f.id === foodId);
    return food ? food.name : "Unknown";
  };

  const getFoodWeight = (foodId) => {
    const food = foodList.find((f) => f.id === foodId);
    return food ? food.weight : "Unknown";
  };

  const fetchFish = () => {
    axiosInstance
      .get("/api/Fish?page=1&pageSize=100")
      .then((res) => {
        const filteredFish = res.data.filter((fish) =>
          poolList.some((pool) => pool.id === fish.poolId)
        );
        setFilteredFishList(filteredFish);
      })
      .catch((err) => {
        toast.error("Failed to fetch fish data.", { autoClose: 1500 });
      });
  };

  const fetchPoolsForMember = (memberId) => {
    axiosInstance
      .get("/api/Pool?page=1&pageSize=100")
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setPoolList(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools data:", err);
        toast.error("Failed to fetch pools data.", { autoClose: 1500 });
      });
  };

  function handleCalcFood(fishId) {
    setLoading(true);
    axiosInstance
      .post(`/api/SupportAI/supportcalculatefood/${fishId}`)
      .then((res) => {
        const cleanHtml = res.data
          .replace(/^```html\s*/, "")
          .replace(/```$/, "");
        setCalculationResultHTML(cleanHtml);
        toast.success("Calculation completed!", { autoClose: 2000 });
      })
      .catch((err) => {
        toast.error("Failed to calculate food.", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleShowFish(fish) {
    setSelectedFish(fish);
    setIsShow(true);
    setCalculationResultHTML("");
  }

  return (
    <div className="background-color-page">
      {memberId ? (
        <div className="food-container">
          <div className="header-with-button">
            <h2 className="food-title">Calculate Food</h2>
          </div>
          <div className="dropdown-fish">
            <button className="dropdown-fish-button">
              {isShow ? selectedFish.name : "List Of Fish"}
              <span className="fish-eye"></span>
            </button>
            <div className="dropdown-content-fish">
              {filteredFishList.length > 0 ? (
                filteredFishList.map((fish, index) => (
                  <div
                    key={index}
                    className="dropdown-fish-name"
                    onClick={() => handleShowFish(fish)}
                  >
                    {fish.name}
                  </div>
                ))
              ) : (
                <div>No fish available</div>
              )}
            </div>
          </div>
          {selectedFish ? (
            <div className="fish-details">
              <h3>Fish Details</h3>
              {selectedFish.image ? (
                <img src={selectedFish.image} alt={selectedFish.name} />
              ) : (
                <p>No Image Available</p>
              )}
              <p>
                <strong>Name:</strong> {selectedFish.name}
              </p>
              <p>
                <strong>Food:</strong> {getFoodName(selectedFish.foodId)}
              </p>
              <p>
                <strong>Food Weight: </strong>
                {getFoodWeight(selectedFish.foodId)}kg
              </p>
              <button
                className="calc-food"
                onClick={() => handleCalcFood(selectedFish.id)}
              >
                Calculate
              </button>
              {loading && <div className="loader"></div>}
            </div>
          ) : (
            ""
          )}
          {calculationResultHTML && (
            <div
              className="calculation-result"
              dangerouslySetInnerHTML={{ __html: calculationResultHTML }}
            />
          )}
        </div>
      ) : (
        <div className="centered-container">
          <p>Login to Calculate Food</p>
          <a href="/login">
            <button className="btn btn-warning">Login</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default CalcFood;
