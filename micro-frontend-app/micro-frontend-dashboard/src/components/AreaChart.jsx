import React from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const AreaChartContainer = ({ data }) => {
  const timeStamps = Array.from(
    new Set(data.map((item) => item.timestamp))
  ).sort((a, b) => dayjs(a).diff(dayjs(b)));

  const cashInflowData = timeStamps.map((time) => {
    const entry = data.find(
      (item) => item.timestamp === time && item.title === "Current Cash InFlow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  const cashOutflowData = timeStamps.map((time) => {
    const entry = data.find(
      (item) => item.timestamp === time && item.title === "Current Cash OutFlow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  return (
    <Chart
      options={{
        chart: { type: "area", toolbar: { show: false } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: {
          type: "datetime",
          categories: timeStamps,
          labels: {
            format: "HH:mm",
            datetimeUTC: false,
          },
        },
        yaxis: {
          labels: { formatter: (val) => `$${val.toFixed(2)}` },
        },
        tooltip: {
          x: { format: "YYYY-MM-DD HH:mm" },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "7px",
        },
      }}
      series={[
        { name: "Cash Inflow", data: cashInflowData },
        { name: "Cash Outflow", data: cashOutflowData },
      ]}
      type="area"
      height="100%"
      width="100%"
    />
  );
};

export default AreaChartContainer;
