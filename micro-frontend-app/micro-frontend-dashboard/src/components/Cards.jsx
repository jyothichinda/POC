import React, { useState, useEffect } from "react";
import { Card, Skeleton, Col, Typography } from "antd";
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const CardsContainer = ({ cardData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (cardData.length === 0) {
    return (
      <Typography.Text style={{ textAlign: "center", width: "100%" }}>
        No data available
      </Typography.Text>
    );
  }

  const getCardIcon = (title) => {
    if (title.toLowerCase().includes("inflow"))
      return <ArrowUpOutlined style={{ color: "green", fontSize: "20px" }} />;
    if (title.toLowerCase().includes("outflow"))
      return <ArrowDownOutlined style={{ color: "red", fontSize: "20px" }} />;
    return <DollarOutlined style={{ color: "#1890ff", fontSize: "20px" }} />;
  };

  return (
    <>
      {cardData.map((card) => (
        <Col key={card.id} span={6} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            title={
              loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {getCardIcon(card.title)}
                  <Typography.Text
                    style={{
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      margin: 0,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {card.title}
                  </Typography.Text>
                </div>
              )
            }
            style={{
              width: "100%",
              minHeight: "160px", // Reduced height
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "8px", // Slightly smaller border radius
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
              background: "linear-gradient(135deg, #f9f9f9, #ffffff)", // Softer gradient
              padding: "12px", // Added padding for better spacing
            }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                    color: card.title.toLowerCase().includes("outflow")
                      ? "red"
                      : "green",
                    fontSize: "16px", // Smaller font size for the amount
                  }}
                >
                  {Number(card.amount).toLocaleString()} {card.currency}
                </Typography.Title>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </>
  );
};

export default CardsContainer;
