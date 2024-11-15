import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import "./AquariumManagement.css";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
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
        toast.error("Failed to fetch aquariums");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
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
          toast.error("Failed to search aquariums");
        })
        .finally(() => {
          setLoading(false);
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
            toast.success("Aquarium deleted successfully");
          } else {
            toast.error(
              `Failed to delete aquarium. Status: ${response.status}`
            );
          }
        })
        .catch((error) => {
          console.error("Error deleting aquarium:", error);
          toast.error("Failed to delete aquarium. Please try again.");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/updateaquarium/${id}`);
  };

  return (
    <div className="aquarium-management-container">
      <div className="aquarium-management-header">
        <h2>Aquarium Management</h2>
        <button
          className="aquarium-create-button"
          onClick={() => navigate("/createaquarium")}
        >
          Create Aquarium
        </button>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by aquarium name or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      <div className="table-responsive">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : aquaList.length > 0 ? (
          <table className="aquarium-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Size (cm)</th>
                <th>Depth (cm)</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aquaList.map((aquarium) => (
                <tr key={aquarium.id}>
                  <td>
                    {aquarium.image ? (
                      <img
                        src={aquarium.image}
                        alt={aquarium.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>{aquarium.name}</td>
                  <td>{aquarium.size} cm</td>
                  <td>{aquarium.depth} cm</td>
                  <td>{aquarium.description}</td>
                  <td>
                    <div className="aquarium-action-buttons">
                      <button
                        className="aquarium-edit-button"
                        onClick={() => handleEdit(aquarium.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="aquarium-delete-button"
                        onClick={() => deletePool(aquarium.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No aquariums found</div>
        )}
      </div>
    </div>
  );
};

export default AquariumManagement;
