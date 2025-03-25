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
  Tag,
  DatePicker,
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
  { title: "Parent Level", dataIndex: "parentLevel", key: "parentLevel" },
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

const ConfigurationsTable = ({
  data = [
    {
      id: 1,
      level: "Level 1",
      parentLevel: "None",
      controlName: "Control A",
      rule: [{ condition: "Condition A", ruleValue: "Value A" }],
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      status: "Active",
      lastUpdatedBy: "Admin",
      lastUpdatedTime: "2025-03-24 10:00 AM",
    },
    {
      id: 2,
      level: "Level 2",
      parentLevel: "Level 1",
      controlName: "Control B",
      rule: [{ condition: "Condition B", ruleValue: "Value B" }],
      startDate: "2025-03-15",
      endDate: "2025-04-15",
      status: "Inactive",
      lastUpdatedBy: "User1",
      lastUpdatedTime: "2025-03-23 02:30 PM",
    },
    {
      id: 3,
      level: "Level 3",
      parentLevel: "Level 2",
      controlName: "Control C",
      rule: [{ condition: "Condition C", ruleValue: "Value C" }],
      startDate: "2025-03-20",
      endDate: "2025-04-20",
      status: "Active",
      lastUpdatedBy: "User2",
      lastUpdatedTime: "2025-03-22 11:45 AM",
    },
  ],
  fetchData,
}) => {
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
  const [rule, setRule] = useState([]);
  const [condition, setCondition] = useState("");
  const [ruleValue, setRuleValue] = useState("");
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
      const response = await axios.get("/api/levels");
      setOptions(response.data.map((item) => ({ value: item, label: item })));
    } catch (error) {
      message.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = () => {
    if (condition && ruleValue) {
      setRules([...rule, { condition, value: ruleValue }]);
      setCondition("");
      setRuleValue("");
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

  const handleAddLevel = async () => {
    if (!newLevel) return message.error("Please enter a level name");

    try {
      setLoading(true);
      await axios.post("/api/levels", { name: newLevel }); // Save to database
      setOptions([...options, { value: newLevel, label: newLevel }]); // Update dropdown
      message.success("Level added successfully");
      setIsModalOpen(false); // Close the modal after successful addition
      setNewLevel(""); // Reset the input field
    } catch (error) {
      message.error("Failed to add level");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      // Assign "Root Level" if no parent level is selected
      const payload = {
        ...values,
        parentLevel: values.parentLevel || "Root Level",
      };

      const response = await axios.post(
        "http://10.10.0.11:9898/save/masterThrottle_configuration",
        payload
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

  console.log("Data prop:", data);
  console.log(
    "Mapped dataSource:",
    data.map((record, index) => ({
      ...record,
      key: record.id || index,
      rule: record.rule.map((r) => `${r.condition}: ${r.ruleValue}`).join(", "),
    }))
  );

  console.log("Filtered Columns:", filteredColumns);

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
            label="Level"
            name="level"
            rule={[{ required: true, message: "Please enter level name" }]}
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
              options={options}
              onChange={(value) => setSelectedLevel(value)} // Track the selected level
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
              name="parentLevel"
              rule={[
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
            name="controlName"
            rule={[{ required: true, message: "Please enter control name" }]}
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
              Done
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
