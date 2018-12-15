// Call API
let req, json;
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  json = JSON.parse(req.responseText);
  loadChart(json.data);
};
req.send();

function loadChart(data) {
  const w = 800;
  const h = 500;
  // margin is the space between the border of the svg element and the chart
  const margin = {
    top: 70,
    bottom: 50,
    left: 70,
    right: 50
  };
  const chartW = w - margin.left - margin.right;
  const chartH = h - margin.top - margin.bottom;

  const svg = d3.select("svg");
  svg.attr("width", w).attr("height", h);

  const chart = svg
    .append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // create a scaling function for the y axis
  const yScale = d3
    .scaleLinear()
    .range([chartH, 0])
    .domain([0, d3.max(data, d => d[1])]);
  // for range, the y coordinate starts from top left corner, so the first parameter is the height, not 0

  // create Y axis
  chart.append("g").attr('id', 'y-axis').call(d3.axisLeft(yScale));

  // create scaling function for x axis
  const xScale = d3
    .scaleTime()
    .range([0, chartW])
    .domain([
      d3.min(data, d => new Date(d[0])),
      d3.max(data, d => new Date(d[0]))
    ]);

  // create X axis
  chart
    .append("g")
    .attr('id', 'x-axis')
    .attr("transform", `translate(0, ${chartH})`)
    .call(d3.axisBottom(xScale));

  /*
Common types of scales:
* scaleLinear
- scaleBand: to split the range into bands and compute coordinates and widths of the bands with additional padding
- scaleTime: when domain is an array of dates
*/

  const barStyle = {
    color: "#c4755d",
    colorHover: "beige"
  };

  const tooltipStyle = {
    width: 150,
    margin: {
      left: 20
    }
  };

  // Define the div for the tooltip
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("width", `${tooltipStyle.width}px`)
    .style("opacity", 0)
    .style("top", `${chartH}px`);

  // Add bars (rectangles)
  chart
    .selectAll()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => chartH - yScale(d[1]))
    .attr("fill", barStyle.color)
    .attr("width", 3)
    .on("mouseover", function(d) {
      d3.select(this).attr("fill", barStyle.colorHover);
      tooltip
        .style("opacity", 0.8)
        .html(
          `${d[0].split("-")[0]} Q${Math.ceil(
            d[0].split("-")[1] / 3
          )}<br/>$${d[1].toFixed(1)} Billion`
        )
        .style("left", function() {
          if (
            event.clientX + tooltipStyle.margin.left + tooltipStyle.width <
            document.documentElement.clientWidth
          ) {
            return `${event.clientX + tooltipStyle.margin.left}px`;
          } else {
            return `${event.clientX -
              tooltipStyle.margin.left -
              tooltipStyle.width}px`;
          }
        })
        .attr("data-date", this.dataset.date);
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", barStyle.color);
      tooltip.style("opacity", 0);
    });

  // .attr(’x’, (actual, index, array) => xScale(actual.value))
  // array is the while array of data

  // Add horizontal tick marks
  // chart
  // .append("g")
  // .attr("class", "grid")
  // .call(
  //   d3
  //     .axisLeft()
  //     .scale(yScale)
  //     .tickSize(-chartW, 0, 0)
  //     .tickFormat("")
  // );

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

  // Add title Y axis
  svg
    .append("text")
    .attr("x", -(chartH / 2) - margin.left)
    .attr("y", margin.top / 2.4 + 65)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-family", "Roboto")
    .text("Gross Domestic Product");

  // Add chart title
  svg
    .append("text")
    .attr("x", chartW / 1.7)
    .attr("y", margin.top / 1.5)
    .attr("text-anchor", "middle")
    .attr('id', 'title')
    .style("font-size", "24px")
    .style("font-family", "Roboto")
    .text("United States GDP");
}
