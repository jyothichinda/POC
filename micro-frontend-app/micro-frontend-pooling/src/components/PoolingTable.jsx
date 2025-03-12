import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card } from "antd";
import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
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
    render: (text) => text || "--",
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
    dataIndex: "rebalancing",
    key: "rebalancing",
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
