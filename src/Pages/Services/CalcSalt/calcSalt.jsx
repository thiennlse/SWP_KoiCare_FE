import "./calcSalt.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AquariumManagement = () => {
  const [aquaList, setAquaList] = useState([]);
  const [selectedAqua, setSelectedAqua] = useState(null);
  const [aiCalculationResultHTML, setAiCalculationResultHTML] = useState("");
  const [systemCalculationResultHTML, setSystemCalculationResultHTML] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const memberId = JSON.parse(localStorage.getItem("userId"));
  const subId = localStorage.getItem("subId");
  const [productRecommend, setProductRecommend] = useState([]);

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
        setAiCalculationResultHTML(cleanHtml);
        toast.success("AI Calculation completed!", { autoClose: 2000 });
      })
      .catch((err) => {
        toast.error("Failed to calculate salt by AI.", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCalcSalt = (aquaId) => {
    setLoading(true);
    axiosInstance
      .get(`/api/Pool/check-water-element-of-pool/${aquaId}`)
      .then((res) => {
        const result = res.data;

        const calculationResult = `
        <div>
          <h4>Water Element Standards</h4>
          <ul>
            <li><strong>Temperature:</strong> ${result.standardTemperature}°C</li>
            <li><strong>Salt:</strong> ${result.standardSalt} %</li>
            <li><strong>NO2:</strong> ${result.standardNo2} mg/L</li>
            <li><strong>NO3:</strong> ${result.standardNo3} mg/L</li>
            <li><strong>PO4:</strong> ${result.standardPo4} mg/L</li>
            <li><strong>PH:</strong> ${result.standardPH}</li>
            <li><strong>O2:</strong> ${result.standardO2} mg/L</li>
          </ul>
        </div>
      `;

        setSystemCalculationResultHTML(calculationResult);
        toast.success("Water element standards retrieved successfully!", {
          autoClose: 2000,
        });

        axiosInstance
          .get(
            "https://koicare-api.onrender.com/api/Product?page=1&pagesize=100"
          )
          .then((productRes) => {
            const filteredProducts = productRes.data.filter((product) =>
              result.listProductId.includes(product.id)
            );
            setProductRecommend(filteredProducts);
            console.log(filteredProducts);
          });
      })
      .catch((err) => {
        toast.error("Failed to retrieve water element standards by system.", {
          autoClose: 1500,
        });
        console.error("Error fetching water elements:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShowAqua = (aqua) => {
    setSelectedAqua(aqua);
    setIsShow(true);
    setAiCalculationResultHTML("");
    setSystemCalculationResultHTML("");
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
                className={`calc-salt ${
                  !subId || subId === "1" ? "disabled" : ""
                }`}
                onClick={() => handleCalcSaltByAI(selectedAqua.id)}
                disabled={!subId || subId === "1"}
                title={
                  !subId || subId === "1" ? "Upgrade to Premium to use" : ""
                }
              >
                Calculate By Gemini
              </button>

              <button
                className={`calc-salt ${!subId ? "disabled" : ""}`}
                onClick={() => handleCalcSalt(selectedAqua.id)}
                disabled={!subId}
                title={!subId ? "Upgrade to Standard/Premium to use" : ""}
              >
                Calculate By System
              </button>
              {loading && <div className="loader"></div>}
            </div>
          )}
          {aiCalculationResultHTML && (
            <>
              <div
                className="calculation-result"
                dangerouslySetInnerHTML={{ __html: aiCalculationResultHTML }}
              />
              <div>
                <h3>Recommended Products</h3>
                <ul>
                  {productRecommend.length > 0 ? (
                    productRecommend.map((product) => (
                      <li key={product.id}>{product.name}</li>
                    ))
                  ) : (
                    <p>No products found</p>
                  )}
                </ul>
              </div>
            </>
          )}
          {systemCalculationResultHTML && (
            <>
              <div
                className="calculation-result"
                dangerouslySetInnerHTML={{
                  __html: systemCalculationResultHTML,
                }}
              />
              <div>
                <h3>Recommended Products</h3>
                <ul>
                  {productRecommend.length > 0 ? (
                    productRecommend.map((product) => (
                      <li key={product.id}>{product.name}</li>
                    ))
                  ) : (
                    <p>No products found</p>
                  )}
                </ul>
              </div>
            </>
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
