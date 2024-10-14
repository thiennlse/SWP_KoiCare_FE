import "./AquariumManagement.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [filteredAquaList, setFilteredAquaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the memberId of the logged-in user from local storage or session
  const memberId = JSON.parse(localStorage.getItem("user"))?.id || 0;

  const navigate = useNavigate();

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId); // Fetch pools for the logged-in user
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axios
      .get("https://koicare.azurewebsites.net/api/Pool", {
        params: { _timestamp: new Date().getTime() },
      })
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setAquaList(memberPools);
        setFilteredAquaList(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools:", err);
      });
  };

  const handleSearch = () => {
    const filtered = aquaList.filter((pool) =>
      pool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAquaList(filtered);
  };

  const deletePool = (id) => {
    if (window.confirm("Are you sure you want to delete this aquarium?")) {
      axios
        .delete(`https://koicare.azurewebsites.net/api/Pool/Delete?id=${id}`)
        .then((response) => {
          if (response.status === 204) {
            const updatedAquaList = aquaList.filter((pool) => pool.id !== id);
            setAquaList(updatedAquaList);
            setFilteredAquaList(updatedAquaList);
            alert("Aquarium deleted successfully");
          } else {
            alert(`Failed to delete aquarium. Status: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting aquarium:",
            error.response ? error.response.data : error
          );
          alert("Failed to delete aquarium. Please try again.");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/updateaquarium/${id}`);
  };

  return (
    <div>
      <div className="aquarium_list_container">
        <div className="header-with-button">
          <h2 className="aquarium_list_title">Aquarium Management</h2>
          <button
            className="create-aquarium-button"
            onClick={() => navigate("/createaquarium")}
          >
            Create Aquarium
          </button>
        </div>

        <div className="search_aqua_form">
          <input
            type="text"
            placeholder="Search by Aquarium Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            🔍
          </button>
        </div>

        <table className="aquarium_table">
          <thead>
            <tr>
              <th>Aquarium Name</th>
              <th>Size</th>
              <th>Depth</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAquaList.map((aquarium, index) => (
              <tr key={index}>
                <td>{aquarium.name}</td>
                <td>{aquarium.size}</td>
                <td>{aquarium.depth}</td>
                <td>{aquarium.description}</td>
                <td>
                  <button onClick={() => handleEdit(aquarium.id)}>Edit</button>
                  <button onClick={() => deletePool(aquarium.id)}>
                    Delete
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

export default AquariumManagement;
