import React, { useEffect, useState } from "react";
import axios from "axios";
import SweepingTable from "./components/SweepingTable";

const App = () => {
  const [data, setData] = useState([]);

  const formatDateTime = (timeArray) => {
    if (!timeArray || timeArray.length < 5) return "Invalid Date";

    const [year, month, day, hours, minutes] = timeArray;

    const date = new Date(year, month - 1, day, hours, minutes);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  async function fetchSweepingData() {
    try {
      const response = await axios.get("http://192.168.1.9:9898/sweeping_data");
      const formattedData = response.data.map((item) => ({
        ...item,
        next_execution: formatDateTime(item.next_execution),
      }));
      setData(formattedData || []);
    } catch (error) {
      console.error("Error fetching projected data:", error);
    }
  }

  useEffect(() => {
    fetchSweepingData(); // Call async function
  }, []);

  return <SweepingTable data={data} fetchData={fetchSweepingData} />;
};

export default App;
