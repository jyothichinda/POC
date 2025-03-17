import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Button, Card, Select, message } from "antd";

import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  EditOutlined
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
  { title: "Sweep Name", dataIndex: "sweep_name", key: "sweep_name" },
  {
    title: "Master Account",
    dataIndex: "master_account",
    key: "master_account",
    render: (text) => text || "--",
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
    render: (text) => text || "--",
  },
  {
    title: "Sweep Direction",
    dataIndex: "sweep_direction",
    key: "sweep_direction",
    render: (text) => text || "--",
  },
  {
    title: "Frequency",
    dataIndex: "frequency",
    key: "frequency",
    render: (text) => text || "--",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => text || "N/A",
  },
  {
    title: "Next Execution",
    dataIndex: "next_execution",
    key: "next_execution",
    render: (text) => text || "--",
  },
  {
    title: "Threshold Limit",
    dataIndex: "threshold_limit",
    key: "threshold_limit",
    render: (text) => text || "--",
  },
  {
    title: "Last Sweep Date",
    dataIndex: "last_sweep_date" || "N/A",
    key: "last_sweep_date",
    render: (text) => text || "--",
  },
  {
    title: "Auto-Transfer Enabled",
    dataIndex: "auto_transfer_enabled" || "--",
    key: "auto_transfer_enabled",
    render: (text) => text || "--",
  },
  { title: "Action", dataIndex: "action", key: "action" },
];

// Sortable item component
const SortableItem = ({ column, isChecked, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ _id: column.key });

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

const SweepingTable = ({ data, fetchSweepingData }) => {
  // Load preferences from local storage
  const savedColumns =
    JSON.parse(localStorage.getItem("selectedColumns")) ||
    allColumns.map((col) => col.key);
  const savedOrder =
    JSON.parse(localStorage.getItem("columnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [customizeModalVisible, setCustomizeModalVisible] = useState(false);


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

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "",
        values
      );
      message.success("Sweeping saved successfully!");
      setModalVisible(false);
      form.resetFields();
      // Refresh data after successful creation to refresh table
      fetchData();
    } catch (error) {
      message.error("Failed to save sweeeping!");
    }
  };

  const resetSweepToDefault = () => {
    form.setFieldsValue({
      sweepName: "",
      masterName:"",
      currency:"",
      sweepDirection:"",
      frequency:"",
      status: "",
      nextExecution:"",
      autoTransferEnabled:""
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
          onClick={() => setModalVisible(true)}
        >
          Create
        </Button>

        <Modal
        title="Sweeping Form"
        open={modalVisible} // 'open' replaces 'visible' in Antd v4+
        onCancel={() => setModalVisible(false)}
        footer={null} // Remove default footer buttons
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Sweep Name" name="sweepName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Master Account" name="masterName" rules={[{ required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Currency" name="currency" rules={[{ required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Sweep Direction" name="sweepDirection" rules={[{ required: true}]}>
            <Select placeholder = "Select Direction">
              <Select.Option value="onewaydirection">One-Way Direction</Select.Option>
              <Select.Option value="biwaydirection">Bi-Direction</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Frequency" name="frequency" rules={[{ required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true}]}>
            <Select placeholder = "Select Status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Next Execution" name="nextExectution" rules={[{ required: true, type: "date"}]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="Auto-Transfer Enabled" name="autoTransferEnabled" rules={[{ required: true}]}>
            <Select placeholder="Select option">
              <Select.Option value="yes">Yes</Select.Option>
              <Select.Option value="no">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={resetSweepToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
        <Button
          style={{ marginLeft: "10px", padding: "10px" }}
          icon={<SettingOutlined />}
          type="primary"
          onClick={() => setCustomizeModalVisible(true)}
        >
          Customize
        </Button>
      </div>

      {/* Customization Modal */}
      <Modal
        title="Customize Columns"
        open={customizeModalVisible}
        onCancel={() => setCustomizeModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>
            Reset to Default
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setCustomizeModalVisible(false)}
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

      {/* Sweeping Table */}
      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({
          ...record,
          key: record._id || index, // Ensure key is unique
        }))}
        rowKey="key" // Explicitly tell AntD which field is the unique key
      />
    </div>
  );
};

export default SweepingTable;
