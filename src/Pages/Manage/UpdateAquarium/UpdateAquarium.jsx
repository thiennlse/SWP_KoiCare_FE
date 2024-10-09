import "./UpdateAquarium.css";
import Header from "../../../Components/header/header";
import Footer from "../../../Components/footer/footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAquarium = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aquarium, setAquarium] = useState({
    name: "",
    size: "",
    depth: "",
    description: ""
  });

  useEffect(() => {
    fetchAquariumData();
  }, []);

  const fetchAquariumData = () => {
    axios.get(`https://koicare.azurewebsites.net/api/Pool/${id}`)
      .then((res) => {
        setAquarium(res.data);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://koicare.azurewebsites.net/api/Pool/${id}`, aquarium)
      .then(() => {
        alert("Aquarium updated successfully!");
        navigate("/aquariummanagement");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAquarium({ ...aquarium, [name]: value });
  };

  return (
    <div>
      <Header />
      <UpdateAquariumForm 
        aquarium={aquarium} 
        handleChange={handleChange} 
        handleUpdate={handleUpdate} 
        navigate={navigate}
      />
      <Footer />
    </div>
  );
};

function UpdateAquariumForm({ aquarium, handleChange, handleUpdate, navigate }) {
  return (
    <form className="form_pool" onSubmit={handleUpdate}>
      <p className="form_title">Update Aquarium</p>

      <div className="form_grid_pool">
        <div className="column">
          <div className="input_infor">
            <label>Aquarium Name:</label>
            <input 
              type="text" 
              name="name" 
              value={aquarium.name} 
              onChange={handleChange} 
              placeholder="Enter aquarium name"
            />
          </div>

          <div className="input_infor">
            <label>Size:</label>
            <input 
              type="text" 
              name="size" 
              value={aquarium.size} 
              onChange={handleChange} 
              placeholder="Enter size"
            />
          </div>

          <div className="input_infor">
            <label>Depth:</label>
            <input 
              type="text" 
              name="depth" 
              value={aquarium.depth} 
              onChange={handleChange} 
              placeholder="Enter depth"
            />
          </div>

          <div className="input_infor">
            <label>Description:</label>
            <input 
              type="text" 
              name="description" 
              value={aquarium.description} 
              onChange={handleChange} 
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/aquariummanagement")}>Cancel</button>
      </div>
    </form>
  );
}

export default UpdateAquarium;
