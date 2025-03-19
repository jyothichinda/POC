import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfigurationsTable from "./components/ConfigurationsTable";

const App = () => {
  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://10.10.0.11:9898/get/masterThrottle_configuration"
      );
      setData(response.data || []);
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
