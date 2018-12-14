const data = [
    [40, 10],
    [20, 30]
];

// select svg element
const w = 500;
const h = 500;
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

const chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
// CONTINUE https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/