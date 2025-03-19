import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const GaugeChart = () => {
  const [value, setValue] = useState(50);

  return (
    <div style={{ textAlign: "center", marginTop: "30px"}}>
      <ReactSpeedometer
        value={value}
        minValue={0}
        maxValue={100}
        needleColor="red"
        startColor="green"
        endColor="red"
        segments={6}
        currentValueText={`${value}`}
        width={300}   // Set the width of the gauge chart
  height={200}
      />
      <h2>Low Liquidity</h2>
      <p>Liquidity Ratio has dropped below 80% monitor closely</p>
      <p>severity: warning</p>
    </div>
  );
};

export default GaugeChart;
