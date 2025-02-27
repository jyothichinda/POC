import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  Legend,
} from "recharts";

import { CashTotal } from "../utils/formatData";

const BarChartContainer = (props) => {
  const { data } = props;
  const cashTotal = CashTotal(data);

  // Prepare Data for Chart
  const chartData = data.map((item) => ({
    name: item.title, // Label
    percentage: ((parseFloat(item.amount) / cashTotal) * 100).toFixed(2), // % value
    amount: parseFloat(item.amount).toLocaleString(), // Format amount
  }));

  return (
    <BarChart width={200} height={100} data={chartData} layout="vertical">
      {/* X-Axis (Percentage Scale) */}
      <XAxis
        type="number"
        domain={[0, 100]}
        tick={false}
        axisLine={false} // Remove X-axis line
        tickLine={false} // Remove X-axis ticks
      />

      {/* Y-Axis (Hidden, but still used for labels) */}
      <YAxis
        type="category"
        dataKey="name"
        width={75}
        axisLine={false} // Remove Y-axis line
        tickLine={false} // Remove Y-axis ticks
        tick={{ fontSize: 10 }}
      />

      {/* Tooltip */}
      <Tooltip
        formatter={(value, name) =>
          name === "percentage" ? `${value}%` : value
        }
      />

      {/* Bars with Color Mapping */}
      <Bar dataKey="percentage" fill="#4285F4" barSize={20}>
        {chartData.map((entry, index) => (
          <Cell key={index} fill={index === 0 ? "#4285F4" : "#00E396"} />
        ))}

        {/* Display Amount Inside Bars */}
        <LabelList
          dataKey="amount"
          position="inside"
          fill="black"
          fontSize={7}
        />
      </Bar>
    </BarChart>
  );
};

export default BarChartContainer;
