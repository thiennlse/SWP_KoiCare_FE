import "./koiStatis.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import KoiChart from "../KoiStatis/koiChart";

const KoiStatis = () => {
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const memberId = JSON.parse(localStorage.getItem("userId"));
  const [poolList, setPoolList] = useState([]);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await axiosInstance.get("/api/Pool?page=1&pageSize=100");
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setPoolList(memberPools);
      } catch (err) {
        console.error("Error fetching pools data:", err);
        toast.error("Failed to fetch pools data");
      }
    };

    if (memberId) {
      fetchPools(fishList);
    }
  }, [memberId]);

  useEffect(() => {
    axiosInstance.get("api/Fish?page=1&pageSize=100").then((res) => {
      const filteredFish = res.data.filter((fish) =>
        poolList.some((pool) => pool.id === fish.poolId)
      );
      setFishList(filteredFish);
    });
    console.log();
  }, [memberId, poolList]);

  const handleFishChange = (event) => {
    const fishId = event.target.value;

    const selectedFish = fishList
      .sort((a, b) => a.id - b.id)
      .find((fish) => fish.id === parseInt(fishId));
    if (selectedFish) {
      selectedFish.fishProperties.sort((a, b) => a.id - b.id);
    }

    setSelectedFish(selectedFish);
    console.log(selectedFish);
  };

  return (
    <div className="koi-statis-container">
      <div className="koi-choose-form">
        <h1>Koi Statistics</h1>
        <select onChange={handleFishChange}>
          <option value="">Select a Fish</option>
          {fishList.map((fish) => (
            <option key={fish.id} value={fish.id}>
              {fish.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFish && (
        <div className="koi-chart-container">
          <KoiChart fishInfor={selectedFish} />
        </div>
      )}
    </div>
  );
};

export default KoiStatis;
