var svgWidth = 960;
var svgHeight = 660;
var padding = 20;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

var strokecolor = "#9999ff";

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


d3.csv("./assets/data/data.csv").then(function (statedata) {

    statedata.forEach(function (data) {
        data.id = data.id;
        data.abbr = data.abbr;
        data.state = data.state;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    var xScale = d3.scaleLinear()
        .domain([d3.min(statedata, function (d) {
            return d.poverty;
        }), d3.max(statedata, function (d) {
            return d.poverty;
        })])
        .range([10, chartWidth + 20]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(statedata, function (d) {
            return d.smokes;
        })])
        .range([chartHeight, 10]);

    var circles = svg.selectAll("circle")
        .data(statedata)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d.poverty);
        })
        .attr("cy", function (d) {
            return yScale(d.smokes);
        })
        .attr("r", 10)
        .attr("fill", "white")
        .attr("stroke", strokecolor)
        .attr("stroke-width", "3px");

    var text = svg.selectAll("text")
        .data(statedata)
        .enter()
        .append("text")
        .text(function (d) {
            return d.abbr;
        })
        .attr("x", function (d) {
            return xScale(d.poverty) - 6;
        })
        .attr("y", function (d) {
            return yScale(d.smokes) + 5;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");

    var xAxis = d3.axisTop(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (chartHeight) + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);

    svgAppend("g")
        .attr("class", "axis")
        .call(yAxis);

    console.log(data);

});