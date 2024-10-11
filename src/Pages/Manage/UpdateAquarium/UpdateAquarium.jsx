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
        alert("Failed to load aquarium details.");
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedAquariumData = {
      memberId: 1, 
      name: aquariumData.name.trim(),
      size: Number(aquariumData.size),  
      depth: Number(aquariumData.depth),  
      description: aquariumData.description.trim(),
      waterId: 1,  
    };

    console.log("Sending updated data:", updatedAquariumData);

    axios
      .put(`https://koicare.azurewebsites.net/api/Pool/update/${id}`, updatedAquariumData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Aquarium updated successfully!");

        // Update localStorage after successful API response
        const storedAquariums = JSON.parse(localStorage.getItem("aquariums")) || [];
        const aquariumIndex = storedAquariums.findIndex(aqua => aqua.id === Number(id));

        if (aquariumIndex !== -1) {
          // Update the aquarium data in localStorage
          storedAquariums[aquariumIndex] = { ...updatedAquariumData, id: Number(id) };
          localStorage.setItem("aquariums", JSON.stringify(storedAquariums));
        }

        navigate("/aquariummanagement");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error updating aquarium:", error.response.data);
          alert(`Failed to update aquarium. Error: ${error.response.data}`);
        } else {
          console.error("Error setting up request:", error.message);
          alert(`Failed to update aquarium. Error: ${error.message}`);
        }
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
              required
            />
          </div>

          <div className="input_infor">
            <label>Size:</label>
            <input
              type="number"   
              name="size"
              placeholder="Enter size"
              value={aquariumData.size}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Depth:</label>
            <input
              type="number"  
              name="depth"
              placeholder="Enter depth"
              value={aquariumData.depth}
              onChange={handleChange}
              required
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
