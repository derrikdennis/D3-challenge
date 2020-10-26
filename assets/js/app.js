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

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

//We will give xText a transform property that places it at the bottom of the chart.
//By nesting this attribute in a function, we can easily change the location of the label group whenever the width of the window changes.

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

//Now we use xtext to append three text SVG files with y coordinates specified to space out the values

//Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty(%)");

//Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

//Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

//Left Axis
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

//We add a second label group, this time for the axis left of the chart
svg.append("g").attr("class", "yText");

// yText will allow us to select the group without excess code
var yText = d3.select(".yText");

// Like before, we nest the group's transform attr in a function to make changing it on a window change an easy operation
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

//Now we append the text
// Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// Import our .csv file

d3.csv("./assets/data/data.csv").then(function (data) {
  visualize(data);
});

//Adding in the visualization function

function visualize(theData) {
  // Part 1: Essential Local Variables and Functions
  var curX = "poverty";
  var curY = "obesity";

  //We also save empty variables for our man and max values of x and y which will allow us to alter the values in functions
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  //Now to set up tooltip rules
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function (d) {
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + "%</div>";
      } else {
        theX =
          "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return theState + theX + theY;
    });
  //Call the tooltip function
  svg.call(toolTip);

  // PART 2: D.R.Y!
  // ==============
  // These functions remove some repitition from later code.
  // This will be more obvious in parts 3 and 4.

  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function (d) {
      return parseFloat(d[curX]) * 0.9;
    });

    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function (d) {
      return parseFloat(d[curX]) * 1.1;
    });
  }

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function (d) {
      return parseFloat(d[curY]) * 0.9;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function (d) {
      return parseFloat(d[curY]) * 1.1;
    });
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3.selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.

  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);

  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    } else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function (d) {
      return xScale(d[curX]);
    })
    .attr("cy", function (d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function (d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function (d) {
      return xScale(d[curX]);
    })
    .attr("dy", function (d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
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
