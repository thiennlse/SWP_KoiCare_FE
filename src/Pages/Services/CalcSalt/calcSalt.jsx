import "./calcSalt.css";
import axiosInstance from "../../axiosInstance";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const memberId = JSON.parse(localStorage.getItem("userId"));

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
            pageSize: 10,
            searchTerm: searchQuery,
          },
        })
        .then((res) => {
          setAquaList(res.data);
        })
        .catch((err) => {
          console.error("Error searching aquariums:", err);
          toast.error("Failed to search aquariums.");
        });
    } else {
      fetchPoolsForMember(memberId);
    }
  };

  const handleCalcSalt = (aqua) => {
    axiosInstance
      .get(`/api/Pool/CalculateSaltInPool/${aqua.id}`)
      .then((res) => {
        toast.warn(`${aqua.name} need to ${res.data}`, { autoClose: 2000 });
      });
  };

  return (
    <div>
      {memberId ? (
        <div className="aquarium_list_container">
          <div className="header-with-button">
            <h2 className="aquarium_list_title">Calculate Salt</h2>
          </div>
          <table className="aquarium_table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size (cm)</th>
                <th>Depth (cm)</th>
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
                      <button onClick={() => handleCalcSalt(aquarium)}>
                        Calc
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="centered-container">
          <p>Login to Calculate Salt</p>
          <a href="/login">
            <button className="btn btn-warning">Login</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default AquariumManagement;
