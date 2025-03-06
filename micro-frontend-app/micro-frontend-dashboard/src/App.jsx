import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Select, Typography, Card } from "antd";
import moment from "moment-timezone";
import { Tabs } from "antd";

import DashBoardSkeleton from "./components/DashboardSkeleton";
import CardsContainer from "./components/Cards";
import RadialPieChartContainer from "./components/RadialPieChart";
import AreaChartContainer from "./components/AreaChart";
import BarChartContainer from "./components/BarChart";
import SunburstChart from "./components/SunburstChart";
import CashFlowTable from "./components/Table";
import BarWithLineChartContainer from "./components/BarWithLineChart";

import "./index.css";

const { Option } = Select;

const App = () => {
  const [loading, setLoading] = useState(true);
  const timezones = moment.tz.names(); // Get all timezones
  const [selectedTimezone, setSelectedTimezone] = useState(
    localStorage.getItem("selectedTimezone") || "UTC"
  );
  const [currentTime, setCurrentTime] = useState(moment().tz(selectedTimezone));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }); //replace with api call using SSE and pass props into card component

  //dummy data
  const apiDummyData = [
    {
      id: 1,
      title: "Opening Balance",
      amount: "50000.00",
      cashFlowType: "inflow",
      stats: "+5% over prev hour",
      currency: "USD",
      date: "",
    },
    {
      id: 2,
      title: "Projected Cash Inflow",
      amount: "32000.00",
      cashFlowType: "inflow",
      stats: "+8% over prev hour",
      currency: "USD",
    },
    {
      id: 3,
      title: "Projected Cash Outflow",
      amount: "18000.00",
      cashFlowType: "outflow",
      stats: "+6% over prev hour",
      currency: "USD",
    },
    {
      id: 4,
      title: "Projected Net Cash Flow",
      amount: "14000.00",
      cashFlowType: "inflow",
      stats: "+12% over prev hour",
      currency: "USD",
    },
    {
      id: 5,
      title: "AI Forecast Accuracy",
      confidenceScore: "85",
    },
    {
      id: 6,
      title: "Current Cash InFlow",
      amount: "4500.00",
      cashFlowType: "inflow",
      stats: "+7% over prev hour",
      currency: "USD",
    },
    {
      id: 7,
      title: "Current Cash OutFlow",
      amount: "6200.00",
      cashFlowType: "outflow",
      stats: "+4% over prev hour",
      currency: "USD",
    },
  ];

  //hourly dummy data
  const apiHourlyData = [
    {
      timestamp: "2024-02-25 00:00",
      title: "Current Cash InFlow",
      amount: 1000.5,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 00:00",
      title: "Current Cash OutFlow",
      amount: 800.75,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 03:00",
      title: "Current Cash InFlow",
      amount: 1200.0,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 03:00",
      title: "Current Cash OutFlow",
      amount: 950.3,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 06:00",
      title: "Current Cash InFlow",
      amount: 1500.2,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 06:00",
      title: "Current Cash OutFlow",
      amount: 1300.6,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 09:00",
      title: "Current Cash InFlow",
      amount: 1700.4,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 09:00",
      title: "Current Cash OutFlow",
      amount: 1450.8,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 12:00",
      title: "Current Cash InFlow",
      amount: 1900.6,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 12:00",
      title: "Current Cash OutFlow",
      amount: 1600.5,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 23:10",
      title: "Current Cash InFlow",
      amount: 2100.3,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 15:00",
      title: "Current Cash OutFlow",
      amount: 1750.9,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 00:00",
      title: "Current Cash InFlow",
      amount: 1000.5,
    },
    {
      timestamp: "2024-02-25 21:30",
      title: "Current Cash OutFlow",
      amount: 500.25,
    },
    {
      timestamp: "2024-02-25 03:00",
      title: "Current Cash InFlow",
      amount: 1200.0,
    },
    {
      timestamp: "2024-02-25 06:45",
      title: "Current Cash OutFlow",
      amount: 980.3,
    },
    {
      timestamp: "2024-02-25 14:00",
      title: "Current Cash OutFlow",
      amount: 1750.9,
    },
  ];
  //monthly dummy data
  const apiMonthlyData = [
    {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      series: [
        {
          name: "Debt",
          type: "column",
          data: [30000, 35000, 32000, 40000, 45000, 37000, 50000, 34000, 31000],
        },
        {
          name: "Equity",
          type: "column",
          data: [25000, 30000, 27000, 26000, 28000, 29000, 27000, 30000, 40000],
        },
      ],
    },
  ];
  const apiIncomingTxnData = [
    {
      id: "MSG123",
      amount: "$14,000",
      payer: "ABC Corp",
      status: "Pending",
      date: "05/03/2024",
    },
    {
      id: "MSG124",
      amount: "$15,000",
      payer: "ABC Corp",
      status: "Completed",
      date: "05/03/2024",
    },
  ];
  const apiPendingPaymentData = [
    {
      id: "MSG123",
      amount: "$14,000",
      payer: "ABC Corp",
      status: "Pending",
      date: "06/03/2024",
    },
    {
      id: "MSG124",
      amount: "$15,000",
      payer: "ABC Corp",
      status: "Completed",
      date: "06/03/2024",
    },
  ];

  //should also have data for cash inflow and outflow for each hour of the day
  const cardData = apiDummyData.filter((item) =>
    [
      "Opening Balance",
      "Projected Cash Inflow",
      "Projected Cash Outflow",
      "Projected Net Cash Flow",
      "AI Forecast Accuracy",
    ].includes(item.title)
  );

  const cashFlowData = apiDummyData.filter((item) =>
    ["Current Cash InFlow", "Current Cash OutFlow"].includes(item.title)
  );
  const cashInFlowData = apiDummyData.filter((item) =>
    ["Current Cash InFlow", "Projected Cash Inflow"].includes(item.title)
  );
  const cashOutFlowData = apiDummyData.filter((item) =>
    ["Current Cash OutFlow", "Projected Cash Outflow"].includes(item.title)
  );

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
    localStorage.setItem("selectedTimezone", value); // Save to localStorage
  };

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(selectedTimezone));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedTimezone]);

  return loading ? (
    <DashBoardSkeleton />
  ) : (
    <Layout style={{ padding: "10px", maxWidth: "100%", margin: "0 auto" }}>
      {/* should add header and sidenav when integrated with main micro frontend component */}
      <Row
        justify="space-between"
        align="stretch"
        style={{ height: "2vh", padding: "0 10px 10px", marginBottom: "2%" }}
      >
        <Typography.Title>
          <h5>AI insights:</h5>
          <p>{}</p>
        </Typography.Title>
        <div>
          <Typography.Title level={2} type="success">
            {currentTime.format("HH:mm:ss")}
          </Typography.Title>
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Select a Timezone"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            filterOption={(input, option) =>
              option?.value.toLowerCase().includes(input.toLowerCase())
            }
          >
            {timezones.map((zone) => (
              <Option key={zone} value={zone}>
                {zone}
              </Option>
            ))}
          </Select>
        </div>
      </Row>
      {/* ROW 1 - Cards (5 Cards, Each in 5 Columns) */}
      <Row
        gutter={[16, 16]}
        justify="center"
        style={{ height: "25vh", width: "100%" }}
      >
        <CardsContainer cardData={cardData} />
      </Row>
      {/* Row 2 - Charts (30% height) */}
      <Row justify="space-evenly" align="top" style={{ height: "30vh" }}>
        <Col span={8} style={{ height: "100%" }}>
          <Card
            style={{
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Ensures content is vertically aligned
              height: "100%",
            }}
          >
            <p
              style={{
                textAlign: "center",
                padding: 0,
                margin: 0,
              }}
            >
              Net Balance
            </p>
            <div
              style={{ display: "flex", flexDirection: "row", height: "100%" }}
            >
              <AreaChartContainer data={apiHourlyData} />
            </div>
          </Card>
        </Col>
        <Col span={8} style={{ height: "100%" }}>
          <Card
            style={{
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Ensures content is vertically aligned
              height: "100%",
            }}
          >
            <Tabs defaultActiveKey="1" centered>
              <Tabs.TabPane tab="Incoming Transactions" key="1">
                <CashFlowTable data={apiIncomingTxnData} type="payments" />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Pending Payments" key="2">
                <CashFlowTable data={apiPendingPaymentData} type="payments" />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={8} style={{ height: "100%" }}>
          <Card
            style={{
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Ensures content is vertically aligned
              height: "100%",
            }}
          >
            <p style={{ textAlign: "center", padding: 0, margin: 0 }}>
              Cash OutFlows
            </p>
            <SunburstChart data={cashFlowData} />
          </Card>
        </Col>
      </Row>
      {/* Row 3 - Charts (30% height) */}
      <Row style={{ height: "30vh" }}>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <BarWithLineChartContainer data={apiMonthlyData[0]} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}></Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}></Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default App;
