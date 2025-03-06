import React, { useState, useEffect } from "react";
import { Card, Skeleton, Col, Typography } from "antd";
import { formatCurrency } from "../utils/formatData";
import ReactSpeedometer from "react-d3-speedometer";

const CardsContainer = ({ cardData }) => {
  const [loading, setLoading] = useState(true);

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
              minHeight: "200px", // Ensures all cards have the same height
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : card.title === "AI Forecast Accuracy" ? (
              <ReactSpeedometer
                width={150}
                height={100}
                value={Number(card.confidenceScore)}
                maxValue={100}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
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
