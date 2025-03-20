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
        "http://192.168.1.9:9898/get/cash_reserves"
      );
      const formattedData = response.data.map((item) => ({
        ...item,
        last_updated: formatDateTime(item.last_updated),
      }));
      setData(formattedData || []);
    } catch (error) {
      console.log("Error while fetching http response:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <ReservesTable data={data} fetchData={fetchData} />;
};

export default App;
