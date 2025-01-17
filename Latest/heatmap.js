
function showHeatMapPlot(svg, year, plotdata) {
	var data = d3.csv.parse(plotdata, function (d) {
        return d;
    });

	  var config = {"color1":"#d3e5ff","color2":"#08306B","stateDataColumn":"state","valueDataColumn":"count", "year":"year"}



	  var COLOR_COUNTS = 2000;

	  var SCALE = 0.75;

		
	  function Interpolate(start, end, steps, count) {
		  var s = start,
			  e = end,
			  final = s + (((e - s) / steps) * count);
		  return Math.floor(final);
	  }

	  function Color(_r, _g, _b) {
		  var r, g, b;
		  var setColors = function(_r, _g, _b) {
			  r = _r;
			  g = _g;
			  b = _b;
		  };

		  setColors(_r, _g, _b);
		  this.getColors = function() {
			  var colors = {
				  r: r,
				  g: g,
				  b: b
			  };
			  return colors;
		  };
	  }

	  function hexToRgb(hex) {
		  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		  return result ? {
			  r: parseInt(result[1], 16),
			  g: parseInt(result[2], 16),
			  b: parseInt(result[3], 16)
		  } : null;
	  }

	  var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;

	  var rgb = hexToRgb(COLOR_FIRST);

	  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

	  rgb = hexToRgb(COLOR_LAST);
	  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

	  var MAP_STATE = config.stateDataColumn;
	  var MAP_VALUE = config.valueDataColumn;
	  var MAP_YEAR = config.year;



	  var valueById = d3.map();

	  var startColors = COLOR_START.getColors(),
		  endColors = COLOR_END.getColors();

	  var colors = [];

	  for (var i = 0; i < COLOR_COUNTS; i++) {
		var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
		var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
		var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
		colors.push(new Color(r, g, b));
	  }

	  var quantize = d3.scale.quantize()
		  .domain([0, 1.0])
		  .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));

	  var path = d3.geo.path();



	  d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {

	  name_id_map = {};
	  id_name_map = {};

	  for (var i = 0; i < names.length; i++) {
		name_id_map[names[i].name] = names[i].id;
		id_name_map[names[i].id] = names[i].name;
	  }

	  data.forEach(function(d) {
		if(d[MAP_YEAR] == year) {
			console.log(d[MAP_YEAR]);
			var id = name_id_map[d[MAP_STATE]];
			valueById.set(id, +d[MAP_VALUE]);
		}
	  });

	  quantize.domain([d3.min(data, function(d){ return +d[MAP_VALUE] }),
		d3.max(data, function(d){ return +d[MAP_VALUE] })]);
		

	  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
		svg.append("g")
			.attr("class", "states-choropleth")
		  .selectAll("path")
			.data(topojson.feature(us, us.objects.states).features)
		  .enter().append("path")
			.attr("transform", "scale(" + SCALE + ")")
			.style("fill", function(d) {
			  if (valueById.get(d.id)) {
				var i = quantize(valueById.get(d.id));
				var color = colors[i].getColors();
				return "rgb(" + color.r + "," + color.g +
					"," + color.b + ")";
			  } else {
				return "";
			  }
			})
			.attr("d", path)
			.on("mousemove", function(d) {
				var html = "";

				html += "<div class=\"tooltip_kv\">";
				html += "<span class=\"tooltip_key\">";
				html += id_name_map[d.id];
				html += "</span>";
				html += "<span class=\"tooltip_value\">";
				html += (valueById.get(d.id) ? valueById.get(d.id) : "");
				html += "";
				html += "</span>";
				html += "</div>";

				$("#tooltip-container").html(html);
				$(this).attr("fill-opacity", "0.8");
				$("#tooltip-container").show();

				var coordinates = d3.mouse(this);

				var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

				if (d3.event.layerX < map_width / 2) {
				  d3.select("#tooltip-container")
					.style("top", (d3.event.layerY + 15) + "px")
					.style("left", (d3.event.layerX + 15) + "px");
				} else {
				  var tooltip_width = $("#tooltip-container").width();
				  d3.select("#tooltip-container")
					.style("top", (d3.event.layerY + 15) + "px")
					.style("left", (d3.event.layerX - tooltip_width - 30) + "px");
				}
			})
			.on("mousedown", function(d) {
				console.log(id_name_map[d.id]);
				stackedChart();
			})
			.on("mouseout", function() {
					$(this).attr("fill-opacity", "1.0");
					$("#tooltip-container").hide();
				});

		svg.append("path")
			.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			.attr("class", "states")
			.attr("transform", "scale(" + SCALE + ")")
			.attr("d", path);
	  });

	  });

}

function heatmap_csv(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	str = 'count,state,year' + '\r\n';

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

function showHeatMap(svg,year) {
    d3.json('http://localhost:5000/api/heatmap', function (error, data) {
        var csv = heatmap_csv(data);
        showHeatMapPlot(svg,year,csv);
    });
}

function map() {
	var WIDTH = 700, HEIGHT = 500;
	var width = WIDTH,
	height = HEIGHT;
			  
	var svg = d3.select("#canvas-svg").append("svg")
			.attr("width", width)
			.attr("height", height);
			  
	var label = svg.append("text")
				.attr("class", "year label")
				.attr("text-anchor", "end")
				.attr("y", height - 24)
				.attr("x", width)
				.text(2004);
			
	function displayYear(year) {
		label.text(dragit.time.min + Math.round(year));
	}
		
	var change = 0	
	var last_time = 2004
	function update(v, duration) {
		dragit.time.current = v || dragit.time.current;
		displayYear(dragit.time.current)
		d3.select("#slider-time").property("value", dragit.time.current);
	}

	showHeatMap(svg, 2004);

	d3.select("#slider-time")
	.on("mousemove", function() { 
		update(parseInt(this.value), 100);
		if (last_time != dragit.time.current){
			last_time = dragit.time.current;
			change = 1;
		}
		if (change == 1) {
			showHeatMap(svg,last_time);
			change = 0;
		}
	})
}

