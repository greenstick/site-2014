var Iris = function (args) {
	var iris 				= 		this;
		iris.inner 			= 		args.inner,
		iris.outer 			= 		args.outer,
		iris.element 		= 		args.element,
		iris.width 			= 		args.width,
		iris.height 		= 		args.height,
		iris.strokeWidth 	= 		args.strokeWidth,
		iris.rings 			= 		args.rings,
		iris.segments 		=		args.segments,
		iris.dimensions 	= 		{},
		iris.colors 		= 		["#24404F", "#263B45", "#353332", "#41312A", "#4F2F22"], //http://www.colourlovers.com/palette/96035/Son_of_Rothko
		iris.svg,
		iris.interval
};

/*
'Private' Methods
*/

		// Sets Inner Circle Dimension to Smallest & Outer Circle Dimension to Largest
		Iris.prototype.setDimensions = function () {
			var outer, dimensions;
				this.inner > this.outer ? (
					outer 				= 	this.inner, 
					this.inner 			= 	this.outer, 
					this.outer 			= 	outer, 
					this.dimensions 	= 	{inner: this.inner, outer: this.outer}) : 
					this.dimensions 	= 	{inner: this.inner, outer: this.outer};
			return  this.dimensions;
		};

		// Sets Iris Element Dimensions and Creates SVG Container
		Iris.prototype.styleElement = function () {
			var element = $(this.element);
				element.width(iris.width).height(iris.height).css("left", - 400).css("top", 0);
				this.svg 	= 	d3.selectAll(iris.element).append("svg").attr("width", iris.width).attr("height", iris.height);
		};

		// Draws Iris
		Iris.prototype.draw = function () {
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
							startAngle	= 	(((360 / segments) * (i * j) / (j / i * Math.PI)) + Math.PI) * (Math.PI / 180),
							endAngle 	= 	(((360 / segments) * (i * j) / (j / i * Math.PI)) + (Math.PI * 2)) * (Math.PI / 180),
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
		Iris.prototype.animate = function () {
			d3.selectAll('.arc').each(function () {
				d3.select(this)
					.transition()
					.duration(1000)
					.ease("easeOutCirc")
					.style("stroke", "#" + Math.floor(Math.random() * 16777215).toString(16));
					// "#" + Math.floor(Math.random() * 16777215).toString(16)  Random Color Generator
			});
		};

		//Change Color
		Iris.prototype.animateInterval = function (flag) {
			var iris = this;
			if (flag === true) {
				iris.interval = setInterval(function () {
					iris.animate();
				}, 500);
			} else {
				clearInterval(iris.interval);
				setTimeout(function () {
					d3.selectAll('.arc').each(function () {
						d3.select(this).style("stroke", "rgba(33, 43, 67, 1)");
					});
				}, 1000);
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
		width 		: 	2000,
		height 		: 	2000,
		inner 		: 	60,
		outer 		: 	80,
		strokeWidth : 	2,
		rings 		: 	2,
		segments 	: 	160
	},
	iris = new Iris(args);
	iris.init();

/*
Event Bindings
*/

//Enter Hover On
$('.enter').on("mouseover", function () {
	iris.animateInterval(true);
});
//Enter Hover Off
$('.enter').on("mouseout", function () {
	iris.animateInterval(false);
});