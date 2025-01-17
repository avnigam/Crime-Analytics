function line(year) {
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.scale.ordinal().rangeRoundBands([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(5);

	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(5);

	// Define the line
		
	// Adds the svg canvas
	var svg = d3.select("body")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", 
				  "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.csv("line.csv", function(error, data) {
		data.forEach(function(d) {
			if (d.year == year) {
				d.month = +d.month;
				d.count = +d.count;
			}
		});
		
		var valueline = d3.svg.line()
		.x(function(d) { return x(data.map(function(d) { return d.month; })); })
		.y(function(d) { return y(d.count); });

		// Scale the range of the data
		//x.domain(d3.extent(data, function(d) { return d.month; }));
		x.domain(data.map(function(d) { return d.month; }));
		y.domain([0, d3.max(data, function(d) { return d.count; })]);

		// Add the valueline path.
		svg.append("path")
			.attr("class", "line")
			.attr("d", valueline(data));

		// Add the X Axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Add the Y Axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	});
}