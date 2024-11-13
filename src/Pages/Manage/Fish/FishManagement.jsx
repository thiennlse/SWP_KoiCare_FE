import "./FishManagement.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";

const FishManagement = () => {
  const [fishList, setFishList] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId || 1;

  useEffect(() => {
    if (memberId !== 0) {
      fetchInitialData();
    } else {
      console.error("No memberId found. Please log in.");
      toast.error("Please log in to access Fish Management");
      navigate("/login");
    }
  }, [memberId]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPoolsForMember(memberId), fetchFood()]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load initial data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (poolList.length > 0) {
      fetchFish();
    }
  }, [poolList]);

  const fetchFood = async () => {
    try {
      const res = await axiosInstance.get("/api/Food?page=1&pageSize=100");
      setFoodList(res.data);
    } catch (err) {
      console.error("Error fetching food data:", err);
      toast.error("Failed to fetch food data");
    }
  };

  const fetchFish = async () => {
    try {
      const res = await axiosInstance.get("/api/Fish?page=1&pageSize=100");
      const filteredFish = res.data.filter((fish) =>
        poolList.some((pool) => pool.id === fish.poolId)
      );
      setFishList(filteredFish);
      setFilteredFishList(filteredFish);
    } catch (err) {
      console.error("Error fetching fish data:", err);
      toast.error("Failed to fetch fish data");
    }
  };

  const fetchPoolsForMember = async (memberId) => {
    try {
      const res = await axiosInstance.get("/api/Pool?page=1&pageSize=100");
      const memberPools = res.data.filter((pool) => pool.memberId === memberId);
      setPoolList(memberPools);
    } catch (err) {
      console.error("Error fetching pools data:", err);
      toast.error("Failed to fetch pools data");
    }
  };

  const handlePoolChange = (e) => {
    const poolId = Number(e.target.value);
    setSelectedPoolId(poolId);
    filterFishList(poolId, searchQuery);
  };

  const handleSearch = () => {
    filterFishList(selectedPoolId, searchQuery);
  };

  const filterFishList = (poolId, query) => {
    let filtered = [...fishList];

    if (poolId !== 0) {
      filtered = filtered.filter((fish) => fish.poolId === poolId);
    }

    if (query.trim()) {
      filtered = filtered.filter((fish) =>
        fish.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredFishList(filtered);
  };

  const deleteFish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fish?")) return;

    try {
      const response = await axiosInstance.delete(`/api/Fish/Delete?id=${id}`);
      if (response.status === 204) {
        toast.success("Fish deleted successfully");
        const updatedFishList = fishList.filter((fish) => fish.id !== id);
        setFishList(updatedFishList);
        const updatedFilteredList = filteredFishList.filter(
          (fish) => fish.id !== id
        );
        setFilteredFishList(updatedFilteredList);
      }
    } catch (error) {
      console.error("Error deleting fish:", error);
      toast.error("Failed to delete fish. Please try again.");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="fish-management-container">
      <div className="fish-management-header">
        <h2>Fish Management</h2>
        <button
          className="fish-create-button"
          onClick={() => navigate("/createfish")}
        >
          <FaPlus /> Create Fish
        </button>
      </div>

      <div className="filters-section">
        <div className="pool-filter">
          <select
            onChange={handlePoolChange}
            value={selectedPoolId}
            className="pool-select"
          >
            <option value="0">All Pools</option>
            {poolList.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.name}
              </option>
            ))}
          </select>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by fish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="fish-search-button">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="table-responsive">
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
            {filteredFishList.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No fish found
                </td>
              </tr>
            ) : (
              filteredFishList.map((fish) => (
                <tr key={fish.id}>
                  <td>{fish.name}</td>
                  <td>{calculateAge(fish.dob)} years</td>
                  <td>{fish.size}</td>
                  <td>{fish.weight}</td>
                  <td>
                    {foodList.find((food) => food.id === fish.foodId)?.name ||
                      "N/A"}
                  </td>
                  <td>{fish.origin}</td>
                  <td>
                    {fish.image ? (
                      <img
                        src={fish.image}
                        alt={fish.name}
                        className="fish-image"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>
                    <div className="fish-action-buttons">
                      <button
                        className="fish-edit-button"
                        onClick={() => navigate(`/updatefish/${fish.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="fish-delete-button"
                        onClick={() => deleteFish(fish.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishManagement;
