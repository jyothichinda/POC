import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Layout } from "antd";
import ActualDataTable from "./components/ActualDataTable";
import CardsContainer from "./components/Cards";
import SideNav from "./components/SideNav";
import "./index.css";

const { Sider, Content } = Layout;

const App = () => {
  const [data, setData] = useState([]);
  const [projectedData, setProjectedData] = useState({});
  const [levels, setLevels] = useState([]);

  const handleLevelClick = async (level, parentLevel) => {
    try {
      console.log(
        `Fetching data for Level: ${level}, Parent Level: ${parentLevel}`
      );
      const res = await axios.get(
        `http://192.168.1.2:9898/api/filter_data?level=${encodeURIComponent(
          level
        )}&parentLevel=${encodeURIComponent(parentLevel)}`
      );
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  async function fetchProjectedData() {
    try {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const res = await axios.get(
        `http://192.168.1.2:9898/projected_data?date=${today}`
      );

      const roundToTwo = (value) => Number(value).toFixed(2);

      const formattedData = {
        projectedCashInflow: roundToTwo(
          res.data.projectedData.projectedCashInflow
        ),
        projectedCashOutflow: roundToTwo(
          res.data.projectedData.projectedCashOutflow
        ),
        projectedClosingBalance: roundToTwo(
          res.data.projectedData.projectedClosingBalance
        ),
        projectedNetCashFlow: roundToTwo(
          res.data.projectedData.projectedNetCashFlow
        ),
        projectedOpeningBalance: roundToTwo(
          res.data.projectedData.projectedOpeningBalance
        ),
      };

      setProjectedData(formattedData);
    } catch (error) {
      console.error("Error fetching projected data:", error);
    }
  }
  async function fetchData() {
    try {
      const res = await axios.get(
        "http://192.168.1.2:9999/api/Current_date_transactions"
      );
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchLevels() {
    try {
      const res = await axios.get("http://192.168.1.2:9898/relation");

      // Map the response to match the dropdown and menu format
      const levels = res.data.map((item) => ({
        value: item.level, // Use `level` as the value
        label: item.level, // Use `level` as the label for dropdown
        parentLevel: item.parent_Level, // Include `parent_Level` for hierarchy
      }));

      setLevels(levels); // Set levels for SideNav
      console.log("Levels fetched and mapped:", levels);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  }

  useEffect(() => {
    fetchProjectedData(); // Call async function
    fetchData();
    fetchLevels(); // Fetch levels for SideNav

    const eventSource = new EventSource(
      "http://10.10.0.11:9898/flow_chart/sse"
    );

    eventSource.onopen = () => {
      console.log("SSE Connection Opened");
    };

    // Default unnamed events
    eventSource.onmessage = (event) => {
      console.log("onmessage triggered:", event);
    };

    // Handle 'heartbeat' event
    eventSource.addEventListener("heartbeat", (event) => {
      console.log("Heartbeat received:", event);
    });

    // Handle 'transaction-update' event
    eventSource.addEventListener("transaction-update", (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("Payment Update Received:", newData);
        setData((prevData) => {
          // Ensure uniqueness based on `id`
          const updatedData = [...prevData]; // Clone previous data array
          newData.forEach((newItem) => {
            const existingIndex = updatedData.findIndex(
              (item) => item.id === newItem.id
            );

            if (existingIndex !== -1) {
              // Update existing record
              updatedData[existingIndex] = newItem;
            } else {
              // Add new record
              updatedData.push(newItem);
            }
          });
          return updatedData;
        });
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      console.log("Cleaning up SSE...");
      eventSource.close();
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Side Navigation */}
      <Sider>
        <SideNav levels={levels} onLevelClick={handleLevelClick} />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: "16px" }}>
          <Row gutter={[16, 16]}>
            <CardsContainer data={data} projectedData={projectedData} />
            <ActualDataTable data={data} />
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
