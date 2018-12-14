let data = [[10, 10], [20, 20], [30, 30]];

data = [];
for (let i = 1; i < 10; i++) {
  data.push([i * 10, i * 10]);
}

// w and h are the width and height of the svg element
const w = 500;
const h = 500;
// margin is the space between the border of the svg element and the chart
const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50
};
const chartW = w - margin.left - margin.right;
const chartH = h - margin.top - margin.bottom;

const svg = d3.select("svg");
svg.attr("width", w).attr("height", h);

const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create a scaling function for the y axis
const yScale = d3
  .scaleLinear()
  .range([chartH, 0])
  .domain([0, 100]);
// for range, the y coordinate starts from top left corner, so the first parameter is the height, not 0

// create Y axis
chart.append("g").call(d3.axisLeft(yScale));

// create scaling function for x axis
const xScale = d3
  .scaleLinear()
  .range([0, chartW])
  .domain([0, 100]);

console.dir(xScale);

// create X axis
chart
  .append("g")
  .attr("transform", `translate(0, ${chartH})`)
  .call(d3.axisBottom(xScale));

/*
Other types of scales are possible:
- scaleBand: to split the range into bands and compute coordinates and widths of the bands with additional padding
- scaleTime: when domain is an array of dates
*/

// Add horizontal tick marks
chart
  .append("g")
  .attr("class", "grid")
  .call(
    d3
      .axisLeft()
      .scale(yScale)
      .tickSize(-chartW, 0, 0)
      .tickFormat("")
  );

// Add vertical tick marks
// chart
//   .append("g")
//   .attr("class", "grid")
//   .attr("transform", `translate(0, ${chartH})`)
//   .call(
//     d3
//       .axisBottom()
//       .scale(xScale)
//       .tickSize(-chartH, 0, 0)
//       .tickFormat("")
//   );

// Add bars (rectangles)
chart
  .selectAll()
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d[0] - 5))
  .attr("y", d => yScale(d[1]))
  .attr("height", d => chartH - yScale(d[1]))
  .attr("width", xScale(10))
  .attr("fill", "navy");

// .attr(’x’, (actual, index, array) => xScale(actual.value))
// array is the whole array of data

// Add title Y
svg
  .append("text")
  .attr("x", -(chartH / 2) - margin.left)
  .attr("y", margin.top / 2.4)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Chart title Y");

// Add title X
svg
  .append("text")
  .attr("x", chartW / 1.6)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .text("Chart title X");

// event to change opacity of bars, but it's not working
SvgElement.on("mouseenter", function(actual, i) {
  d3.select(this).attr("opacity", 0.5);
}).on("mouseleave", function(actual, i) {
  d3.select(this).attr("opacity", 1);
});

// CONTINUE https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/