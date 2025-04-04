import React from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const AreaChartContainer = ({ data }) => {
  // Convert the time array format [2025, 3, 26, 8, 0] to a readable format
  const formatTimeArray = (timeArray) => {
    return dayjs(new Date(...timeArray)).format("YYYY-MM-DD HH:mm");
  };

  // Aggregate data to handle duplicates
  const aggregatedData = data.reduce((acc, item) => {
    const formattedTime = Array.isArray(item.time)
      ? formatTimeArray(item.time)
      : dayjs(item.time).format("YYYY-MM-DD HH:mm");

    const key = `${formattedTime}-${item.type}`;
    if (!acc[key]) {
      acc[key] = { time: formattedTime, type: item.type, amount: 0 };
    }
    acc[key].amount += parseFloat(item.amount);
    return acc;
  }, {});

  // Convert aggregated data back to an array
  const processedData = Object.values(aggregatedData);

  // Extract and format timestamps
  const timeStamps = Array.from(
    new Set(processedData.map((item) => item.time))
  ).sort((a, b) => dayjs(a).diff(dayjs(b)));

  // Generate Cash Inflow Data
  const cashInflowData = timeStamps.map((time) => {
    const entry = processedData.find(
      (item) => item.time === time && item.type === "Inflow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  // Generate Cash Outflow Data
  const cashOutflowData = timeStamps.map((time) => {
    const entry = processedData.find(
      (item) => item.time === time && item.type === "Outflow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  return (
    <Chart
      options={{
        chart: { type: "area", stacked: true, toolbar: { show: false } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
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
      width="80%"
    />
  );
};

export default AreaChartContainer;
