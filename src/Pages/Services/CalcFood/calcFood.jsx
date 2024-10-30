import "./calcFood.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const CalcFood = () => {
  const [fishList, setFishList] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId;
  console.log(memberId);

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
        setFishList(filteredFish);
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

  const handlePoolChange = (e) => {
    const poolId = Number(e.target.value);
    setSelectedPoolId(poolId);

    if (poolId === 0) {
      setFilteredFishList(fishList);
    } else {
      const filtered = fishList.filter((fish) => fish.poolId === poolId);
      setFilteredFishList(filtered);
    }
  };

  const handleSearch = () => {
    const filtered = fishList.filter((fish) =>
      fish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFishList(filtered);
  };

  function handleCalcFood(foodId, fishName, fishId) {
    axiosInstance.get(`/api/Food/${foodId}`).then((res) => {
      const fishWeight = res.data.weight;
      console.log(fishWeight);
    });

    axiosInstance.get(`/api/Fish/calculateFoodFish/${fishId}`).then((res) => {
      toast.warn(res.data, { autoClose: 2000 });
    });
  }

  return (
    <div>
      {memberId ? (
        <div className="fish-management-container">
          <div className="header-with-button">
            <h2 className="fish-list-title">Calculate Food</h2>
          </div>

          <div className="pool-selection">
            <label>Select Pool:</label>
            <select onChange={handlePoolChange} value={selectedPoolId}>
              <option value="0">All Pools</option>
              {poolList.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-fish-form">
            <input
              type="text"
              placeholder="Search by Fish Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              🔍
            </button>
          </div>

          <table className="calc-food-table">
            <thead>
              <tr>
                <th>Fish Name</th>
                <th>Food Name</th>
                <th>Food Weight (kg)</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFishList.map((fish, index) => (
                <tr key={index}>
                  <td>{fish.name}</td>
                  <td>{getFoodName(fish.foodId)}</td>
                  <td>{getFoodWeight(fish.foodId)} kg</td>
                  <td>
                    {fish.image ? (
                      <img
                        src={fish.image}
                        alt={fish.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="calc-food-button"
                      onClick={() =>
                        handleCalcFood(fish.foodId, fish.name, fish.id)
                      }
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
