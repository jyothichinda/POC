import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Layout,
  Modal,
  InputNumber,
  Button,
  message,
  Spin,
  Menu,
} from "antd";
import ActualDataTable from "./components/ActualDataTable";
import CardsContainer from "./components/Cards";
import SideNav from "./components/SideNav";
import "./index.css";

const { Sider, Content } = Layout;

const App = () => {
  const [data, setData] = useState([]);
  const [projectedData, setProjectedData] = useState({});
  const [levels, setLevels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [openingBalance, setOpeningBalance] = useState(0); // User-provided opening balance
  const [selectedLevel, setSelectedLevel] = useState(null); // Track the selected level
  const [loading, setLoading] = useState(true); // Loader state

  const handleLevelClick = async (level, parentLevel) => {
    try {
      console.log("Clicked Level:", level);
      console.log("Levels Array:", levels);

      // Find the selected level
      const selected = levels.find(
        (item) => item.value.trim().toLowerCase() === level.trim().toLowerCase()
      );
      console.log("Selected Level:", selected);

      if (selected && Number(selected.opening_Balance) === 0) {
        setSelectedLevel(selected); // Track the selected level
        setIsModalVisible(true); // Show the modal
      } else {
        // Fetch data for the selected level
        const res = await axios.get(
          `http://192.168.1.2:9898/api/filter_data?level=${encodeURIComponent(
            level
          )}&parentLevel=${encodeURIComponent(parentLevel)}`
        );
        setData(res.data || []);
      }
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

  async function fetchLevels() {
    try {
      const res = await axios.get("http://192.168.1.2:9898/relation");
      const levels = res.data.map((item) => ({
        value: item.level.trim(), // Trim spaces to avoid mismatches
        label: item.level.trim(),
        parentLevel: item.parent_Level,
        opening_Balance: item.opening_Balance,
        id: item.id,
      }));

      // Remove duplicates
      const uniqueLevels = levels.filter(
        (level, index, self) =>
          index === self.findIndex((l) => l.value === level.value)
      );

      console.log("Unique Levels:", uniqueLevels); // Debugging log
      setLevels(uniqueLevels);
    } catch (error) {
      console.error("Error fetching levels:", error);
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

  const handleSubmitOpeningBalance = async () => {
    try {
      // Update the opening_Balance in the levels state
      const updatedLevels = levels.map((level) =>
        level.value === selectedLevel.value
          ? { ...level, opening_Balance: openingBalance }
          : level
      );

      // Send the updated levels to the backend
      await axios.put("http://192.168.1.2:9898/updateConfig", updatedLevels);

      message.success("Opening balance submitted successfully!");

      // Update the levels state and fetch actual data
      setLevels(updatedLevels);
      fetchData(); // Fetch actual data after submission
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error submitting opening balance:", error);
      message.error("Failed to submit opening balance.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Show loader before fetching data
      await Promise.all([fetchProjectedData(), fetchData(), fetchLevels()]);
      setLoading(false); // Hide loader after all data is fetched
    };

    fetchAllData();

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Modal for Opening Balance */}
      <Modal
        title={`Set Opening Balance for ${selectedLevel?.value || "Level"}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={false} // Prevent closing the modal without setting the balance
      >
        <InputNumber
          placeholder="Enter Opening Balance"
          value={openingBalance}
          onChange={(value) => setOpeningBalance(value)}
          style={{ marginBottom: "16px", width: "100%" }}
          min={0} // Prevent negative values
        />
        <Button
          type="primary"
          onClick={handleSubmitOpeningBalance}
          block
          disabled={openingBalance === null || openingBalance === ""}
        >
          Submit Opening Balance
        </Button>
      </Modal>

      {/* Side Navigation */}
      <Sider>
        <SideNav levels={levels} onLevelClick={handleLevelClick} />
        <Menu
          onClick={({ key }) => handleLevelClick(key, null)}
          items={levels.map((level) => ({
            key: level.value,
            label: level.label,
          }))}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: "16px" }}>
          <Row gutter={[16, 16]}>
            <CardsContainer
              data={data}
              projectedData={projectedData}
              levels={levels}
            />
            <ActualDataTable data={data} />
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
