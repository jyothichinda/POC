import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row } from "antd";
import ActualDataTable from "./components/ActualDataTable";
import CardsContainer from "./components/Cards";

const App = () => {
  const [data, setData] = useState([]);
  const [projectedData, setProjectedData] = useState({});

  useEffect(() => {
    async function fetchProjectedData() {
      try {
        const res = await axios.get("http://10.10.0.53:9898/projected_data");
        console.log("Projected Data:", res.data.projectedData);
        setProjectedData(res.data.projectedData || {});
      } catch (error) {
        console.error("Error fetching projected data:", error);
      }
    }
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://10.10.0.11:9999/api/Current_date_transactions"
        );
        setData(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchProjectedData(); // Call async function
    fetchData();

    const eventSource = new EventSource(
      "http://10.10.0.11:9898/flow_chart/sse"
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

    // Handle 'transaction-update' event
    eventSource.addEventListener("transaction-update", (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("Payment Update Received:", newData);
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

  return (
    <Row gutter={[16, 16]}>
      <CardsContainer data={data} projectedData={projectedData} />
      <ActualDataTable data={data} />
    </Row>
  );
};

export default App;
