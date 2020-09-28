// Create svg Area for Chart
var svgWidth = 960;
var svgHeight = 660;
var padding = 20;

//Create Chart Margins to help axes and placement of chart
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
};

//This will help with the left axis
var AxisLeft = chartMargin.left + 20;

//This will finalize the area that is going to be used within the svg area of the chart
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Creating the svg which will be a scatterplot
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Bringing in the state by state data
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

  //Creating scales so that everything moves with the scale both on the x and y axis
  //Creating a scale on the x-axis
  var xScale = d3
    .scaleLinear()
    .domain([
      d3.min(statedata, function (d) {
        return d.poverty - 1;
      }),
      d3.max(statedata, function (d) {
        return d.poverty;
      }),
    ])
    .range([AxisLeft, svgWidth - chartMargin.right]);

  //Creating the scale on the y-axis based off of smoking percentage.
  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(statedata, function (d) {
        return d.smokes;
      }),
    ])
    .range([svgHeight - chartMargin.top, chartMargin.bottom]);

  //Creatng our circles.  I chose to look at smokers by poverty level
  var circles = svg
    .selectAll("circle")
    .data(statedata)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.poverty);
    })
    .attr("cy", function (d) {
      return yScale(d.smokes);
    })
    .attr("r", 14)
    .attr("class", "stateCircle");

  //Add the state abbreviations as labels
  var text = svg
    .selectAll("text")
    .data(statedata)
    .enter()
    .append("text")
    .text(function (d) {
      return d.abbr;
    })
    .attr("x", function (d) {
      return xScale(d.poverty);
    })
    .attr("y", function (d) {
      return yScale(d.smokes) + 4;
    })
    .attr("class", "stateText");

  //Creating both the x and y axes
  var xAxis = d3.axisTop(xScale);

  //This will create the x axis.  With all d3, this goes from the bottom up.
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (svgHeight - chartMargin.bottom) + ")")
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  //Attaching the y axis to the chart.
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + AxisLeft + ",0)")
    .call(yAxis);

  //Adding the x-axis label.
  svg
    .append("text")
    .attr("class", "aText")
    .attr("text-anchor", "end")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - 10)
    .text("Poverty Level by State (%)");

  //Adding the y-axis label
  svg
    .append("text")
    .attr("class", "aText")
    .attr("text-anchor", "end")
    .attr("x", svgHeight / -2)
    .attr("y", chartMargin.left - 10)
    //        .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Smokers by State (%)");
});
