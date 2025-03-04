import React, { useState, useEffect } from "react";
import ForeCastTable from "./components/ForeCastTable";
import CardsContainer from "./components/Cards";
import { Row } from "antd";

const App = () => {
  const [data, setData] = useState([
    {
      id: "MSG123",
      instrument: "Cash Receipts from customer",
      network: "ACH",
      inflow: "$10,000",
      outflow: "$0",
      status: "Completed",
      settlementDate: "03/03/2025 11:35:27",
    },
    {
      id: "MSG234",
      instrument: "Cash Payments from supplier",
      network: "FED",
      inflow: "$0",
      outflow: "$20,000",
      status: "Pending",
      settlementDate: "03/03/2025 21:35:27",
    },
  ]);

  const [cardData, setCardData] = useState([
    {
      id: 1,
      title: "Opening Balance",
      amount: "50000.00",
      cashFlowType: "inflow",
      stats: "+5% over prev hour",
      currency: "USD",
    },
    {
      id: 2,
      title: "Total Cash Inflow",
      amount: "32000.00",
      cashFlowType: "inflow",
      stats: "+8% over prev hour",
      currency: "USD",
    },
    {
      id: 3,
      title: "Total Cash Outflow",
      amount: "18000.00",
      cashFlowType: "outflow",
      stats: "+6% over prev hour",
      currency: "USD",
    },
    {
      id: 4,
      title: "Net Cash Flow",
      amount: "14000.00",
      cashFlowType: "inflow",
      stats: "+12% over prev hour",
      currency: "USD",
    },
    {
      id: 5, // Corrected missing id
      title: "Projected Closing Balance",
      amount: "4500.00",
      cashFlowType: "projectedClosingBalance",
      stats: "+7% over prev hour",
      currency: "USD",
    },
  ]);

  useEffect(() => {
    const eventSource = new EventSource("backend url");

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        if (newData.type === "forecast") {
          setData((prev) => [...prev, newData]);
        } else if (newData.type === "cardUpdate") {
          setCardData((prev) =>
            prev.map((card) =>
              card.id === newData.id ? { ...card, ...newData } : card
            )
          );
        } else {
          console.warn("Unknown data type received:", newData);
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection failed!", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <Row gutter={[16, 16]} >
      <CardsContainer cardData={cardData} />
      <ForeCastTable data={data} />
    </Row>
  );
};

export default App;
