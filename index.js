// Call API
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  json = JSON.parse(req.responseText);
  console.log(json.data.filter((e, i) => i < 10));
  loadChart(json.data);
};
req.send();



// select svg element
const w = 800;
const h = 500;
const padding = 100;
const svg = d3.select("svg");
svg.attr("width", w).attr("height", h);



// add title to svg
svg
  .append("text")
  .attr("x", w / 2)
  .attr("y", 0 + padding / 2)
  .attr("text-anchor", "middle")
  .attr("id", "title")
  .style("font-size", "2rem")
  .style("text-decoration", "none")
  .style("font-family", "Roboto")
  .text("United States GDP");

const scale = d3.scaleLinear();



function loadChart(arr) {
  // TODO: format the years like so: 1950, without the comma for thousandstoString(0)

  arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push([i, i*10]);
  }

  // Create axis
  // define domain
  const xDomMin = d3.min(arr, d => d[0]);
  const xDomMax = d3.max(arr, d => d[0]);
  const xDomain = [xDomMin, xDomMax];

  const yDomMin = d3.min(arr, d => d[1]);;
  const yDomMax = d3.max(arr, d => d[1]);
  const yDomain = [yDomMin, yDomMax];

  // define range
  const xRange = [padding, w - padding];
  const yRange = [h - padding, padding];

  console.log(`xDomain: ${xDomain}
yDomain: ${yDomain}
xRange: ${xRange}
yRange: ${yRange}`);

  const xScale = d3.scaleLinear();
  xScale.domain(xDomain).nice().range(xRange);

  const yScale = d3.scaleLinear();
  yScale.domain(yDomain).nice().range(yRange);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // set axes in svg
  svg
    .append("g")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);

  // append rectangles representing the datase to svg
  svg
    .selectAll("rect")
    .data(arr)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d[0]) )
    .attr("y", (d, i) => h - padding - yScale(d[1]) - i*( h - 2*padding ) / ( arr.length - 1 ) )
    .attr("width", ( w - 2*padding ) / ( arr.length - 1 ) )
    .attr("height", (d, i) => yScale(d[1]) - i )
    .attr("fill", "rgb(51, 173, 255)");
    // setting up the Y values is giving me a headache
}



/*
@ param {string} date is a string in the format "yyyy-mm-dd"
@ returns the year in decimal format
*/
function date2Num(date) {
  let dateArr = date.split("-");
  return (+dateArr[0] + +dateArr[1] / 12 + +dateArr[2] / 365).toFixed(2);
}


function loadChartOld(arr) {
    // TODO: format the years like so: 1950, without the comma for thousandstoString(0)
    let yearFormat = d3.format(".0f");
  
    // Create axis
    // define domain
    const xDomMin = d3.min(arr, d => date2Num(d[0]));
    const xDomMax = d3.max(arr, d => date2Num(d[0]));
    const xDomain = [xDomMin, xDomMax];
  
    const yDomMin = 0;
    const yDomMax = d3.max(arr, d => d[1]);
    const yDomain = [yDomMax, yDomMin];
  
    // define range
    const xRange = [padding, w - padding];
    const yRange = [padding, h - padding];
  
    console.log(`    xDomain: ${xDomain}
      yDomain: ${yDomain}
      xRange: ${xRange}
      yRange: ${yRange}`);
  
    const xScale = d3.scaleLinear();
    xScale.domain(xDomain).range(xRange);
  
    const yScale = d3.scaleLinear();
    yScale.domain(yDomain).range(yRange);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    // set axes in svg
    svg
      .append("g")
      .attr("transform", `translate(0,${h - padding})`)
      .call(xAxis);
  
    svg
      .append("g")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);
  
    // append rectangles representing the datase to svg
    svg
      .selectAll("rect")
      .data(arr)
      .enter()
      .append("rect")
      .attr("x", d => xScale(date2Num(d[0])))
      .attr("y", d => h - padding - yScale(d[1]))
      .attr("width", xRange[1] / arr.length - 1)
      .attr("height", d => yScale(d[1]))
      .attr("fill", "rgb(51, 173, 255)");
  }