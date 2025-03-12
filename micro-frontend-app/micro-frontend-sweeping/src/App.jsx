import React, { useEffect, useState } from "react";
import axios from "axios";
import SweepingTable from "./components/SweepingTable";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchSweepingData() {
      try {
        const res = await axios.get("http://10.10.0.53:9898/sweeping_data");
        setData(res.data || {});
      } catch (error) {
        console.error("Error fetching projected data:", error);
      }
    }

    fetchSweepingData(); // Call async function
  }, []);

  return <SweepingTable data={data} />;
};

export default App;
