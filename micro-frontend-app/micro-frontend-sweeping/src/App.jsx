import React, { useEffect, useState} from "react";
import SweepingTable from "./components/SweepingTable";

const App = () => {
  const [data, setData] = useState([
    {
      sweep: "ABC",
      master: "ABC BANK",
      currency: "USD",
      direction: "One-Way",
      frequency: "Daily",
      status: "InActive",
      execution: "02/27/2025",
      threshold: "$50,000",
      date: "02/25/2025",
      transfer: "Yes",
      action: "View / Edit",
    },
    {
      sweep: "DEF",
      master: "DEF BANK",
      currency: "INR",
      direction: "Bi-Directional",
      frequency: "Weekly",
      status: "Active",
      execution: "02/27/2025",
      threshold: "",
      date: "",
      transfer: "",
      action: "",
    },
  ]);

  useEffect(() => {
    const eventSource = new EventSource("backend url")

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData((prev) => [...prev, newData])
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

  return <SweepingTable data={data} />;
};

export default App;
