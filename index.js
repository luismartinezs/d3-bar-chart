// Call API
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  json = JSON.parse(req.responseText);
  // console.log(json.data.filter((e, i) => i < 10));
  loadChart(json.data);
  console.log(json);
};
req.send();


function loadChart(data) {
  // let dateStr = data[0][0];
  // let date = new Date(dateStr); // gives a date
  // TODO: format the years like so: 1950, without the comma for thousandstoString(0)

  // data = [];
  // for (let i = 0; i < 10; i++) {
  //   data.push([i * 10, i * 10]);
  // }

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
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // create a scaling function for the y axis
  const yScale = d3
    .scaleLinear()
    .range([chartH, 0])
    .domain([0, d3.max(data, d => d[1])]);
  // for range, the y coordinate starts from top left corner, so the first parameter is the height, not 0

  // create Y axis
  chart.append("g").call(d3.axisLeft(yScale));

  // create scaling function for x axis
  const xScale = d3
    .scaleTime()
    .range([0, chartW])
    .domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))]);

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

const barStyle = {
  color: '#29a6ce',
  colorHover: 'white',
}

  // Add bars (rectangles)
  chart
    .selectAll()
    .data(data)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => chartH - yScale(d[1]))
    .attr("width", 3)
    .attr("fill", barStyle.color)
    .on('mouseover', function() {
      d3.select(this)
      .attr('fill', barStyle.colorHover)
    })
    .on('mouseout', function() {
      d3.select(this)
      .attr('fill', barStyle.color)
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

  // Add title Y
  // svg
  //   .append("text")
  //   .attr("x", -(chartH / 2) - margin.left)
  //   .attr("y", margin.top / 2.4)
  //   .attr("transform", "rotate(-90)")
  //   .attr("text-anchor", "middle")
  //   .text("Chart title Y");

  // Add title X
  svg
    .append("text")
    .attr("x", chartW / 1.7)
    .attr("y", margin.top / 1.5)
    .attr("text-anchor", "middle")
    .style('font-size', '24px')
    .style('font-family', 'Roboto')
    .text("United States GDP");



}
