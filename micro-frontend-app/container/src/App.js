import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import { DashboardOutlined, TransactionOutlined } from "@ant-design/icons";
import { FaHandHoldingUsd } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { GrDocumentConfig } from "react-icons/gr";
import { VscCombine } from "react-icons/vsc";
import { GiRadarSweep } from "react-icons/gi";

const { Header, Sider, Content } = Layout;

const DashboardApp = lazy(() => import("./components/DashboardApp"));
const TransactionsApp = lazy(() => import("./components/TransactionsApp"));
const CashFlowForecastApp = lazy(() =>
  import("./components/CashFlowForecastApp")
);
const CashReservesApp = lazy(() => import("./components/CashReservesApp"));
const ConfigurationsApp = lazy(() => import("./components/ConfigurationsApp"));
const PoolingApp = lazy(() => import("./components/PoolingApp"));
const SweepingApp = lazy(() => import("./components/SweepingApp"));

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: "2", icon: <TransactionOutlined />, label: <Link to="/transactions">Transactions</Link> },
    { key: "3", icon: <AiOutlineStock />, label: <Link to="/forecast">Cash Flow Forecast</Link> },
    { key: "4", icon: <FaHandHoldingUsd />, label: <Link to="/reserves">Cash Reserves</Link> },
    { key: "5", icon: <GrDocumentConfig />, label: <Link to="/configurations">Configurations</Link> },
    { key: "6", icon: <VscCombine />, label: <Link to="/pooling">Cash Pooling</Link> },
    { key: "7", icon: <GiRadarSweep />, label: <Link to="/sweeping">Cash Sweeping</Link> },
  ];
  

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Side Navigation */}
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div
            className="logo"
            style={{ padding: "16px", color: "white", textAlign: "center" }}
          >
            LQM App
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </Sider>

        <Layout>
          {/* Header */}
          <Header
            style={{ background: "#fff", padding: "0 16px", fontSize: "18px" }}
          >
            <span>LQM App</span>
          </Header>

          {/* Main Content */}
          <Content style={{ margin: "16px" }}>
            <Suspense fallback={<Spin size="large" />}>
              <Routes>
                <Route path="/transactions" element={<TransactionsApp />} />
                <Route path="/" element={<DashboardApp />} />
                <Route path="/pooling" element={<PoolingApp />} />
                <Route path="/configurations" element={<ConfigurationsApp />} />
                <Route path="/reserves" element={<CashReservesApp />} />
                <Route path="/forecast" element={<CashFlowForecastApp />} />
                <Route path="/sweeping" element={<SweepingApp />} />
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
