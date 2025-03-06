import React from "react";
import ReactApexChart from "react-apexcharts";

const BarWithLineChartContainer = ({ data }) => {
  const chartOptions = {
    ...data.options,
    xaxis: {
      categories: data.categories,
    },
    yaxis: [
      {
        title: { text: "Debt & Equity (in Thousands)" },
        min: 0,
        max: Math.ceil(
          Math.max(...data.series[0].data, ...data.series[1].data) * 1.1
        ),
        labels: {
          formatter: (val) => `${val.toFixed(2)}`, // **Round to 2 decimal places**
        },
      },
    ],
    stroke: {
      width: [0, 0, 4], // Apply stroke width only for line series
    },
    markers: {
      size: [0, 0, 5], // Show markers for the line graph
    },
  };

  return (
    <ReactApexChart
      options={chartOptions}
      series={data.series}
      height={350}
    />
  );
};

export default BarWithLineChartContainer;
