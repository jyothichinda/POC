import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Select, Typography, Card, Tabs } from "antd";
import moment from "moment-timezone";

import DashBoardSkeleton from "./components/DashboardSkeleton";
import CardsContainer from "./components/Cards";
import AreaChartContainer from "./components/AreaChart";
import BarWithLineChartContainer from "./components/BarWithLineChart";
import SunburstChart from "./components/SunburstChart";
import CashFlowTable from "./components/Table";
import GuageChart from "./components/GuageChart";
import DonutChart from "./components/DonutChart";
import axios from "axios";
import "./index.css";

const { Option } = Select;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [projectedData, setProjectedData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState({
    name: "Daily Expenses",
    children: [
      {
        name: "Fixed Costs",
        children: [
          { name: "Salaries", value: 30 },
          { name: "Rent", value: 25 },
        ],
      },
      {
        name: "Variable Costs",
        children: [
          { name: "Inventory", value: 20 },
          { name: "Marketing", value: 15 },
          { name: "Utilities", value: 10 },
        ],
      },
    ],
  });

  const [txnData, setTxnData] = useState([]);

  const [selectedTimezone, setSelectedTimezone] = useState(
    localStorage.getItem("selectedTimezone") || "UTC"
  );
  const [currentTime, setCurrentTime] = useState(moment().tz(selectedTimezone));

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

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
    localStorage.setItem("selectedTimezone", value);
  };

  const fetchProjectedData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const res = await axios.get(
        `http://192.168.1.2:9898/projected_data?date=${today}`
      );

      const roundToTwo = (value) => Number(value).toFixed(2);

      // Convert the response into an array format
      const formattedData = Object.entries(res.data.projectedData).map(
        ([key, value]) => ({
          id: key, // Use the key as a unique identifier
          title: formatTitle(key), // Format the key into a readable title
          amount: roundToTwo(value), // Round the value to two decimal places
          currency: "USD", // Add a default currency
        })
      );
      setProjectedData(formattedData);
    } catch (error) {
      console.error("Error fetching projected data:", error);
    }
  };

  const fetchTxnData = async () => {
    try {
      const res = await axios.get(
        "http://192.168.1.2:9999/api/getAll_payments"
      );
      setTxnData(res.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchHourlyData = async () => {
    try {
      const res = await axios.get(
        "http://192.168.1.2:9999/api/get_hourly_payments"
      );
      setHourlyData(res.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const res = await axios.get(
        "http://192.168.1.2:9999/api/get_weekly_payments"
      );
      setWeeklyData(res.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Helper function to format keys into readable titles
  const formatTitle = (key) => {
    const titleMap = {
      projectedOpeningBalance: "Projected Opening Balance",
      projectedCashInflow: "Projected Cash Inflow",
      projectedCashOutflow: "Projected Cash Outflow",
      projectedNetCashFlow: "Projected Net Cash Flow",
      projectedClosingBalance: "Projected Closing Balance",
    };

    return titleMap[key] || key; // Fallback to the key if no mapping is found
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 2000);

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(selectedTimezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  useEffect(() => {
    fetchProjectedData();
    fetchTxnData();
    fetchHourlyData();
    fetchWeeklyData();
  }, []);

  if (loading) return <DashBoardSkeleton />;

  return (
    <Layout style={{ padding: "10px", maxWidth: "100%", margin: "0 auto" }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "2%" }}
      >
        <Typography.Title level={5}>AI Insights</Typography.Title>
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
            {moment.tz.names().map((zone) => (
              <Option key={zone} value={zone}>
                {zone}
              </Option>
            ))}
          </Select>
        </div>
      </Row>

      {/* Cards */}
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "2%" }}>
        <CardsContainer cardData={projectedData} />
      </Row>

      {/* Charts Row 1 */}
      <Row
        gutter={[16, 16]}
        justify="space-evenly"
        style={{ marginBottom: "2%" }}
      >
        <Col span={8}>
          <Card title="Net Balance" style={{ height: "100%" }}>
            <AreaChartContainer data={hourlyData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <Tabs
              defaultActiveKey="1"
              centered
              items={[
                {
                  key: "1",
                  label: "Transactions",
                  children: <CashFlowTable data={txnData} type="payments" />,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cash Outflows" style={{ height: "100%" }}>
            <SunburstChart data={dailyExpenses} />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <BarWithLineChartContainer data={weeklyData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <DonutChart data={apiMonthlyData[0]} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <GuageChart data={apiMonthlyData[0]} />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default App;
