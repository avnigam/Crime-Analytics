var current_year = 2004;
var current_state = "New York";

function parallel_plot(plotdata) {
	var margin = {top: 30, right: 100, bottom: 20, left: 100},
		width = 1000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var dimensions = [
	  {
		name: "victim sex",
		scale: d3.scale.ordinal().rangePoints([0, height]),
		type: "string"
	  },
	  {
		name: "victim age",
		scale: d3.scale.linear().range([0, height]),
		type: "number"
	  },
	  {
		name: "victim race",
		scale: d3.scale.ordinal().rangePoints([0, height]),
		type: "string"
	  },
	  {
		name: "relationship",
		scale: d3.scale.ordinal().rangePoints([0, height]),
		type: "string"
	  },
	  {
		name: "perpetrator race",
		scale: d3.scale.ordinal().rangePoints([0, height]),
		type: "string"
	  },
	  {
		name: "perpetrator age",
		scale: d3.scale.linear().range([0, height]),
		type: "number"
	  },
	  {
		name: "perpetrator sex",
		scale: d3.scale.ordinal().rangePoints([0, height]),
		type: "string"
	  },
	];

	var x = d3.scale.ordinal()
		.domain(dimensions.map(function(d) { return d.name; }))
		.rangePoints([0, width,+15]);

	var line = d3.svg.line()
		.defined(function(d) { return !isNaN(d[1]); });

	var yAxis = d3.svg.axis()
		.orient("left");

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dimension = svg.selectAll(".dimension")
		.data(dimensions)
	  .enter().append("g")
		.attr("class", "dimension")
		.attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

	var data = d3.csv.parse(plotdata, function (d) {
        return d;
    });
	  dimensions.forEach(function(dimension) {
		dimension.scale.domain(dimension.type === "number"
			? d3.extent(data, function(d) { return +d[dimension.name]; })
			: data.map(function(d) { return d[dimension.name]; }).sort());
	  });

	  svg.append("g")
		  .attr("class", "background")
		.selectAll("path")
		  .data(data)
		.enter().append("path")
		  .attr("d", draw);

	  svg.append("g")
		  .attr("class", "foreground")
		.selectAll("path")
		  .data(data)
		.enter().append("path")
		  .attr("d", draw);

	  dimension.append("g")
		  .attr("class", "axis")
		  .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
		.append("text")
		  .attr("class", "title")
		  .attr("text-anchor", "middle")
		  .attr("y", -9)
		  .text(function(d) { return d.name; });

	  var ordinal_labels = svg.selectAll(".axis text")
		  .on("mouseover", mouseover)
		  .on("mouseout", mouseout);

	  var projection = svg.selectAll(".background path,.foreground path")
		  .on("mouseover", mouseover)
		  .on("mouseout", mouseout);

	  function mouseover(d) {
		svg.classed("active", true);

		// this could be more elegant
		if (typeof d === "string") {
		  projection.classed("inactive", function(p) { return p.name !== d; });
		  projection.filter(function(p) { return p.name === d; }).each(moveToFront);
		  ordinal_labels.classed("inactive", function(p) { return p !== d; });
		  ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
		} else {
		  projection.classed("inactive", function(p) { return p !== d; });
		  projection.filter(function(p) { return p === d; }).each(moveToFront);
		  ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
		  ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
		}
	  }

	  function mouseout(d) {
		svg.classed("active", false);
		projection.classed("inactive", false);
		ordinal_labels.classed("inactive", false);
	  }

	  function moveToFront() {
		this.parentNode.appendChild(this);
	  }

	function draw(d) {
	  return line(dimensions.map(function(dimension) {
		return [x(dimension.name), dimension.scale(d[dimension.name])];
	  }));
	}
}

function parallel_csv(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	str = 'perpetrator age,perpetrator race,perpetrator sex,relationship,victim age,victim race,victim sex' + '\r\n';

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

function parallel(state, year) {
    d3.json('http://localhost:5000/api/parallel', function (error, data) {
        var csv = parallel_csv(data);
        parallel_plot(csv);
    });
}