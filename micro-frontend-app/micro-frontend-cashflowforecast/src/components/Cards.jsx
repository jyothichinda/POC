import React, { useState, useEffect } from "react";
import {
  Card,
  Skeleton,
  Col,
  Typography,
  Row,
  Button,
  message,
  Modal,
  InputNumber,
} from "antd";
import axios from "axios";

// Card Skeleton Loader Component
const CardSkeletonLoader = () => (
  <Col span={4} xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card style={{ width: "100%" }}>
      <Skeleton.Input active size="default" style={{ width: "80%" }} />
      <Skeleton active paragraph={{ rows: 1 }} />
    </Card>
  </Col>
);

const CardsContainer = ({ projectedData = {}, data = [], levels = [] }) => {
  const [loading, setLoading] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(""); // User-provided opening balance
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedLevel, setSelectedLevel] = useState(null); // Track the selected level

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

  // Submit user-provided opening balance to backend
  const submitOpeningBalance = async () => {
    if (!openingBalance || isNaN(openingBalance)) {
      return message.error("Please enter a valid opening balance");
    }

    try {
      // Update the opening_Balance for the selected level
      const updatedLevels = levels.map((level) =>
        level.level === selectedLevel.level
          ? { ...level, opening_Balance: parseFloat(openingBalance) }
          : level
      );

      // Send the updated levels to the backend
      await axios.put("http://192.168.1.2:9898/updateConfig", updatedLevels);

      message.success("Opening balance submitted successfully!");
      setIsModalVisible(false); // Close the modal after submission
      setOpeningBalance(""); // Reset the input field
    } catch (error) {
      console.error("Error submitting opening balance:", error);
      message.error("Failed to submit opening balance");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Automatically show modal for the root level if opening balance is 0
    const rootLevel = levels.find((level) => level.level === "Root Level");
    if (rootLevel && rootLevel.opening_Balance === 0) {
      setSelectedLevel(rootLevel);
      setIsModalVisible(true);
    }
  }, [levels]);

  return (
    <div>
      {/* Modal for Opening Balance */}
      <Modal
        title={`Set Opening Balance for ${selectedLevel?.level || "Level"}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={false} // Prevent closing the modal without setting the balance
      >
        <Typography.Title level={5} style={{ textAlign: "center" }}>
          Predicted Opening Balance: $
          {projectedData.projectedOpeningBalance || 0}
        </Typography.Title>
        <InputNumber
          placeholder="Enter Opening Balance"
          value={openingBalance}
          onChange={(value) => setOpeningBalance(value)} // Corrected to use `value` directly
          style={{ marginBottom: "16px", width: "100%" }} // Ensure full width for better UI
          min={0} // Prevent negative values
        />
        <Button
          type="primary"
          onClick={submitOpeningBalance}
          block
          disabled={openingBalance === null || openingBalance === ""} // Disable button if input is empty
        >
          Submit Opening Balance
        </Button>
      </Modal>

      {/* Cards */}
      <Row
        gutter={[16, 16]}
        style={{ width: "100%", justifyContent: "center" }}
      >
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
    </div>
  );
};

export default CardsContainer;
