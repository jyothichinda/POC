import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Card,
  Form,
  message,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
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
import dayjs from "dayjs";
import axios from "axios";

const allColumns = [
  { title: "Pool Name", dataIndex: "pool_name", key: "pool_name" },
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
    title: "Participating Accounts",
    dataIndex: "participating_accounts",
    key: "participating_accounts",
    render: (accounts) => accounts?.join(", ") || "--",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => text || "--",
  },
  {
    title: "Next Execution",
    dataIndex: "next_execution",
    key: "next_execution",
    render: (text) => text || "--",
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (text) => text || "--",
  },
  {
    title: "Liquidity Threshold",
    dataIndex: "liquidity_threshold",
    key: "liquidity_threshold",
    render: (text) => text || "--",
  },
  {
    title: "Last Pool Update",
    dataIndex: "update",
    key: "update",
    render: (text) => text || "--",
  },
  {
    title: "Interest Rate(%)",
    dataIndex: "interest",
    key: "interest",
    render: (text) => text || "--",
  },
  {
    title: "Auto-Rebalancing",
    dataIndex: "auto_rebalancing",
    key: "auto_rebalancing",
    render: (text) => text || "--",
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

const PoolingTable = ({ data }) => {
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
        "http://10.10.0.11:9898/save/pooling",
        values
      );
      console.log(response);
      message.success("Pool saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      // Refresh data after successful creation to refresh table
      fetchData();
    } catch (error) {
      message.error("Failed to save pool!");
    }
  };

  // Function to reset form to default values
  const resetConfigToDefault = () => {
    form.setFieldsValue({
      pool_name: "",
      master_account: "",
      currency: "",
      participating_accounts: [],
      status: "",
      balance: "",
      liquidity_threshold: "",
      interest: "",
      auto_rebalancing: "",
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
          icon={<SettingOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
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
        title="Create Pool"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null} // Footer removed since it's inside the form now
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Pool Name"
            name="pool_name"
            rules={[{ required: true, message: "Please enter pool name" }]}
          >
            <Input placeholder="Enter pool name" />
          </Form.Item>
          <Form.Item
            label="Master Account"
            name="master_account"
            rules={[{ required: true, message: "Please enter Master Account" }]}
          >
            <Input placeholder="Enter master account" />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please enter Currency" }]}
          >
            <Input placeholder="Enter currency" />
          </Form.Item>
          <Form.Item
            label="Participating Accounts"
            name="participating_accounts"
            rules={[
              {
                required: true,
                message: "Please enter Participating Accounts",
              },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Enter multiple accounts"
              tokenSeparators={[","]} // Pressing comma adds a new value
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select a Status",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "InActive" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Next Execution"
            name="next_execution"
            rules={[
              { required: true, message: "Please enter Next Execution Date" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            label="Threshold"
            name="liquidity_threshold"
            rules={[{ required: true, message: "Please enter Threshold" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Liquidity Threshold"
            />
          </Form.Item>
          <Form.Item
            label="Interest"
            name="interest"
            rules={[{ required: true, message: "Please enter Interest Rate" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Interest %"
            />
          </Form.Item>
          <Form.Item
            label="Auto Rebalancing"
            name="auto_rebalancing"
            rules={[
              { required: true, message: "Please Select for Auto Rebalance" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={resetConfigToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Pooling Table */}
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

export default PoolingTable;
