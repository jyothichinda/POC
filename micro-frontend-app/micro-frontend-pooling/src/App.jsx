import React, { useEffect, useState } from "react";
import axios from "axios";
import PoolingTable from "./components/PoolingTable";

const App = () => {
  const [data, setData] = useState([]);

  async function fetchPoolingData() {
    try {
      const res = await axios.get("http://192.168.1.9:9898/pooling_data");
      setData(res.data || {});
    } catch (error) {
      console.error("Error fetching projected data:", error);
    }
  }

  useEffect(() => {
    fetchPoolingData(); // Call async function
  }, []);

  return <PoolingTable data={data} fetchData={fetchPoolingData} />;
};

export default App;
