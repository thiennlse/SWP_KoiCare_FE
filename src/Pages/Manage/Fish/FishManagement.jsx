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
      toast.error("Please log in to access Fish Management", {
        autoClose: 1500,
      });
      navigate("/login");
    }
  }, [memberId]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPoolsForMember(memberId), fetchFood()]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load initial data", { autoClose: 1500 });
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
      toast.error("Failed to fetch food data", { autoClose: 1500 });
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
      toast.error("Failed to fetch fish data", { autoClose: 1500 });
    }
  };

  const fetchPoolsForMember = async (memberId) => {
    try {
      const res = await axiosInstance.get("/api/Pool?page=1&pageSize=100");
      const memberPools = res.data.filter((pool) => pool.memberId === memberId);
      setPoolList(memberPools);
    } catch (err) {
      console.error("Error fetching pools data:", err);
      toast.error("Failed to fetch pools data", { autoClose: 1500 });
    }
  };

  const handleDelete = async (fishId) => {
    if (window.confirm("Are you sure you want to delete this fish?")) {
      try {
        await axiosInstance.delete(`/api/Fish/Delete?id=${fishId}`);
        setFishList(fishList.filter((fish) => fish.id !== fishId));
        setFilteredFishList(
          filteredFishList.filter((fish) => fish.id !== fishId)
        );
        toast.success("Fish deleted successfully!", { autoClose: 1500 });
      } catch (error) {
        console.error("Error deleting fish:", error);
        toast.error("Failed to delete fish.", { autoClose: 1500 });
      }
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
      <h2 className="fish-management-header">Koi Fish Management</h2>
      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="fish-search-button" onClick={handleSearch}>
          <FaSearch />
        </button>
        <select
          onChange={handlePoolChange}
          value={selectedPoolId}
          className="pool-select"
        >
          <option value="0">All Ponds</option>
          {poolList.map((pool) => (
            <option key={pool.id} value={pool.id}>
              {pool.name}
            </option>
          ))}
        </select>
        <button
          className="fish-create-button"
          onClick={() => navigate("/createfish")}
        >
          Create Fish
        </button>
      </div>

      <div className="fish-cards-container">
        {filteredFishList.length === 0 ? (
          <div className="no-data">No fish found</div>
        ) : (
          filteredFishList.map((fish) => (
            <div className="fish-card" key={fish.id}>
              <div className="fish-info-one">
                <h3>{fish.name}</h3>
                <img src={fish.image} alt={fish.name} className="fish-image" />
              </div>
              <div className="fish-info-two">
                <p>
                  Birthday:{" "}
                  {new Date(fish.dob).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>Gender: {fish.gender}</p>
                <p>
                  Pond: {poolList.find((pool) => pool.id === fish.poolId)?.name}
                </p>
                <p>Origin: {fish.origin}</p>
                <div className="fish-action-buttons">
                  <button
                    className="fish-details-button"
                    onClick={() => navigate(`/fishdetail/${fish.id}`)}
                  >
                    See More Details
                  </button>
                  <button
                    className="fish-delete-button"
                    onClick={() => handleDelete(fish.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FishManagement;
