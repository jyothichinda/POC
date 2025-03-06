import React from "react";
import { Table } from "antd";

const CashFlowTable = (props) => {
  const { data } = props;

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Payer",
      dataIndex: "payer",
      key: "payer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Due Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
  );
};

export default CashFlowTable;
