import "./FishManagement.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FishManagement = () => {
  const [fishList, setFishList] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 1;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
      fetchFood();
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  useEffect(() => {
    if (poolList.length > 0) {
      fetchFish();
    }
  }, [poolList]);

  const fetchFood = () => {
    axiosInstance
      .get("/api/Food?page=1&pageSize=100")
      .then((res) => {
        setFoodList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching food data:", err);
        toast.error("Failed to fetch food data.", { autoClose: 1500 });
      });
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
        console.error("Error fetching fish data:", err);
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

  const deleteFish = (id) => {
    if (window.confirm("Are you sure you want to delete this fish?")) {
      axiosInstance
        .delete(`/api/Fish/Delete?id=${id}`)
        .then((response) => {
          if (response.status === 204) {
            toast.success("Fish deleted successfully", { autoClose: 1500 });
            const updatedFishList = fishList.filter((fish) => fish.id !== id);
            setFishList(updatedFishList);

            if (selectedPoolId === 0) {
              setFilteredFishList(updatedFishList);
            } else {
              const filtered = updatedFishList.filter(
                (fish) => fish.poolId === selectedPoolId
              );
              setFilteredFishList(filtered);
            }
          } else {
            toast.error(`Failed to delete fish. Status: ${response.status}`, {
              autoClose: 1500,
            });
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting fish:",
            error.response ? error.response.data : error
          );
          toast.error("Failed to delete fish. Please try again.", {
            autoClose: 1500,
          });
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/updatefish/${id}`);
  };

  const handleCreate = () => {
    navigate("/createfish");
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

  return (
    <div>
      <div className="fish-management-container">
        <div className="header-with-button">
          <h2 className="fish-list-title">Fish Management</h2>
          <button className="create-fish-button" onClick={handleCreate}>
            Create Fish
          </button>
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
              <th>Size (cm)</th>
              <th>Weight (kg)</th>
              <th>Food Name</th>
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
                <td>
                  {foodList.find((food) => food.id === fish.foodId)?.name}{" "}
                </td>
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
                  <button onClick={() => handleEdit(fish.id)}>Edit</button>
                  <button onClick={() => deleteFish(fish.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishManagement;
