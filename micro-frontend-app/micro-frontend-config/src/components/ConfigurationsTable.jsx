import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const allColumns = [
  { title: "Control Name", dataIndex: "controlName", key: "controlName" },
  { title: "Status", dataIndex: "status", key: "status" },
  {
    title: "Last Updated By",
    dataIndex: "lastUpdatedBy",
    key: "lastUpdatedBy",
  },
  {
    title: "Last Updated Time",
    dataIndex: "lastUpdatedTime",
    key: "lastUpdatedTime",
  },
  { title: "Action", dataIndex: "action", key: "action" },
];

// Sortable item component
const SortableItem = ({ column, isChecked, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 10,
    marginBottom: 8,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isChecked ? "#e6f7ff" : "#f0f0f0",
    borderRadius: 5,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Toggle between Plus and Minus Icons */}
        {isChecked ? (
          <MinusSquareOutlined
            style={{ color: "red", fontSize: 18, cursor: "pointer" }}
            onClick={() => onToggle(column.key)}
          />
        ) : (
          <PlusSquareOutlined
            style={{ color: "green", fontSize: 18, cursor: "pointer" }}
            onClick={() => onToggle(column.key)}
          />
        )}
        <span>{column.title}</span>
      </div>
    </Card>
  );
};

const ConfigurationsTable = ({ data, fetchData }) => {
  // Load preferences from local storage
  const savedColumns =
    JSON.parse(localStorage.getItem("selectedColumns")) ||
    allColumns.map((col) => col.key);
  const savedOrder =
    JSON.parse(localStorage.getItem("columnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  // Toggle column visibility
  const handleColumnToggle = (key) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedColumns = prevSelectedColumns.includes(key)
        ? prevSelectedColumns.filter((colKey) => colKey !== key) // Remove column when unchecked
        : [...prevSelectedColumns, key]; // Add column when checked

      console.log("Updated Columns:", updatedColumns); // Debugging log
      return updatedColumns;
    });
  };

  // Reset to default
  const resetToDefault = () => {
    setSelectedColumns(allColumns.map((col) => col.key));
    setColumnsOrder(allColumns);
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Handle column reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columnsOrder.findIndex((col) => col.key === active.id);
      const newIndex = columnsOrder.findIndex((col) => col.key === over.id);
      setColumnsOrder(arrayMove(columnsOrder, oldIndex, newIndex));
    }
  };

  // Filter visible columns
  const filteredColumns = columnsOrder.filter((col) =>
    selectedColumns.includes(col.key)
  );

  const [form] = Form.useForm();

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://10.10.0.11:9898/save/masterThrottle_configuration",
        values
      );
      message.success("Configuration saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      // Refresh data after successful creation to refresh table
      fetchData();
    } catch (error) {
      message.error("Failed to save configuration!");
    }
  };

  // Function to reset form to default values
  const resetConfigToDefault = () => {
    form.setFieldsValue({
      controlName: "",
      status: "System",
      lastUpdatedBy: "",
      action: "Audit",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Settings Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => setCreateModalVisible(true)}
        >
          Create
        </Button>
        <Button
          style={{ marginLeft: "10px", padding: "10px" }}
          icon={<SettingOutlined />}
          type="primary"
          onClick={() => setModalVisible(true)}
        >
          Customize
        </Button>
      </div>

      {/* Customization Modal */}
      <Modal
        title="Customize Columns"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>
            Reset to Default
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            Done
          </Button>,
        ]}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnsOrder.map((col) => col.key)}
            strategy={verticalListSortingStrategy}
          >
            {columnsOrder.map((column) => (
              <SortableItem
                key={column.key}
                column={column}
                isChecked={selectedColumns.includes(column.key)}
                onToggle={handleColumnToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      <Modal
        title="Create Configuration"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null} // Footer removed since it's inside the form now
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "System",
            lastUpdatedTime: new Date().toISOString(),
            action: "Audit",
          }}
        >
          <Form.Item
            label="Control Name"
            name="controlName"
            rules={[{ required: true, message: "Please enter control name" }]}
          >
            <Input placeholder="Enter control name" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="User"
            name="lastUpdatedBy"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item>
            <Button onClick={resetConfigToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Done
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Transactions Table */}
      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({
          ...record,
          key: record.id || index, // Ensure key is unique
        }))}
        rowKey="key" // Explicitly tell AntD which field is the unique key
      />
    </div>
  );
};

export default ConfigurationsTable;
