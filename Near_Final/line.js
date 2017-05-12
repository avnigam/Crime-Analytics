var global_year_line = 0;
var global_state_line = "";

function line_plot(data, state, year) {
      // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var width = 690 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Adds the svg canvas
    var svgContainer = d3.select("#bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	svgContainer
		.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "bold")  
        .text("State: " + state + " - Year: " + year);

    // Parse the month / time
    // Get the data
    var parseDate = d3.time.format("%b").parse;

    // Get the data
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.count = +d.count;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // Add the X Axis
    svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svgContainer.append("g")
        .attr("class", "y axis")
        .call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Homicide Count");
		

    // Draw vertical grid lines
    svgContainer.append("g")     
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis
            .tickSize(-height, 0, 0)
            .tickFormat("")
            )

    // Draw horizontal grid lines
    svgContainer.append("g")     
        .attr("class", "grid")
        .call(yAxis
            .tickSize(-width, 0, 0)
            .tickFormat("")
            )

    svgContainer.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "#aec6a8")
        .attr("x", function(d) { return x(d.date)-5; })
        .attr("width", 10)
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });
      
    // Define the line (interpolate to smooth the line)
    var valueline = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    svgContainer.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));
}

function line_new(state, year) {
	d3.select("#bar_chart").selectAll("svg").remove();	
	if (state == '') {
		state = global_state_line;
	} else {
		global_state_line = state;
	}
	
	if (year == 0) {
		year = global_year_line;
	} else {
		global_year_line = year;
	}
	
	d3.json('http://localhost:5000/api/line/' + year + "/" + state, function (error, json) {
		console.log(json);
		var data = json;
        line_plot(data, state, year);
    });
}