import "./koiStatis.css";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import KoiChart from "../KoiStatis/koiChart";

const KoiStatis = () => {
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [viewType, setViewType] = useState("size");
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
      setSelectedWeek(1);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `api/Fish/getlastpropertiesonday?fishId=${fishId}`
      );
      console.log("Fish Data:", res.data);
      setSelectedFish(res.data);
      setSelectedWeek(1);
    } catch (err) {
      console.error("Error fetching fish properties:", err);
      toast.error("Failed to fetch fish properties");
    }
  };

  const handleWeekChange = (event) => {
    const week = event.target.value;
    setSelectedWeek(week);
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
        <select onChange={handleWeekChange}>
          <option value="1">Week 1</option>
          {Array.from({ length: 52 }, (_, i) => (
            <option key={i} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>
      </div>

      {selectedFish && (
        <div className="koi-chart-container">
          <KoiChart
            fishInfor={selectedFish}
            viewType={viewType}
            selectedWeek={selectedWeek}
          />
        </div>
      )}
    </div>
  );
};

export default KoiStatis;
