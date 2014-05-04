var Iris = function (args) {
	var iris 				= 		this,
		pi 					= 		Math.PI;
		iris.inner 			= 		args.inner,
		iris.outer 			= 		args.outer,
		iris.element 		= 		args.element,
		iris.width 			= 		args.width,
		iris.height 		= 		args.height,
		iris.strokeWidth 	= 		args.strokeWidth,
		iris.rings 			= 		args.rings,
		iris.segments 		=		args.segments,
		iris.dimensions 	= 		{},
		iris.svg,
		iris.interval;

/*
'Private' Methods
*/

		// Sets Inner Circle Dimension to Smallest & Outer Circle Dimension to Largest
		iris.setDimensions = function () {
			var outer, dimensions;
				this.inner > this.outer ? (
					outer 			= 	this.inner, 
					this.inner 		= 	this.outer, 
					this.outer 		= 	outer, 
					this.dimensions = 	{inner: this.inner, outer: this.outer}) : 
					this.dimensions = 	{inner: this.inner, outer: this.outer};
			return this.dimensions;
		};
		// Determines Arc Width
		iris.segmentWidth = function () {
			return iris.segments/360;
		};
		// Determined Inner Area
		iris.innerArea = function () {
			return (iris.inner * iris.inner * pi);
		};
		// Determines Outer Area
		iris.outerArea = function () {
			return (iris.outer * iris.outer * pi);
		};
		// Determines Inner Circumference
		iris.innerCirc = function () {
			return (iris.inner * 2 * pi);
		};
		// Determines Outer Circumference
		iris.outerCirc = function () {
			return (iris.outer * 2 * pi);
		};
		// Sets Iris Element Dimensions and Creates SVG Container
		iris.styleElement = function () {
			var element = $(this.element);
				element.width(iris.width).height(iris.height).css("left", 0).css("top", 0);
				this.svg 	= 	d3.selectAll(iris.element).append("svg")
									.attr("width", iris.width)
									.attr("height", iris.height)
									.attr("transform", "translate(" + iris.width/4 + ", " + iris.height/4 + ")");
		};
		// Draws Iris
		iris.draw = function () {
			var outer 		= 	this.dimensions.outer,
				inner 		= 	this.dimensions.inner,
				rings 		= 	this.rings,
				segments 	= 	this.segments,
				ringWidth	= 	(outer - inner) / rings;
				//Calculate Arc Dimensions
				for (var i = 0; i < segments; i++) {
					for (var j = 1; j < rings; j++) {
						var innerRadius = 	inner + (ringWidth * i * j),
							outerRadius = 	outer + (ringWidth * i * (j + 1)),
							startAngle	= 	(((360 / segments) * (i * j) / (j / i * pi)) + pi) * (pi / 180),
							endAngle 	= 	(((360 / segments) * (i * j) / (j / i * pi)) + (pi * 2)) * (pi / 180),
							arc 		= 	d3.svg.arc()
												.innerRadius(innerRadius)
												.outerRadius(outerRadius)
												.startAngle(startAngle)
												.endAngle(endAngle);
							//Draw Arc
							this.svg.append("path")
								.attr("d", arc)
								.attr("class", "arc")
								.attr("fill", "transparent")
								.attr("stroke", "rgba(33, 43, 67, 1)")
								.attr("stroke-width", iris.strokeWidth + "px")
								.attr("transform", "translate(" + iris.width/2 + ", " + iris.height/2 + ")");
					};
				};
		};
		//Animates Iris
		iris.animate = function () {
			d3.selectAll('.arc').each(function () {
				d3.select(this)
					.transition()
					.duration(100)
					.ease("easeOutCirc")
					.style("stroke", "#" + Math.floor(Math.random() * 16777215).toString(16));
			});
		};
		//Change Color
		iris.animateInterval = function () {
			iris.interval = setInterval(function () {
				iris.animate();
			}, 100);
		};
		//Reset Color
		iris.resetColor = function (callback) {
			d3.selectAll('.arc').each(function () {
				d3.select(this)
					.transition()
					.duration(0)
					.ease("easeOutCirc")
					.style("stroke", "rgba(33, 43, 67, 1)");
			});
			typeof callback == 'function' ? callback() : void (0)
		};
};

/*
Public Methods
*/

Iris.prototype.init = function () {
	this.setDimensions();
	this.styleElement();
	this.draw();
};

/*
Instantiation
*/

var args = {
		element		: 	".iris",
		width 		: 	1200,
		height 		: 	2000,
		inner 		: 	40,
		outer 		: 	80,
		strokeWidth : 	2,
		rings 		: 	2,
		segments 	: 	20
	},
	iris = new Iris(args);
	iris.init();

/*
Event Bindings
*/

//Enter Hover On
$('.enter').on("mouseover", function () {
	iris.animateInterval();
});
//Enter Hover Off
$('.enter').on("mouseout", function () {
	iris.resetColor(function () {
		clearInterval(iris.interval);
	});
});