import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Switch,
} from "antd";
import axios from "axios";
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
import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const allColumns = [
  { title: "Level", dataIndex: "level", key: "level" },
  { title: "Parent Level", dataIndex: "parent_Level", key: "parent_Level" },
  { title: "Control Name", dataIndex: "control_Name", key: "control_Name" },
  { title: "Status", dataIndex: "status", key: "status" },
  {
    title: "Last Updated By",
    dataIndex: "last_Updated_By",
    key: "lastUpdatedBy",
  },
  {
    title: "Last Updated Time",
    dataIndex: "last_Updated_Time",
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
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLevel, setNewLevel] = useState("");
  const [isParentEnabled, setIsParentEnabled] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  useEffect(() => {
    fetchLevels();
  }, []);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.1.2:9898/relation");

      // Adjust mapping based on the actual response format
      const levels = response?.data?.map((item) => ({
        value: item.level, // Use `level` as the value
        label: item.level, // Use `level` as the label for dropdown
      }));

      setOptions(levels || []); // Set dropdown options
    } catch (error) {
      message.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddLevel = () => {
    if (!newLevel) return message.error("Please enter a level name");

    // Add the new level to the dropdown options in the UI
    const updatedOptions = [...options, { value: newLevel, label: newLevel }];
    setOptions(updatedOptions);

    // Set the newly added level as the selected option
    setSelectedLevel(newLevel);
    form.setFieldsValue({ level: newLevel }); // Update the form field to reflect the selected level

    message.success("Level added to the dropdown and selected");
    setIsModalOpen(false); // Close the modal after adding the level
    setNewLevel(""); // Reset the input field
  };

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      // Map form values to match the backend's expected field names
      const data = {
        level: values.level,
        parent_Level: values.parent_Level || "Root Level", // Map to `parent_Level`
        control_Name: values.control_Name, // Map to `control_Name`
        status: values.status,
        last_Updated_By: values.lastUpdatedBy, // Map to `last_Updated_By`
        last_Updated_Time: new Date().toISOString(), // Map to `last_Updated_Time`
      };

      const response = await axios.post(
        "http://192.168.1.2:9898/save/configuration",
        data
      );
      message.success("Configuration saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      setNewLevel(""); // Reset the new level after submission
      fetchData(); // Refresh data after successful creation
    } catch (error) {
      console.error("Error making API call:", error);
      message.error("Failed to save configuration!");
    }
  };

  // Function to reset form to default values
  const resetConfigToDefault = () => {
    form.setFieldsValue({
      control_Name: "",
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
            lastUpdatedTime: new Date().toISOString(), // Add lastUpdatedTime here
            action: "Audit",
          }}
        >
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: "Please enter level name" }]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              loading={loading}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <PlusOutlined style={{ marginRight: 8 }} />
                    Add Level
                  </div>
                </>
              )}
              options={options} // Use the `options` state
              onChange={(value) => setSelectedLevel(value)} // Track the selected level
              value={selectedLevel} // Ensure the selected level is displayed
            />
          </Form.Item>

          <Form.Item label="Assign Parent Level">
            <Switch
              checked={isParentEnabled}
              onChange={(checked) => setIsParentEnabled(checked)}
            />
          </Form.Item>

          {isParentEnabled && (
            <Form.Item
              label="Parent Level"
              name="parent_Level"
              rules={[
                { required: true, message: "Please select a parent level" },
              ]}
            >
              <Select
                placeholder="Select a parent level"
                options={options.filter(
                  (option) => option.value !== selectedLevel
                )}
              />
            </Form.Item>
          )}

          <Form.Item
            label="Control Name"
            name="control_Name"
            rules={[{ required: true, message: "Please enter control name" }]}
          >
            <Input placeholder="Enter control name" />
          </Form.Item>

          <Form.Item
            label="User"
            name="lastUpdatedBy"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button onClick={resetConfigToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for adding a new level */}
      <Modal
        title="Add New Level"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddLevel}
            loading={loading}
          >
            Add Level
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter new level name"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
        />
      </Modal>

      {/* Transactions Table */}
      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({
          ...record,
          key: record.id || index, // Ensure unique key
        }))}
        rowKey="key"
      />
    </div>
  );
};

export default ConfigurationsTable;
