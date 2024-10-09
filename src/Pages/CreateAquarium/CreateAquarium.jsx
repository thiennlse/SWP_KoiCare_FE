import "./CreateAquarium.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const CreateAquarium = () => {
  return (
    <div>
      <Header />
      <CreateAquariumForm />
      <Footer />
    </div>
  );
};

function CreateAquariumForm() {
  return (
    <form className="form_pool">
      <p className="form_title">Create Aquarium</p>

      <div className="form_grid_pool">
        <div className="column">
          <div className="input_infor">
            <label>Aquarium Name:</label>
            <input type="text" placeholder="Enter aquarium name"></input>
          </div>

          <div className="input_infor">
            <label>Size:</label>
            <input type="text" placeholder="Enter size"></input>
          </div>

          <div className="input_infor">
            <label>Depth:</label>
            <input type="text" placeholder="Enter depth"></input>
          </div>

          <div className="input_infor">
            <label>Description:</label>
            <input type="text" placeholder="Enter description"></input>
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
}

export default CreateAquarium;
