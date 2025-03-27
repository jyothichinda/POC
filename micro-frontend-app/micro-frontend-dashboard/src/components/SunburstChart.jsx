import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const SunburstChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Clear previous SVG
    d3.select(chartRef.current).selectAll("*").remove();

    // Set numeric width and height
    const width = 400; // Set a fixed width in pixels
    const height = 400; // Set a fixed height in pixels
    const radius = Math.min(width, height) / 2;

    // Define color palettes
    const fixedCostsPalette = [
      "#034C53",
      "#006A71",
      "#336D82",
      "#48A6A7",
      "#9ACBD0",
    ];
    const variableCostsPalette = ["#205781", "#143D60", "#27445D"];

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

    // Function to assign colors dynamically
    const getColor = (d) => {
      if (d.data.name === "Fixed Costs") {
        return fixedCostsPalette[0]; // Use the darkest color for the parent
      } else if (
        d.ancestors().some((ancestor) => ancestor.data.name === "Fixed Costs")
      ) {
        // Use lighter colors for children of "Fixed Costs"
        const depth = d.depth - 1; // Subtract 1 to skip the root node
        return fixedCostsPalette[depth % fixedCostsPalette.length];
      } else if (d.data.name === "Variable Costs") {
        return variableCostsPalette[0]; // Use the darkest color for the parent
      } else if (
        d
          .ancestors()
          .some((ancestor) => ancestor.data.name === "Variable Costs")
      ) {
        // Use lighter colors for children of "Variable Costs"
        const depth = d.depth - 1; // Subtract 1 to skip the root node
        return variableCostsPalette[depth % variableCostsPalette.length];
      }
      return "#ccc"; // Default color for other nodes
    };

    // Draw arcs
    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", getColor) // Assign colors dynamically
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
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .style("font-size", "10px")
      .style("fill", "#fff");
  }, [data]);

  return <div ref={chartRef} />;
};

export default SunburstChart;
