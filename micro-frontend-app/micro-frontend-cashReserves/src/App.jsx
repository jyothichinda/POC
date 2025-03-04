import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const eventSource = new EventSource("backend url");

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData((prev) => [...prev, newData]);
      } catch (error) {
        console.log("Failed to parse SSE data:", error);
      }
    };
    eventSource.onerror = () => {
      console.error("SSE Connection Failed!!");
      eventSource.close();
    };
    return () => eventSource.close();
  }, []);

  return <ReservesTable data={data} />;
};

export default App;
