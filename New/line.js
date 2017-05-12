var current_year = 2004;
var current_state = "New York";
var choice = "murder";

function line_plot(plotdata, year) {
	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 900 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;
	 
	var x = d3.scale.ordinal()
		.rangePoints([0, width], 1);

	var	y = d3.scale.linear().range([height, 0]);
	 
	// Define the axes
	var	xAxis = d3.svg.axis().scale(x)
		.orient("bottom");
	 
	var	yAxis = d3.svg.axis().scale(y)
		.orient("left");
	 
	// Define the line
	var	valueline = d3.svg.line()
		.x(function(d) { return x(d.month); })
		.y(function(d) { return y(d.count); });
		
	// Adds the svg canvas
	var	svg = d3.select("#line_chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	// Get the data
	var data = d3.csv.parse(plotdata, function (d) {
        return d;
    });
	
		// Scale the range of the data
		x.domain(data.map(function(d) { return d.month; }));
		//x.domain(d3.extent(data, function(d) { return d.date; }));
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
			
		svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 0 - margin.left)
		  .attr("x",0 - (height / 2))
		  .attr("dy", "1em")
		  .style("text-anchor", "middle")
		  .text("Number of Murders");   

}

function line_csv(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	str = 'count,month' + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function line(state, year) {
	d3.select("#line_chart").selectAll("svg").remove();
    d3.json('http://localhost:5000/api/line/' + year + "/" + state, function (error, data) {
        var csv = line_csv(data);
        line_plot(csv, year);
    });
}