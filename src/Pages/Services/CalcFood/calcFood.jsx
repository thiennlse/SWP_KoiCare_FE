import "./calcFood.css";
import axiosInstance from "../../axiosInstance";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const CalcFood = () => {
  const [fishList, setFishList] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 1;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  useEffect(() => {
    if (poolList.length > 0) {
      fetchFish();
    }
  }, [poolList]);

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

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  function handleCalcFood(foodId, fishName, fishId) {
    toast.success(`Food of ${fishName}`, { autoClose: 1500 });
    axiosInstance.get(`/api/Food/${foodId}`).then((res) => {
      console.log(res.data);
      const fishWeight = res.data.weight;
      console.log(fishWeight);
    });

    axiosInstance.get(`/api/Fish/calculateFoodFish/${fishId}`).then((res) => {
      console.log(res.data);
    });
  }

  return (
    <div>
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

        <table className="fish-table">
          <thead>
            <tr>
              <th>Fish Name</th>
              <th>Age</th>
              <th>Size</th>
              <th>Weight</th>
              <th>Food</th>
              <th>Origin</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFishList.map((fish, index) => (
              <tr key={index}>
                <td>{fish.name}</td>
                <td>{calculateAge(fish.dob)}</td>
                <td>{fish.size}</td>
                <td>{fish.weight}</td>
                <td>{fish.foodId}</td>
                <td>{fish.origin}</td>
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
                    onClick={() =>
                      handleCalcFood(fish.foodId, fish.name, fish.id)
                    }
                  >
                    Calc
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalcFood;
