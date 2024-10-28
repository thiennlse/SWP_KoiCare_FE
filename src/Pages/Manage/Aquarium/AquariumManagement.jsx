import "./AquariumManagement.css";
import axiosInstance from "../../axiosInstance";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const memberId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axiosInstance
      .get("/api/Pool?page=1&pageSize=100", {
        params: { _timestamp: new Date().getTime() },
      })
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setAquaList(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools:", err);
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      axiosInstance
        .get("/api/Pool", {
          params: {
            page: 1,
            pageSize: 100,
            searchTerm: searchQuery,
          },
        })
        .then((res) => {
          const filterPool = res.data.filter(
            (pool) => pool.memberId === memberId
          );
          setAquaList(filterPool);
        })
        .catch((err) => {
          console.error("Error searching aquariums:", err);
          toast.error("Failed to search aquariums.");
        });
    } else {
      fetchPoolsForMember(memberId);
    }
  };

  const deletePool = (id) => {
    if (window.confirm("Are you sure you want to delete this aquarium?")) {
      axiosInstance
        .delete(`/api/Pool/Delete?id=${id}`)
        .then((response) => {
          if (response.status === 204) {
            const updatedAquaList = aquaList.filter((pool) => pool.id !== id);
            setAquaList(updatedAquaList);
            toast.success("Aquarium deleted successfully", { autoClose: 1500 });
          } else {
            toast.error(
              `Failed to delete aquarium. Status: ${response.status}`,
              { autoClose: 1500 }
            );
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
              <th>Name</th>
              <th>Size</th>
              <th>Depth (m)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aquaList.map((aquarium, index) => (
              <tr key={index}>
                <td>{aquarium.name}</td>
                <td>{aquarium.size}</td>
                <td>{aquarium.depth}</td>
                <td>{aquarium.description}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(aquarium.id)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deletePool(aquarium.id)}
                    >
                      Delete
                    </button>
                  </div>
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
