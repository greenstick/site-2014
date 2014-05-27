$(document).ready(function () {

	/**
	 *	Iris Class
	 **/

	Iris = function (r1, r2, strokeWidth, strokeColor, colors, days, sports) {
		//Defining variables
		var pi = Math.PI;
		var iris = this;
			iris.inner = r1;
			iris.outer = r2;
			//Validating correct radius input order
			if (iris.inner > iris.outer) {
				var outer = iris.inner;
				iris.inner = iris.outer;
				iris.outer = outer;
			};
			iris.height = (iris.outer*4);
			iris.width = (iris.outer*4);
			iris.strokeWidth = strokeWidth;
			iris.strokeColor = strokeColor;
			iris.colors = colors;
			iris.rings = days;
			iris.segments = sports;
			iris.segmentWidth = iris.segments/360;
			//Calculating areas and circumference
			iris.innerArea = function () {
				return (iris.inner * iris.inner * pi);
			};
			iris.outerArea = function () {
				return (iris.outer * iris.outer * pi);
			};
			iris.innerCircum = function () {
				return (iris.inner * 2 * pi);
			};
			iris.outerCircum = function () {
				return (iris.outer * 2 * pi);
			};
			//Creating SVG element
			$('.iris').width(iris.width).height(iris.height).css("left", - iris.width/4).css("top", - iris.height/8);
			var svg = d3.select('.iris').append("svg")
				.attr("width", iris.width)
				.attr("height", iris.height)
				.attr("transform", "translate(" + iris.width/4 + ", " + iris.height/4 + ")");

			//Generating iris through params & appending data
			iris.draw = function (outer, inner, strokeColor, strokeWidth, rings, segments, colors) {
				var ringWidth = (outer - inner)/rings;
				for(var i = 0; i < days; i++) {
					for(var j = 1; j < segments; j++) {
						var random = Math.random();
						var arc = d3.svg.arc()
							.innerRadius(inner + (ringWidth * i * j))
							.outerRadius(outer + (ringWidth * i * j + 1))
							.startAngle((((360/segments) * (i / j) / (j / i * pi)) + 0) * (pi/180))
							.endAngle((((360/segments) * (i / j) / (j / i * pi)) + pi) * (pi/180));
								svg.append("path")
									.attr("d", arc)
									.attr("class", "arc")
									.attr("fill", 'transparent')
									.attr("stroke", '#00001F')
									.attr("stroke-width", iris.strokeWidth + "px")
									.attr("transform", "translate(" + iris.width/2 + ", " + iris.height/2 + ")");
					};
				};
			};
			iris.animate = function () {
				d3.selectAll('.arc').each(function () {
					d3.select(this)
						.transition()
						.duration(5000)
						.ease("linear")
						.style("stroke", '#' + Math.floor(Math.random()*16777215).toString(16));
				});
			};
			iris.text = function () {
				d3.select('.info').each(function () {
					d3.select(this)
						.transition()
						.duration(1000)
						.ease("linear")
						.style("color", '#' + Math.floor(Math.random()*16777215).toString(16))
				});
			};
			iris.animateInterval = setInterval(function () {
				iris.animate();
			}, 5000);
			iris.textInterval = setInterval(function () {
				iris.text()
			}, 1000)

		//Drawing iris
			iris.draw(iris.outer, iris.inner, iris.strokeColor, iris.strokeWidth, iris.rings, iris.segments);
			iris.animate();
			iris.text('.info');
		};
	var Iris = new Iris(2000, 25, 4, '#000000', '#FFFFFF', 100, 4);
});
