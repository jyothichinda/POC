import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import { DashboardOutlined, TransactionOutlined } from "@ant-design/icons";
import { FaHandHoldingUsd   } from "react-icons/fa";
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TransactionOutlined />}>
              <Link to="/transactions">Transactions</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<AiOutlineStock  />}>
              <Link to="/forecast">Cash Flow Forecast</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FaHandHoldingUsd />}>
              <Link to="/reserves">Cash Reserves</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<GrDocumentConfig />}>
              <Link to="/configurations">Configurations</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<VscCombine />}>
              <Link to="/pooling">Cash Pooling</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<GiRadarSweep />}>
              <Link to="/sweeping">Cash Sweeping</Link>
            </Menu.Item>
          </Menu>
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
