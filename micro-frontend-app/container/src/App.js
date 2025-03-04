import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import { DashboardOutlined, TransactionOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const DashboardApp = lazy(() => import("./components/DashboardApp"));
const TransactionsApp = lazy(() => import("./components/TransactionsApp"));

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
            <Menu.Item key="2" icon={<TransactionOutlined />}>
              <Link to="/reserves">Cash Reserves</Link>
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
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
