import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Variable Costs", value: 400 },
  { name: "Available Cash", value: 300 },
  { name: "Fixed Cost", value: 300 },

];

const COLORS = ["#0088FE", "#00C49F", "#87CEEB"]; // Define slice colors

const DonutChart = () => {
  return (
    <PieChart width={400} height={350}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60} // Creates the "donut" effect
        outerRadius={90}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => ( 
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default DonutChart;
