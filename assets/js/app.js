// Create svg Area for Chart
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var padding = 20;

//Create Chart Margins to help axes and placement of chart
var chartMargin = 30;

//space for placing words
var labelArea = 110;

//This will help with the left axis
var axisLeft = chartMargin.left + 20;

//Padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

//Creating the svg which will be a scatterplot
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

//Set the radous for each dot thjat will appear in the graph
//Note: Making this a function allows us to easily call it in the mobility section of our code
var circRadoius;
function crGet() {
  if (svgWidth <= 530) {
    circRadius = 5;
  } else {
    cirRadius = 10;
  }
}

//Creating Labels for our Axes

//Bottom axes

svg.append("g")
  .attr("class","xText");
var xText = d3.select(".xText");

//We will give xText a transform property that places it at the bottom of the chart.
//By nesting this attribute in a function, we can easily change the location of the label group whenever the width of the window changes.

function xTextRefresh){
  xText.attr(
    "transform",
    "translate("+
      ((width-labelArea) / 2 + labelArea) +
      ", "+
      (height-margin-tPadBot) +
      ")"
  );
}

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
    //In order to get the label in the correct position, I had to change it so that it was a hard code of adding four pixels.
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
