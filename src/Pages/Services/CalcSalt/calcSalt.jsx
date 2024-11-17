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
  const [geminiProductRecommend, setGeminiProductRecommend] = useState([]);

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
        fetchRandomSuggestedProductsForGemini();
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

  const fetchRecommendedProducts = (aquaId) => {
    axiosInstance
      .get(`/api/Pool/get-recommended-products/${aquaId}`)
      .then((res) => {
        const recommendedProducts = res.data;
        setProductRecommend(recommendedProducts);
      })
      .catch((err) => {
        console.error("Error fetching recommended products:", err);
      });
  };

  const fetchRandomSuggestedProductsForGemini = () => {
    axiosInstance
      .get("/api/Product?page=1&pagesize=100")
      .then((productRes) => {
        const shuffledProducts = productRes.data.sort(
          () => 0.5 - Math.random()
        );
        const randomProducts = shuffledProducts.slice(0, 5);
        setGeminiProductRecommend(randomProducts);
      })
      .catch((err) => {
        console.error(
          "Error fetching random suggested products for Gemini:",
          err
        );
      });
  };

  const handleShowAqua = (aqua) => {
    setSelectedAqua(aqua);
    setIsShow(true);
    setAiCalculationResultHTML("");
    setSystemCalculationResultHTML("");
  };

  const handleBuySuggestedProduct = (suggestedProduct) => {
    const isLogin = localStorage.getItem("userId");

    if (!isLogin) {
      toast.warn("Please log in to add products to your cart!", {
        autoClose: 1000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === suggestedProduct.id);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.push({ ...suggestedProduct, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  return (
    <div>
      {memberId ? (
        <div className="calc-salt-aquarium-container">
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
          {systemCalculationResultHTML && (
            <div
              className="calculation-result"
              dangerouslySetInnerHTML={{ __html: systemCalculationResultHTML }}
            />
          )}
          {aiCalculationResultHTML && (
            <div
              className="calculation-result"
              dangerouslySetInnerHTML={{ __html: aiCalculationResultHTML }}
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
      {productRecommend.length > 0 && (
        <>
          <h3 className="calc-salt-recommended-products">
            Recommended Products By System
          </h3>
          <div className="calc-salt-product-grid">
            {productRecommend.map((product) => (
              <div key={product.id} className="calc-salt-product-item">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>{product.cost.toLocaleString("en-US")} Vnd</p>
                <button onClick={() => handleBuySuggestedProduct(product)}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {geminiProductRecommend.length > 0 && (
        <>
          <h3 className="calc-salt-recommended-products">
            Recommended Products By Gemini
          </h3>
          <div className="calc-salt-product-grid">
            {geminiProductRecommend.map((product) => (
              <div key={product.id} className="calc-salt-product-item">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>{product.cost.toLocaleString("en-US")} Vnd</p>
                <button onClick={() => handleBuySuggestedProduct(product)}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AquariumManagement;
