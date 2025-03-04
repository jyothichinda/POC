import React, { useEffect, useState } from "react";
import PoolingTable from "./components/PoolingTable";

const App = () => {
  const [data, setData] = useState([
    {
      name: "ABC",
      master: "ABC Bank",
      currency: "USD",
      participating: "ABC-1, ABC-2",
      status: "Active",
      execute: "02/27/2025",
      balance: "$500,000",
      liquidity: "$100,000",
      update: "02/25/2025",
      interest: "1.5%",
      rebalancing: "Yes",
      action: "View / Edit",
    },
    {
      name: "DEF",
      master: "DEF Bank",
      currency: "INR",
      participating: "",
      status: "InActive",
      execute: "",
      balance: "",
      liquidity: "",
      update: "",
      interest: "",
      rebalancing: "",
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
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE Connection Failed!");
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return <PoolingTable data={data} />;
};

export default App;
