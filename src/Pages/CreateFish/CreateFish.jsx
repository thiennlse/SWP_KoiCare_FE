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
        {/* Fish Name */}
        <div className="input-group">
          <label htmlFor="fishName">Fish Name:</label>
          <input type="text" id="fishName" name="fishName" />
        </div>

        {/* Pool Name */}
        <div className="input-group">
          <label htmlFor="poolName">Pool Name:</label>
          <input type="text" id="poolName" name="poolName" />
        </div>

        {/* Size */}
        <div className="input-group">
          <label htmlFor="size">Size:</label>
          <input type="text" id="size" name="size" />
        </div>

        {/* Weight */}
        <div className="input-group">
          <label htmlFor="weight">Weight:</label>
          <input type="text" id="weight" name="weight" />
        </div>

        {/* Age */}
        <div className="input-group">
          <label htmlFor="age">Age:</label>
          <input type="text" id="age" name="age" />
        </div>

        {/* Gender */}
        <div className="input-group">
          <label htmlFor="gender">Gender:</label>
          <input type="text" id="gender" name="gender" />
        </div>

        {/* Origin */}
        <div className="input-group">
          <label htmlFor="origin">Origin:</label>
          <input type="text" id="origin" name="origin" />
        </div>

        {/* Cost */}
        <div className="input-group">
          <label htmlFor="cost">Cost:</label>
          <input type="text" id="cost" name="cost" />
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
}

export default CreateFish;
