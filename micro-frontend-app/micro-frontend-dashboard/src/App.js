import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Select, Typography, Card } from "antd";
import moment from "moment-timezone";

import DashBoardSkeleton from "./components/DashboardSkeleton";
import CardsContainer from "./components/Cards";
import RadialPieChartContainer from "./components/RadialPieChart";
import AreaChartContainer from "./components/AreaChart";
import BarChartContainer from "./components/BarChart";
import "./index.css";

const { Option } = Select;

const App = () => {
  const [loading, setLoading] = useState(true);
  const timezones = moment.tz.names(); // Get all timezones
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [currentTime, setCurrentTime] = useState(moment().tz(selectedTimezone));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }); //replace with api call and pass props into card component

  //dummy data
  const apiDummyData = [
    {
      id: 1,
      title: "Opening Balance",
      amount: "50000.00",
      stats: "+5% over prev hour",
      currency: "USD",
    },
    {
      id: 2,
      title: "Projected Cash Inflow",
      amount: "32000.00",
      stats: "+8% over prev hour",
      currency: "USD",
    },
    {
      id: 3,
      title: "Projected Cash Outflow",
      amount: "18000.00",
      stats: "+6% over prev hour",
      currency: "USD",
    },
    {
      id: 4,
      title: "Current Cash Reserve",
      amount: "64000.00",
      stats: "+3% over prev hour",
      currency: "USD",
    },
    {
      id: 5,
      title: "Net Cash Flow",
      amount: "14000.00",
      stats: "+12% over prev hour",
      currency: "USD",
    },
    {
      id: 6,
      title: "Current Cash InFlow",
      amount: "4500.00",
      stats: "+7% over prev hour",
      currency: "USD",
    },
    {
      id: 7,
      title: "Current Cash OutFlow",
      amount: "6200.00",
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

  //should also have data for cash inflow and outflow for each hour of the day
  const cardData = apiDummyData.filter((item) =>
    [
      "Opening Balance",
      "Projected Cash Inflow",
      "Projected Cash Outflow",
      "Current Cash Reserve",
      "Net Cash Flow",
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
        justify="end"
        align="stretch"
        style={{ height: "2vh", padding: "0 10px 10px", marginBottom: "2%" }}
      >
        <Typography.Title level={2} type="success">
          {currentTime.format("HH:mm:ss")}
        </Typography.Title>
        <Select
          showSearch
          style={{ width: 150 }}
          placeholder="Select a Timezone"
          value={selectedTimezone}
          onChange={setSelectedTimezone}
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
      </Row>
      {/* ROW 1 - Cards (5 Cards, Each in 5 Columns) */}
      <Row
        justify="space-evenly"
        align="top"
        style={{ height: "25vh", width: "100%" }}
      >
        <CardsContainer cardData={cardData} />
      </Row>
      {/* Row 2 - Charts (30% height) */}
      <Row justify="space-evenly" align="top" style={{ height: "30vh" }}>
        <Col span={10} style={{ height: "100%" }}>
          <Card
            style={{
              padding: 0,
              margin: 0,
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
            <RadialPieChartContainer data={cashFlowData} />
            <AreaChartContainer data={apiHourlyData} />
          </Card>
        </Col>
        <Col span={7} style={{ height: "100%" }}>
          <Card style={{ padding: 0, margin: 0 }}>
            <p style={{ textAlign: "center", padding: 0, margin: 0 }}>
              Cash InFlows
            </p>

            <RadialPieChartContainer data={cashInFlowData} />
            <BarChartContainer data={cashInFlowData} />
          </Card>
        </Col>
        <Col span={7} style={{ height: "100%" }}>
          <Card style={{ padding: 0, margin: 0 }}>
            <p style={{ textAlign: "center", padding: 0, margin: 0 }}>
              Cash OutFlows
            </p>
            <RadialPieChartContainer data={cashOutFlowData} />
            <BarChartContainer data={cashOutFlowData} />
          </Card>
        </Col>
      </Row>
      {/* Row 3 - Charts (30% height) */}
      {/* <Row style={{ height: "30vh" }}>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <RadialPieChartContainer data={cashFlowData} />
            <AreaChartContainer data={cashFlowData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <RadialPieChartContainer data={cashInFlowData} />
            <BarChartContainer data={cashInFlowData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <RadialPieChartContainer data={cashOutFlowData} />
            <BarChartContainer data={cashOutFlowData} />
          </Card>
        </Col>
      </Row> */}
    </Layout>
  );
};

export default App;
