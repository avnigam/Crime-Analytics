var global_year_bar = 2004;
var global_state_bar = "New York";
var global_choice_bar = "weapon";

function bar_plot(plotdata) {
	var margin = {top: 20, right: 10, bottom: 30, left: 40},
    width = 810 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#bar_chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	function type(d) {
		d.frequency = +d.frequency;
		return d;
	}
	
	var data = d3.csv.parse(plotdata, type, function (d) {
        return d;
    });
	

		x.domain(data.map(function(d) { return d.data; }));
		y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -15)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Frequency");

		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.data); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.frequency); })
			.attr("height", function(d) { return height - y(d.frequency); })
			.on("mouseover", function() { tooltip.style("display", null); })
			.on("mouseout", function() { tooltip.style("display", "none"); })
			.on("mousemove", function(d) {
				var xPosition = d3.mouse(this)[0] - 10;
				var yPosition = d3.mouse(this)[1] - 20;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				tooltip.select("text").text(d.frequency);
			});
		  
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

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	str = 'frequency,data' + '\r\n';

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

function bar(choice, state, year) {
	d3.select("#bar_chart").selectAll("svg").remove();
	
	if (state == '') {
		state = global_state_bar;
	} else {
		global_state_bar = state;
	}
	
	if (choice == '') {
		choice = global_choice_bar;
	} else {
		global_choice_bar = choice;
	}
	
	if (year == 0) {
		year = global_year_bar;
	} else {
		global_year_bar = year;
	}
	
    d3.json('http://localhost:5000/api/bar/' + year + '/' + state + '/' + choice, function (error, data) {
        var csv = ConvertToCSV(data);
        bar_plot(csv);
    });
}