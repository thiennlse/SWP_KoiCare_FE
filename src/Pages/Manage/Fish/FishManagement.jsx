import "./FishManagement.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FishManagement = () => {
  const [fishList, setFishList] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);
  const navigate = useNavigate();

  // Fetch memberId from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const memberId = user ? user.id : 0;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId); // Fetch pools for the logged-in user
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  useEffect(() => {
    // Fetch fish data once pools have been fetched
    if (poolList.length > 0) {
      fetchFish();
    }
  }, [poolList]);

  const fetchFish = () => {
    axios
      .get("https://koicare.azurewebsites.net/api/Fish")
      .then((res) => {
        // Filter fish based on the pools
        const filteredFish = res.data.filter((fish) =>
          poolList.some((pool) => pool.id === fish.poolId)
        );
        setFishList(filteredFish);
        setFilteredFishList(filteredFish);
      })
      .catch((err) => {
        console.error("Error fetching fish data:", err);
        alert("Failed to fetch fish data.");
      });
  };

  const fetchPoolsForMember = (memberId) => {
    axios
      .get("https://koicare.azurewebsites.net/api/Pool")
      .then((res) => {
        // Filter pools based on the memberId
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setPoolList(memberPools); // Store pools in state
      })
      .catch((err) => {
        console.error("Error fetching pools data:", err);
        alert("Failed to fetch pools data.");
      });
  };

  const handlePoolChange = (e) => {
    const poolId = Number(e.target.value);
    setSelectedPoolId(poolId); // Update selected poolId

    if (poolId === 0) {
      // If "All Pools" is selected, set filteredFishList to the full fishList
      setFilteredFishList(fishList);
    } else {
      // Filter fish based on selected poolId
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
      axios
        .delete(`https://koicare.azurewebsites.net/api/Fish/Delete?id=${id}`)
        .then((response) => {
          if (response.status === 204) {
            alert("Fish deleted successfully");
            const updatedFishList = fishList.filter((fish) => fish.id !== id);
            setFishList(updatedFishList);
            setFilteredFishList(updatedFishList);
          } else {
            alert(`Failed to delete fish. Status: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting fish:",
            error.response ? error.response.data : error
          );
          alert("Failed to delete fish. Please try again.");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/updatefish/${id}`);
  };

  const handleCreate = () => {
    navigate("/createfish");
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
            <option value="0">All Aquarium</option>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFishList.map((fish, index) => (
              <tr key={index}>
                <td>{fish.name}</td>
                <td>{fish.age}</td>
                <td>{fish.size}</td>
                <td>{fish.weight}</td>
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
