import React, { useEffect, useState } from "react";
import TransactionsTable from "./components/TransactionsTable";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://10.10.0.53:8080/transaction/sse"
    );

    eventSource.onopen = () => {
      console.log("SSE Connection Opened");
    };

    // Default unnamed events
    eventSource.onmessage = (event) => {
      console.log("onmessage triggered:", event);
    };

    // Handle 'heartbeat' event
    eventSource.addEventListener("heartbeat", (event) => {
      console.log("Heartbeat received:", event);
    });

    // Handle 'payment-update' event
    eventSource.addEventListener("payment-update", (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("Payment Update Received:", newData);
        // Ensure uniqueness using msgId
        setData(newData);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      console.log("Cleaning up SSE...");
      eventSource.close();
    };
  }, []);

  return <TransactionsTable data={data} />;
};

export default App;
