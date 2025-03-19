import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfigurationsTable from "./components/ConfigurationsTable";

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

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://10.10.0.11:9898/get/masterThrottle_configuration"
      );
      const formattedData = response.data.map((item) => ({
        ...item,
        lastUpdatedTime: formatDateTime(item.lastUpdatedTime),
      }));

      setData(formattedData || []);
    } catch (error) {
      console.log("Error while fetching http response:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <ConfigurationsTable data={data} fetchData={fetchData} />;
};

export default App;
