import React from "react";
import { Table } from "antd";

const CashFlowTable = (props) => {
  const { data } = props;

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Net Debt Balance",
      dataIndex: "netDebtBalance",
      key: "netDebtBalance",
    },
    {
      title: "Net Debt Level",
      dataIndex: "netDebtLevel",
      key: "netDebtLevel",
    },
  ];

  const processedData = data.map((item) => {
    let netDebtBalance = 0;
    let netDebtLevel = 0;

    // Extract required fields
    const openingBalance = parseFloat(
      data.find((d) => d.title === "Opening Balance")?.amount || "0"
    );

    const currentCashReserve = parseFloat(
      data.find((d) => d.title === "Current Cash Reserve")?.amount || "0"
    );

    const projectedCashOutflow = parseFloat(
      data.find((d) => d.title === "Projected Cash Outflow")?.amount || "0"
    );

    // Calculate Net Debt Balance
    netDebtBalance = currentCashReserve - projectedCashOutflow;

    // Calculate Net Debt Level
    netDebtLevel =
      openingBalance !== 0 ? (netDebtBalance / openingBalance) * 100 : 0;

    return {
      ...item,
      netDebtBalance: netDebtBalance.toFixed(2), // Keeping two decimal places
      netDebtLevel: netDebtLevel.toFixed(2) + "%",
    };
  });
  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={processedData}
      pagination={false}
    />
  );
};

export default CashFlowTable;
