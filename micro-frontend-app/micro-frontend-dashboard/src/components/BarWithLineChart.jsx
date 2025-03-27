import React from "react";
import ReactApexChart from "react-apexcharts";

const BarWithLineChartContainer = ({ data }) => {
  // Extract categories (days) and series data
  const categories = data.map((item) => item.day.slice(0, 3).toUpperCase()); // Extract first 3 characters and convert to uppercase
  const inflowData = data.map((item) => item.totalInflow || 0); // Handle missing values
  const outflowData = data.map((item) => item.totalOutflow || 0); // Handle missing values

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories, // Days of the week
    },
    yaxis: [
      {
        title: { text: "Amount (in Thousands)" },
        min: 0,
        labels: {
          formatter: (val) => `$${(val / 1000).toFixed(2)}k`, // Format as thousands
        },
      },
    ],
    stroke: {
      width: [0, 0, 2], // Apply stroke width only for line series
    },
    markers: {
      size: [0, 0, 5], // Show markers for the line graph
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `$${val.toFixed(2)}`, // Format tooltip values
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  const chartSeries = [
    {
      name: "Inflow",
      type: "bar",
      data: inflowData,
    },
    {
      name: "Outflow",
      type: "bar",
      data: outflowData,
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={350}
    />
  );
};

export default BarWithLineChartContainer;
