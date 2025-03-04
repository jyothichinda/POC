import React, { useState, useEffect } from "react";
import ConfigurationsTable from "./components/ConfigurationsTable";

const App = () => {
  const [data, setData] = useState([
    {
      name: "Master System Decisions",
      status: "System",
      lastUpdatedBy: "Admin",
      lastUpdatedAt: "03/03/2025 11:35:27",
      action: "",
    },
    {
      name: "Master Manual Throttle",
      status: "System",
      lastUpdatedBy: "Admin",
      lastUpdatedAt: "03/03/2025 21:35:27",
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
        console.error("Failed to parse SSE data:", error);
      }
    };
    eventSource.onerror = () => {
      console.error("SSE connection failed!");
      eventSource.close();
    };
    return () => eventSource.close();
  }, []);

  return <ConfigurationsTable data={data} />;
};

export default App;
