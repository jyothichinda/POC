import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfigurationsTable from "./components/ConfigurationsTable";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://10.10.0.53:9898/api/masterThrottle_configuration"
        );
        setData(response.data || []);
      } catch (error) {
        console.log("Error while fetching http response:", error);
      }
    }

    fetchData();
  }, []);

  return <ConfigurationsTable data={data} />;
};

export default App;
