import "./koiStatis.css";
import axiosInstance from "../../axiosInstance";

const KoiStatis = () => {
  return (
    <div className="koi-statis-container">
      <p>Koi Statistics</p>
      <div className="koi-choose-form">
        Koi:
        <select>
          <option></option>
        </select>
      </div>
    </div>
  );
};

export default KoiStatis;
