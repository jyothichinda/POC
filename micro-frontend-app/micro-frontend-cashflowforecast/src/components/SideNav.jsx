import React, { useState } from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const SideNav = ({ levels }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to build the menu hierarchy
  const buildMenuHierarchy = (levels) => {
    const levelMap = {};
    const rootItems = [];

    // Create a map of levels
    levels.forEach((item) => {
      levelMap[item.level] = { ...item, children: [] };
    });

    // Build the hierarchy
    levels.forEach((item) => {
      if (item.parentLevel === "Root") {
        rootItems.push(levelMap[item.level]);
      } else if (levelMap[item.parentLevel]) {
        levelMap[item.parentLevel].children.push(levelMap[item.level]);
      }
    });

    return rootItems;
  };

  // Render menu items recursively
  const renderMenuItems = (items) =>
    items.map((item) => {
      if (item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.level} title={item.level}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.level}
          onClick={() => onLevelClick(item.level, item.parentLevel)}
        >
          {item.level}
        </Menu.Item>
      );
    });

  const menuHierarchy = buildMenuHierarchy(levels);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        borderRight: "1px solid #f0f0f0", // Add a subtle border
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Add a shadow for better separation
        background: "transparent", // Remove default background color
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{
          height: "100%",
          borderRight: 0,
          background: "transparent", // Remove background color for the menu
        }}
      >
        {renderMenuItems(menuHierarchy)}
      </Menu>
    </Sider>
  );
};

export default SideNav;
