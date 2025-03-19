import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservesTable from "./components/ReservesTable";

const App = () => {
  const [data, setData] = useState([
    {
      reserve_name: "Emergency Fund",
      master_account: "XYZ LTD",
      currency: "USD",
      reserved_amount: 500,
      minimum_required: 100,
      status: "Completed",
      last_updated: "03/03/2025 11:35:27",
      auto_refill: "yes",
    },
    {
      reserve_name: "Tax Reserve Fund",
      master_account: "DEF LTD",
      currency: "INR",
      reserved_amount: 400,
      minimum_required: 170,
      status: "Pending",
      last_updated: "03/03/2025 11:35:27",
      auto_refill: "no",
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
