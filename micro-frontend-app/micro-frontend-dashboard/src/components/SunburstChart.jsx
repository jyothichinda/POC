import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const SunburstChart = ({ data}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Clear previous SVG
    d3.select(chartRef.current).selectAll("*").remove();
    const width = '100%';
    const height = '100%';
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a root hierarchy
    const root = d3.hierarchy(data).sum((d) => d.value || 0);

    // Create the partition layout
    d3.partition().size([2 * Math.PI, radius])(root);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Draw arcs
    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.data.name))
      .style("stroke", "#fff")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      });

    // Add labels
    svg
      .selectAll("text")
      .data(root.descendants().slice(1))
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const x = (d.x0 + d.x1) / 2;
        const y = (d.y0 + d.y1) / 2;
        return `translate(${arc.centroid(d)}) rotate(${(x * 180) / Math.PI})`;
      })
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .style("font-size", "10px")
      .style("fill", "#fff");

  }, [data]);

  return <div ref={chartRef} />;
};

export default SunburstChart;
