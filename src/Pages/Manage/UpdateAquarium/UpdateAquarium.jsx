import "./UpdateAquarium.css";
import Header from "../../../Components/header/header";
import Footer from "../../../Components/footer/footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 

const UpdateAquarium = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [aquariumData, setAquariumData] = useState({
    name: "",
    size: "",
    depth: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get(`https://koicare.azurewebsites.net/api/Pool/${id}`)
      .then((response) => {
        setAquariumData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching aquarium details:", error);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(aquariumData);
    axios
      .put(`https://koicare.azurewebsites.net/api/Pool/${id}`, aquariumData)
      .then((response) => {
        alert("Aquarium updated successfully!");
        navigate("/aquariummanagement");
      })
      .catch((error) => {
        console.error("Error updating aquarium:", error.response.data); // Kiểm tra lỗi trả về
        alert("Failed to update aquarium. Please try again.");
      });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAquariumData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Header />
      <UpdateAquariumForm
        aquariumData={aquariumData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
      <Footer />
    </div>
  );
};

function UpdateAquariumForm({ aquariumData, handleChange, handleUpdate }) {
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
              placeholder="Enter aquarium name"
              value={aquariumData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input_infor">
            <label>Size:</label>
            <input
              type="text"
              name="size"
              placeholder="Enter size"
              value={aquariumData.size}
              onChange={handleChange}
            />
          </div>

          <div className="input_infor">
            <label>Depth:</label>
            <input
              type="text"
              name="depth"
              placeholder="Enter depth"
              value={aquariumData.depth}
              onChange={handleChange}
            />
          </div>

          <div className="input_infor">
            <label>Description:</label>
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              value={aquariumData.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UpdateAquarium;
