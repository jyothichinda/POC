import React, { useEffect, useState } from "react";
import TransactionsTable from "./components/TransactionsTable";

const App = () => {
  const [data, setData] = useState([
    {
      id: "MSG123",
      creditor: "XYZ LTD",
      debtor: "ABC Corp",
      network: "$500",
      tier: 1,
      status: "Completed",
      amount: "$12345.678",
      cashflow: "Cash Outflow",
      time: "03/03/2025 11:35:27",
    },
    {
      id: "MSG124",
      debtor: "National Bank",
      creditor: "ABC Corp",
      network: "$5800",
      tier: 1,
      status: "Pending",
      amount: "$38945.12",
      cashflow: "Cash Inflow",
      time: "03/03/2025 16:45:19",
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

  return <TransactionsTable data={data} />;
};

export default App;
