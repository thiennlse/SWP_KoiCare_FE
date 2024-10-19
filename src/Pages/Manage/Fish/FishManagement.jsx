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
  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 1;

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
      .get("https://koicareapi.azurewebsites.net/api/Fish?page=1&pageSize=100")
      .then((res) => {
        // Filter fish based on the pools
        const filteredFish = res.data.filter((fish) =>
          poolList.some((pool) => pool.id === fish.poolId)
        );
        console.log(res.data);
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
      .get("https://koicareapi.azurewebsites.net/api/Pool?page=1&pageSize=100")
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
        .delete(`https://koicareapi.azurewebsites.net/api/Fish/Delete?id=${id}`)
        .then((response) => {
          if (response.status === 204) {
            alert("Fish deleted successfully");
            const updatedFishList = fishList.filter((fish) => fish.id !== id);
            setFishList(updatedFishList);

            // Re-filter the fish list based on the current selected pool
            if (selectedPoolId === 0) {
              setFilteredFishList(updatedFishList); // If "All Pools" is selected, show all remaining fish
            } else {
              const filtered = updatedFishList.filter(
                (fish) => fish.poolId === selectedPoolId
              );
              setFilteredFishList(filtered); // Only show fish for the selected pool
            }
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

  // Function to calculate age from dob
  const calculateAge = (dob) => {
    if (!dob) return "N/A"; // Handle case where dob is not available
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    // Adjust age if the birthday hasn't occurred yet this year
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
