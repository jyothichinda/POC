import React from "react";
import { Table } from "antd";

const CashFlowTable = (props) => {
  const { data } = props;

  const columns = [
    { title: "Debtor", dataIndex: "debtorName", key: "debtorName" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Txn Amount", dataIndex: "amount", key: "amount" },
    { title: "In/Out-flow", dataIndex: "cashFlow", key: "cashFlow" },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ y: 300 }}
    />
  );
};

export default CashFlowTable;
