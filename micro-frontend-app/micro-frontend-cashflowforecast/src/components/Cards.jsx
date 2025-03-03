import React, { useState, useEffect } from "react";
import { Card, Skeleton, Col, Typography } from "antd";
import { formatCurrency } from "../utils/formatData";

const CardsContainer = () => {
  const [loading, setLoading] = useState(true);
  const cardData = [
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
      id: 6,
      title: "Projected Closing Balance",
      amount: "4500.00",
      cashFlowType: "projectedClosingBalance",
      stats: "+7% over prev hour",
      currency: "USD",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {cardData.map((card) => (
        <Col key={card.id} span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            title={
              loading ? (
                <Skeleton.Input active size="default" />
              ) : (
                <p
                  style={{
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    margin: 0,
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  {card.title}
                </p>
              )
            }
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <div>
                <Typography.Title level={5}>
                  {formatCurrency(
                    Number(card.amount),
                    card.currency
                  ).toLocaleString()}
                </Typography.Title>
                <Typography.Paragraph>{card.stats}</Typography.Paragraph>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </>
  );
};

export default CardsContainer;
