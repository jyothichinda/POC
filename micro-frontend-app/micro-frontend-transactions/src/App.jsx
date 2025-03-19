import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";

const App = () => {
  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const res = await axios.get("http://10.10.0.11:9999/api/getAll_payments");
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const eventSource = new EventSource(
      "http://10.10.0.11:9898/transaction/sse"
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
        setData((prevData) => {
          // Ensure uniqueness based on `id`
          const updatedData = [...prevData]; // Clone previous data array
          newData.forEach((newItem) => {
            const existingIndex = updatedData.findIndex(
              (item) => item.id === newItem.id
            );

            if (existingIndex !== -1) {
              // Update existing record
              updatedData[existingIndex] = newItem;
            } else {
              // Add new record
              updatedData.push(newItem);
            }
          });
          return updatedData;
        });
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
