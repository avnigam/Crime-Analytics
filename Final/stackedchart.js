
var global_state_stack = '';
var global_choice_stack = '';
function gender_stackedChartRender(data, state, year) {
	
	var margin = {top: 20, right: 40, bottom: 35, left: 30};

	var width = 680 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#canvas-svg")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	  	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "bold")  
        .text("State: " + state);

	var parse = d3.time.format("%Y").parse;

	// Transpose the data into layers
	var dataset = d3.layout.stack()(["male", "female", "unknown"].map(function(fruit) {
	  return data.map(function(d) {
		return {x: parse(d.year), y: +d[fruit]};
	  });
	}));


	// Set x, y and colors
	var x = d3.scale.ordinal()
	  .domain(dataset[0].map(function(d) { return d.x; }))
	  .rangeRoundBands([10, width-10], 0.25);

	var y = d3.scale.linear()
	  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
	  .range([height, 0]);

	var colors = ["#d25c4d", "#f2b447", "green"];

	// Define and draw axes
	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left")
	  .ticks(5)
	  .tickSize(-width, 0, 0)
	  .tickFormat( function(d) { return d } );

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  .tickFormat(d3.time.format("%Y"));

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	  .append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", -15)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("log(frequency + 5)");

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	  .append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("x", -15)
	  .style("text-anchor", "end")
	  .text("log(frequency + 5)");


	// Create groups for each series, rects for each segment 
	var groups = svg.selectAll("g.cost")
	  .data(dataset)
	  .enter().append("g")
	  .attr("class", "cost")
	  .style("fill", function(d, i) { return colors[i]; });

	var rect = groups.selectAll("rect")
	  .data(function(d) { return d; })
	  .enter()
	  .append("rect")
	  .attr("x", function(d) { return x(d.x); })
	  .attr("y", function(d) { return y(d.y0 + d.y); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	  .attr("width", x.rangeBand())
	  .on("mouseover", function() { tooltip.style("display", null); })
	  .on("mouseout", function() { tooltip.style("display", "none"); })
	  .on("mousemove", function(d) {
		var xPosition = d3.mouse(this)[0] - 15;
		var yPosition = d3.mouse(this)[1] - 25;
		tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		tooltip.select("text").text(d.y);
	  });


	// Draw legend
	var legend = svg.selectAll(".legend")
	  .data(colors)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
	 
	legend.append("rect")
	  .attr("x", width - 53)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	 
	legend.append("text")
	  .attr("x", width -35)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d, i) { 
		switch (i) {
		  case 2: return "Male";
		  case 1: return "Female";
		  case 0: return "Unkown";
		}
	  });


	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	  .attr("class", "tooltip")
	  .style("display", "none");
		
	tooltip.append("rect")
	  .attr("width", 30)
	  .attr("height", 20)
	  .attr("fill", "white")
	  .style("opacity", 0.5);

	tooltip.append("text")
	  .attr("x", 15)
	  .attr("dy", "1.2em")
	  .style("text-anchor", "middle")
	  .attr("font-size", "12px")
	  .attr("font-weight", "bold");
}

function age_stackedChartRender(data) {
	console.log(data);
	
	var margin = {top: 20, right: 40, bottom: 35, left: 30};

	var width = 680 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#canvas-svg")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parse = d3.time.format("%Y").parse;

	// Transpose the data into layers
	var dataset = d3.layout.stack()(["young", "middle", "old"].map(function(fruit) {
	  return data.map(function(d) {
		return {x: parse(d.year), y: +d[fruit]};
	  });
	}));


	// Set x, y and colors
	var x = d3.scale.ordinal()
	  .domain(dataset[0].map(function(d) { return d.x; }))
	  .rangeRoundBands([10, width-10], 0.25);

	var y = d3.scale.linear()
	  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
	  .range([height, 0]);

	var colors = ["#d25c4d", "#f2b447", "green"];

	// Define and draw axes
	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left")
	  .ticks(5)
	  .tickSize(-width, 0, 0)
	  .tickFormat( function(d) { return d } );

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  .tickFormat(d3.time.format("%Y"));

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis);

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);


	// Create groups for each series, rects for each segment 
	var groups = svg.selectAll("g.cost")
	  .data(dataset)
	  .enter().append("g")
	  .attr("class", "cost")
	  .style("fill", function(d, i) { return colors[i]; });

	var rect = groups.selectAll("rect")
	  .data(function(d) { return d; })
	  .enter()
	  .append("rect")
	  .attr("x", function(d) { return x(d.x); })
	  .attr("y", function(d) { return y(d.y0 + d.y); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	  .attr("width", x.rangeBand())
	  .on("mouseover", function() { tooltip.style("display", null); })
	  .on("mouseout", function() { tooltip.style("display", "none"); })
	  .on("mousemove", function(d) {
		var xPosition = d3.mouse(this)[0] - 15;
		var yPosition = d3.mouse(this)[1] - 25;
		tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		tooltip.select("text").text(d.y);
	  });


	// Draw legend
	var legend = svg.selectAll(".legend")
	  .data(colors)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
	 
	legend.append("rect")
	  .attr("x", width - 53)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	 
	legend.append("text")
	  .attr("x", width -35)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d, i) { 
		switch (i) {
		  case 2: return "Young Age";
		  case 1: return "Middle Age";
		  case 0: return "Old Age";
		}
	  });


	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	  .attr("class", "tooltip")
	  .style("display", "none");
		
	tooltip.append("rect")
	  .attr("width", 30)
	  .attr("height", 20)
	  .attr("fill", "white")
	  .style("opacity", 0.5);

	tooltip.append("text")
	  .attr("x", 15)
	  .attr("dy", "1.2em")
	  .style("text-anchor", "middle")
	  .attr("font-size", "12px")
	  .attr("font-weight", "bold");
}

function race_stackedChartRender(data) {
	console.log(data);
	
	var margin = {top: 20, right: 40, bottom: 35, left: 30};

	var width = 680 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#canvas-svg")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parse = d3.time.format("%Y").parse;

	// Transpose the data into layers
	var dataset = d3.layout.stack()(["Asian / Pacific","Black","Native American / Alaska Native", "Unknown", "White"].map(function(fruit) {
	  return data.map(function(d) {
		return {x: parse(d.year), y: +d[fruit]};
	  });
	}));


	// Set x, y and colors
	var x = d3.scale.ordinal()
	  .domain(dataset[0].map(function(d) { return d.x; }))
	  .rangeRoundBands([10, width-10], 0.25);

	var y = d3.scale.linear()
	  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
	  .range([height, 0]);

	var colors = ["#d25c4d", "#f2b447", "green", "blue", "yellow"];

	// Define and draw axes
	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left")
	  .ticks(5)
	  .tickSize(-width, 0, 0)
	  .tickFormat( function(d) { return d } );

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  .tickFormat(d3.time.format("%Y"));

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis);

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);


	// Create groups for each series, rects for each segment 
	var groups = svg.selectAll("g.cost")
	  .data(dataset)
	  .enter().append("g")
	  .attr("class", "cost")
	  .style("fill", function(d, i) { return colors[i]; });

	var rect = groups.selectAll("rect")
	  .data(function(d) { return d; })
	  .enter()
	  .append("rect")
	  .attr("x", function(d) { return x(d.x); })
	  .attr("y", function(d) { return y(d.y0 + d.y); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	  .attr("width", x.rangeBand())
	  .on("mouseover", function() { tooltip.style("display", null); })
	  .on("mouseout", function() { tooltip.style("display", "none"); })
	  .on("mousemove", function(d) {
		var xPosition = d3.mouse(this)[0] - 15;
		var yPosition = d3.mouse(this)[1] - 25;
		tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		tooltip.select("text").text(d.y);
	  });


	// Draw legend
	var legend = svg.selectAll(".legend")
	  .data(colors)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
	 
	legend.append("rect")
	  .attr("x", width - 53)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	 
	legend.append("text")
	  .attr("x", width -35)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d, i) { 
		switch (i) {
		  case 4: return "Asian / Pacific";
		  case 3: return "Black";
		  case 2: return "Native American / Alaska Native";
		  case 1: return "Unknown";
		  case 0: return "White";
		}
	  });


	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	  .attr("class", "tooltip")
	  .style("display", "none");
		
	tooltip.append("rect")
	  .attr("width", 30)
	  .attr("height", 20)
	  .attr("fill", "white")
	  .style("opacity", 0.5);

	tooltip.append("text")
	  .attr("x", 15)
	  .attr("dy", "1.2em")
	  .style("text-anchor", "middle")
	  .attr("font-size", "12px")
	  .attr("font-weight", "bold");
}

function stackedChart(choice, state) {
	d3.select("#canvas-svg").selectAll("svg").remove();
	map();
	
	console.log(state);
	
	if (state == '') {
		state = global_state_stack;
	} else {
		global_state_stack = state;
	}
	
	if (choice == '') {
		choice = global_choice_stack;
	} else {
		global_choice_stack = choice;
	}
	console.log("http://localhost:5000/api/stack/" + state + '/' + choice);
	
	
    d3.json("http://localhost:5000/api/stack/" + state + '/' + choice, function (error, data) {
		if (choice == 'v_gender' || choice == 'p_gender') {
			gender_stackedChartRender(data, state);
		} else if (choice == 'v_age' || choice == 'p_age') {
			age_stackedChartRender(data, state);
		} else if (choice == 'v_race' || choice == 'p_race') {
			race_stackedChartRender(data, state);
		} 
    });
}