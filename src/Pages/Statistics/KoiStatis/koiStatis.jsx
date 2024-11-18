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
      fetchPools();
    }
  }, [memberId]);

  useEffect(() => {
    const fetchFishList = async () => {
      if (poolList.length === 0) return;

      try {
        const res = await axiosInstance.get("api/Fish?page=1&pageSize=100");
        const filteredFish = res.data.filter((fish) =>
          poolList.some((pool) => pool.id === fish.poolId)
        );
        setFishList(filteredFish);
      } catch (err) {
        console.error("Error fetching fish data:", err);
        toast.error("Failed to fetch fish data");
      }
    };

    fetchFishList();
  }, [poolList]);

  const handleFishChange = async (event) => {
    const fishId = event.target.value;

    if (!fishId) {
      setSelectedFish(null);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `api/Fish/getlastpropertiesonday?fishId=${fishId}`
      );
      setSelectedFish(res.data);
    } catch (err) {
      console.error("Error fetching fish properties:", err);
      toast.error("Failed to fetch fish properties");
    }
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
