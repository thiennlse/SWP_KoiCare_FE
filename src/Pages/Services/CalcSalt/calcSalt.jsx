import "./calcSalt.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [selectedAqua, setSelectedAqua] = useState(null);
  const [calculationResultHTML, setCalculationResultHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const memberId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    } else {
      console.error("No memberId found. Please log in.");
    }
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axiosInstance
      .get("/api/Pool?page=1&pageSize=100", {
        params: { _timestamp: new Date().getTime() },
      })
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setAquaList(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools:", err);
      });
  };

  const handleCalcSaltByAI = (aquaId) => {
    setLoading(true);
    axiosInstance
      .post(`/api/SupportAI/supportcalculatesalt/${aquaId}`)
      .then((res) => {
        const cleanHtml = res.data
          .replace(/^```html\s*/, "")
          .replace(/```$/, "");
        setCalculationResultHTML(cleanHtml);
        toast.success("Calculation completed!", { autoClose: 2000 });
      })
      .catch((err) => {
        toast.error("Failed to calculate salt.", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleCalcSalt(aquaId) {}

  const handleShowAqua = (aqua) => {
    setSelectedAqua(aqua);
    setIsShow(true);
    setCalculationResultHTML("");
  };

  return (
    <div>
      {memberId ? (
        <div className="aquarium-container">
          <div className="header-with-button">
            <h2 className="aquarium-title">Calculate Salt</h2>
          </div>
          <div className="dropdown-aqua">
            <button className="dropdown-aqua-button">
              {isShow ? selectedAqua.name : "List Of Pool"}
            </button>
            <div className="dropdown-content-aqua">
              {aquaList.length > 0 ? (
                aquaList.map((aqua, index) => (
                  <div
                    key={index}
                    className="dropdown-pool"
                    onClick={() => handleShowAqua(aqua)}
                  >
                    {aqua.name}
                  </div>
                ))
              ) : (
                <div>No pool available</div>
              )}
            </div>
          </div>
          {selectedAqua && (
            <div className="aqua-details">
              <h3>Pool Details</h3>
              <p>
                <strong>Name:</strong> {selectedAqua.name}
              </p>
              <p>
                <strong>Size:</strong> {selectedAqua.size} cm²
              </p>
              <p>
                <strong>Depth:</strong> {selectedAqua.depth} cm
              </p>
              <button
                className="calc-salt"
                onClick={() => handleCalcSaltByAI(selectedAqua.id)}
              >
                Calculate By Gemini
              </button>

              <button
                className="calc-salt"
                onClick={() => handleCalcSalt(selectedAqua.id)}
              >
                Calculate By System
              </button>
              {loading && <div className="loader"></div>}
            </div>
          )}
          {calculationResultHTML && (
            <div
              className="calculation-result"
              dangerouslySetInnerHTML={{ __html: calculationResultHTML }}
            />
          )}
        </div>
      ) : (
        <div className="centered-container">
          <p>Login to Calculate Salt</p>
          <a href="/login">
            <button className="btn btn-warning">Login</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default AquariumManagement;
