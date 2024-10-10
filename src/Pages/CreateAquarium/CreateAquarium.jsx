import axios from 'axios';
import { useState } from 'react';
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const CreateAquarium = () => {
  const [aquarium, setAquarium] = useState({
    id: 0,
    memberId: 1, 
    name: "",
    size: 0,
    depth: 0,
    description: "",
    waterId: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const aquariumData = {
      ...aquarium,
      size: aquarium.size ? Number(aquarium.size) : 0,  
      depth: aquarium.depth ? Number(aquarium.depth) : 0  
    };

    console.log("Dữ liệu gửi đi:", aquariumData);

    axios.post("https://koicare.azurewebsites.net/api/Pool/add", aquariumData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Aquarium created successfully:", response.data);
        alert("Aquarium created successfully!");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
          alert(`Failed to create aquarium. Status: ${error.response.status}`);
        } else if (error.request) {
          console.error("Error request:", error.request);
          alert("Failed to create aquarium. No response from server.");
        } else {
          console.error("Error setting up request:", error.message);
          alert("Failed to create aquarium. Please try again.");
        }
      });
  };

  return (
    <div>
      <Header />
      <form className="form_pool" onSubmit={handleSubmit}>
        <p className="form_title">Create Aquarium</p>

        <div className="form_grid_pool">
          <div className="column">
            <div className="input_infor">
              <label>Aquarium Name:</label>
              <input 
                type="text" 
                placeholder="Enter aquarium name" 
                value={aquarium.name}
                onChange={(e) => setAquarium({ ...aquarium, name: e.target.value })}
                required
              />
            </div>

            <div className="input_infor">
              <label>Size:</label>
              <input 
                type="number" 
                placeholder="Enter size" 
                value={aquarium.size}
                onChange={(e) => setAquarium({ ...aquarium, size: e.target.value })}
                required
              />
            </div>

            <div className="input_infor">
              <label>Depth:</label>
              <input 
                type="number" 
                placeholder="Enter depth" 
                value={aquarium.depth}
                onChange={(e) => setAquarium({ ...aquarium, depth: e.target.value })}
                required
              />
            </div>

            <div className="input_infor">
              <label>Description:</label>
              <input 
                type="text" 
                placeholder="Enter description" 
                value={aquarium.description}
                onChange={(e) => setAquarium({ ...aquarium, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={() => setAquarium({ id: 0, memberId: 1, name: "", size: 0, depth: 0, description: "", waterId: 1 })}>Cancel</button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default CreateAquarium;
