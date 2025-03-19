import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservesTable from "./components/ReservesTable";

const App = () => {
  const [data, setData] = useState([
    {
      name: "Emergency Fund",
      master: "XYZ LTD",
      currency: "USD",
      amount: 500,
      minRequired: 100,
      status: "Completed",
      lastUpdated: "03/03/2025 11:35:27",
      autoRefill: true,
      action: "",
    },
    {
      name: "Tax Reserve Fund",
      master: "DEF LTD",
      currency: "INR",
      amount: 400,
      minRequired: 170,
      status: "Pending",
      lastUpdated: "03/03/2025 11:35:27",
      autoRefill: false,
      action: "",
    },
  ]);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://10.10.0.11:9898/get/cash_reserves"
      );
      setData(response.data || []);
    } catch (error) {
      console.log("Error while fetching http response:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <ReservesTable data={data} />;
};

export default App;
