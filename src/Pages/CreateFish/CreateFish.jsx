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
    <form className="form_fish">
      <p className="form_title">Create Fish</p>

      <div className="form_grid_fish">
        <div className="column">
          <div className="input_infor">
            <label>Fish Name</label>
            <input type="text"></input>
          </div>

          <div className="input_infor">
            <label>Pool Name:</label>
            <select className="pool_opt">
              <option value="pool 1">Pool 1</option>
              <option value="pool 2">Pool 2</option>
              <option value="pool 3">Pool 3</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Gender:</label>
            <select className="pool_opt">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Origin:</label>
            <select className="pool_opt">
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="america">America</option>
            </select>
          </div>
        </div>

        <div className="column">
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
            <label>Cost:</label>
            <input type="text"></input>
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

export default CreateFish;
