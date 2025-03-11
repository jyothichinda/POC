import React, { useState, useEffect } from "react";
import { Card, Skeleton, Col, Typography, Row } from "antd";
import { formatCurrency } from "../utils/formatData";

// Card Skeleton Loader Component
const CardSkeletonLoader = () => (
  <Col span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card style={{ width: "100%" }}>
      <Skeleton.Input active size="default" style={{ width: "80%" }} />
      <Skeleton active paragraph={{ rows: 1 }} />
    </Card>
  </Col>
);

const CardsContainer = ({ projectedData = {}, data = [] }) => {
  console.log(data, "actual data");
  console.log(projectedData, "projected");
  const [loading, setLoading] = useState(true);

  const cardItems = [
    { title: "Opening Balance", key: "OpeningBalance" },
    { title: "Cash Inflows", key: "CashInflow" },
    { title: "Cash Outflows", key: "CashOutflow" },
    { title: "Net Balance", key: "NetCashFlow" },
    { title: "Closing Balance", key: "ClosingBalance" },
  ];

  const totalCashInflow = data.reduce(
    (acc, item) => acc + parseFloat(item.inflow),
    0
  );
  const totalCashOutflow = data.reduce(
    (acc, item) => acc + parseFloat(item.outflow),
    0
  );
  const totalNetCashFlow = data.reduce(
    (acc, item) => acc + parseFloat(item.inflow + item.outflow),
    0
  );

  const totalClosingBalance = 0;

  const updatedActualData = {
    ...data,
    totalCashInflow,
    totalCashOutflow,
    totalClosingBalance,
    totalNetCashFlow,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", justifyContent: "center" }}>
      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <CardSkeletonLoader key={index} />
          ))
        : cardItems.map((item) => (
            <Col key={item.key} span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                title={
                  <p
                    style={{
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      margin: 0,
                      textAlign: "center",
                      padding: 0,
                    }}
                  >
                    {item.title}
                  </p>
                }
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography.Paragraph>
                  <strong>Projected:</strong> $
                  {projectedData[`projected${item.key}`] || 0}
                </Typography.Paragraph>

                {item.key !== "OpeningBalance" && (
                  <Typography.Paragraph>
                    <strong>Actual:</strong> $
                    {updatedActualData[`total${item.key}`] || 0}
                  </Typography.Paragraph>
                )}
              </Card>
            </Col>
          ))}
    </Row>
  );
};

export default CardsContainer;
