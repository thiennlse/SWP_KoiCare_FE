import "./AquariumManagement.css";
import Header from "../../../Components/header/header";
import Footer from "../../../Components/footer/footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAquaList, setFilteredAquaList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = () => {
    axios.get("https://koicare.azurewebsites.net/api/Pool")
      .then((res) => {
        setAquaList(res.data);
        setFilteredAquaList(res.data);
      });
  };

  const handleSearch = () => {
    const filtered = aquaList.filter(pool =>
      pool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAquaList(filtered); 
  };

  const deletePool = (id) => {
    axios.delete(`https://koicare.azurewebsites.net/api/Pool/${id}`)
      .then(() => {
        fetchPools();
      });
  };

  return (
    <div>
      <Header />
      <div className="aquarium_list_container">
        <div className="header-with-button">
          <h2 className="aquarium_list_title">Aquarium Management</h2>
          <button className="create-fish-button" onClick={() => navigate("/createaquarium")}>
            Create Aquarium
          </button>
        </div>

        <div className="search_pool_form">
          <input
            type="text"
            placeholder="Search by Pool Name"
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
                  <button onClick={() => alert('Edit Pool functionality to be implemented')}>Edit</button>
                  <button onClick={() => deletePool(aquarium.id)}>Delete</button>
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

export default AquariumManagement;
