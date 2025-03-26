import React, { useState } from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const SideNav = ({ levels, onLevelClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to build the menu hierarchy
  const buildMenuHierarchy = (levels) => {
    const levelMap = {};
    const rootItems = [];

    // Create a map of levels
    levels.forEach((item) => {
      levelMap[item.value] = { ...item, children: [] };
    });

    // Build the hierarchy
    levels.forEach((item) => {
      if (item.parentLevel === "Root Level") {
        rootItems.push(levelMap[item.value]);
      } else if (levelMap[item.parentLevel]) {
        levelMap[item.parentLevel].children.push(levelMap[item.value]);
      }
    });

    return rootItems;
  };

  // Render menu items recursively
  const renderMenuItems = (items) =>
    items.map((item) => {
      if (item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.value} title={item.label}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.value}
          onClick={() => onLevelClick(item.value, item.parentLevel)}
        >
          {item.label}
        </Menu.Item>
      );
    });

  const menuHierarchy = buildMenuHierarchy(levels);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      style={{
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        background: "transparent",
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{
          height: "100%",
          borderRight: 0,
          background: "transparent",
        }}
      >
        {renderMenuItems(menuHierarchy)}
      </Menu>
    </Sider>
  );
};

export default SideNav;
