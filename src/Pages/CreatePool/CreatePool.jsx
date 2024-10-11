import "./CreatePool.css";

const CreatePool = () => {
  return (
    <>
      <CreatePoolForm />
    </>
  );
};

function CreatePoolForm() {
  return (
    <form className="form_pool">
      <p className="form_title">Create Pool</p>

      <div className="form_grid_pool">
        <div className="column">
          <div className="input_infor">
            <label>Pool Name:</label>
            <input type="text" placeholder="Enter pool name"></input>
          </div>

          <div className="input_infor">
            <label>Width:</label>
            <input type="text" placeholder="Enter width"></input>
          </div>

          <div className="input_infor">
            <label>Height:</label>
            <input type="text" placeholder="Enter height"></input>
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

export default CreatePool;
