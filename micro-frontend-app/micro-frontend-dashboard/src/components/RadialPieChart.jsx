import React from "react";
import Chart from "react-apexcharts";

import { CashTotal } from "../utils/formatData";

const RadialPieChartContainer = ({ data ,type}) => {
  const cashTotal = CashTotal(data);
  const labels = data.map((item) => item.title);
  const series = data.map((item) =>
    (parseFloat(item.amount / cashTotal) * 100).toFixed(2)
  );

  return (
    <Chart
      options={{
        chart: { type: "radialBar" },
        labels: labels,
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: { show: true },
              value: { show: true, formatter: (val) => `${val}%` },
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          floating: false, // Ensures the legend floats instead of stacking
          markers: { radius: 2 }, // Adjust marker shape
          itemMargin: { horizontal: 5, vertical: 2 }, // Adjusts spacing
          fontSize: "5px",
        },
      }}
      series={series}
      type="radialBar"
      height= {type === "row"?"100%":"50%"}
      width={"100%"}
    />
  );
};

export default RadialPieChartContainer;
