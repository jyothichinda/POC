import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";
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
  { title: "Msg ID", dataIndex: "id", key: "id" },
  { title: "Instrument", dataIndex: "instrument", key: "instrument" },
  { title: "Clearing Network", dataIndex: "network", key: "network" },
  { title: "Cash Inflow", dataIndex: "inflow", key: "inflow" },
  { title: "Cash Outflow", dataIndex: "outflow", key: "outflow" },
  { title: "Status", dataIndex: "status", key: "status" },
  {
    title: "Expected Settlement Date",
    dataIndex: "settlementDate",
    key: "settlementDate",
  },
  { title: "Comments", dataIndex: "comments", key: "comments" },
];

const ForeCastTable = ({ data }) => {
  // Load preferences from localStorage or use default values
  const savedColumns =
    JSON.parse(localStorage.getItem("selectedForecastColumns")) ||
    allColumns.map((col) => col.key);
  const savedOrder =
    JSON.parse(localStorage.getItem("forecastColumnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(new Set(savedColumns));
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);

  // Reset to default settings
  const resetToDefault = () => {
    setSelectedColumns(new Set(allColumns.map((col) => col.key))); // Use Set
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
      setColumnsOrder((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // Toggle column visibility dynamically
  const handleColumnToggle = (key) => {
    setSelectedColumns((prev) => {
      const updatedColumns = new Set(prev); // Clone the Set
      if (updatedColumns.has(key)) {
        updatedColumns.delete(key);
      } else {
        updatedColumns.add(key);
      }
      return new Set(updatedColumns); // Ensure state updates correctly
    });
  };

  // Filter visible columns dynamically
  const filteredColumns = columnsOrder.filter((col) =>
    selectedColumns.has(col.key)
  );

  // Sortable Column Component
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

    // Persist preferences in local storage
    useEffect(() => {
      localStorage.setItem(
        "selectedForecastColumns",
        JSON.stringify([...selectedColumns])
      );
      localStorage.setItem("forecastColumnOrder", JSON.stringify(columnsOrder));
    }, [selectedColumns, columnsOrder]);

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Checkbox
          checked={selectedColumns.has(column.key)}
          onChange={() => onToggle(column.key)}
        >
          {column.title}
        </Checkbox>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
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
                isChecked={selectedColumns.has(column.key)}
                onToggle={handleColumnToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      {/* Transactions Table */}
      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({
          ...record,
          key: record.id || index,
        }))}
        rowKey="key"
      />
    </div>
  );
};

export default ForeCastTable;
