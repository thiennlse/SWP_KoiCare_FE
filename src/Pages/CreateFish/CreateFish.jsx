import "./CreateFish.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const CreateFish = () => {
  return (
    <div>
      <Header />
      <CreateFishForm />
      <Footer />
    </div>
  );
};

function CreateFishForm() {
  return (
    <form className="form">
      <p className="form_title">Create Fish</p>

      <div className="form_grid">
        <div className="input_infor">
          <label className="fish_name">Fish Name</label>
        </div>
        <div className="input_infor">
          <label>Pool Name:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Size:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Weight:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Age:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Gender:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Origin:</label>
          <input type="text"></input>
        </div>
        <div className="input_infor">
          <label>Cost:</label>
          <input type="text"></input>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
}

export default CreateFish;
