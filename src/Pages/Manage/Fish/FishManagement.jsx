import "./FishManagement.css";
import Header from "../../../Components/header/header";
import Footer from "../../../Components/footer/footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FishManagement = () => {
  const [fishList, setFishList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFishList, setFilteredFishList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFish();
  }, []);

  const fetchFish = () => {
    axios
      .get("https://koicare.azurewebsites.net/api/Fish")
      .then((res) => {
        setFishList(res.data);
        setFilteredFishList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching fish data:", err);
        alert("Failed to fetch fish data.");
      });
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
      <Header />
      <div className="fish-management-container">
        <div className="header-with-button">
          <h2 className="fish-list-title">Fish Management</h2>
          <button className="create-fish-button" onClick={handleCreate}>
            Create Fish
          </button>
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
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFishList.map((fish, index) => (
              <tr key={index}>
                <td>{fish.name}</td>
                <td>{fish.age}</td>
                <td>{fish.cost}</td>
                <td>
                  <button onClick={() => handleEdit(fish.id)}>Edit</button>
                  <button onClick={() => deleteFish(fish.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default FishManagement;
