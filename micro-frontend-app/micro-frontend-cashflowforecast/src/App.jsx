import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row } from "antd";
import ActualDataTable from "./components/ActualDataTable";
import CardsContainer from "./components/Cards";

const App = () => {
  const [data, setData] = useState([
    {
      id: 88,
      msgId: "MSGIDDK00028",
      instrument: "Tax Payment for TAX",
      network: "ACH",
      inflow: "925887.34",
      outflow: "0.0",
      status: "Processing",
      settlementDate: [2025, 3, 11, 8, 0],
    },
    {
      id: 89,
      msgId: "MSGIDDK00028",
      instrument: "Tax Payment for TAX",
      network: "ACH",
      inflow: "925887.34",
      outflow: "0.0",
      status: "Processing",
      settlementDate: [2025, 3, 11, 8, 0],
    },
    {
      id: 90,
      msgId: "MSGIDDK00028",
      instrument: "Tax Payment for TAX",
      network: "ACH",
      inflow: "925887.34",
      outflow: "0.0",
      status: "Processing",
      settlementDate: [2025, 3, 11, 8, 0],
    },
    {
      id: 97,
      msgId: "MSGIDDK00028",
      instrument: "Tax Payment for TAX",
      network: "ACH",
      inflow: "925887.34",
      outflow: "0.0",
      status: "Processing",
      settlementDate: [2025, 3, 11, 8, 0],
    },
  ]);
  const [projectedData, setProjectedData] = useState({
    projectedOpeningBalance: 2.0e8,
    projectedCashInflow: 0.0,
    projectedCashOutflow: 2.2e8,
    projectedNetCashFlow: 1.0e8,
    projectedClosingBalance: 1.0e8,
  });

  useEffect(() => {
    async function fetchProjectedData() {
      try {
        const res = await axios.get("http://10.10.0.53:8080/projected_data");
        console.log("Projected Data:", res.data.projectedData);
        setProjectedData(res.data.projectedData || {});
      } catch (error) {
        console.error("Error fetching projected data:", error);
      }
    }

    fetchProjectedData(); // Call async function

    const eventSource = new EventSource(
      "http://10.10.0.53:8080/flow_chart/sse"
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

  return (
    <Row gutter={[16, 16]}>
      <CardsContainer data={data} projectedData={projectedData} />
      <ActualDataTable data={data} />
    </Row>
  );
};

export default App;
