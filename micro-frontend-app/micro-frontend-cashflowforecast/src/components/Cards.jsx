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

const CardsContainer = ({ cardData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Row gutter={[16, 16]} style={{width:"100%",justifyContent:"center"}}>
      {loading
        ? Array.from({ length: 5 }).map((_, index) => <CardSkeletonLoader key={index} />)
        : cardData.map((card) => (
            <Col key={card.id} span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
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
                    {card.title}
                  </p>
                }
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography.Title level={5}>
                  {formatCurrency(Number(card.amount), card.currency).toLocaleString()}
                </Typography.Title>
                <Typography.Paragraph>{card.stats}</Typography.Paragraph>
              </Card>
            </Col>
          ))}
    </Row>
  );
};

export default CardsContainer;
