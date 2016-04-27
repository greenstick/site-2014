/*
Basic Slideshow Prototype
Author: Ben Cordier
Dependencies: jQuery
*/

var Slideshow = function (config) {
	this.init(config);
	return this;
};

Slideshow.prototype = {
	init: function (config) {
		var show = this;
			show.id 		= config.id,
			show.data 		= config.data,
			show.container 	= typeof config.container  	=== 'string' ? "#" + show.id + " " + config.container 	: "#" + show.id + " .tile",
			show.element 	= typeof config.element  	=== 'string' ? "#" + show.id + " " + config.element 	: "#" + show.id + " .slideshow",
			show.slide 		= typeof config.slide 		=== 'string' ? "#" + show.id + " " + config.slide 		: "#" + show.id + " .image",
			show.navigation = typeof config.navigation  === 'string' ? "#" + show.id + " " + config.navigation 	: "#" + show.id + " .navigation",
			show.direction 	= typeof config.direction 	=== 'string' ? config.direction							: "left",
			show.duration 	= typeof config.duration 	=== 'number' ? config.duration 							: 600,
			show.easing 	= typeof config.easing 		=== 'string' ? config.easing 							: "linear",
			show.width 		= typeof config.width 		=== 'number' ? config.width 							: 600,
			show.height 	= typeof config.height 		=== 'number' ? config.height							: 600,
			show.length 	= config.width * show.data.files.length,
			show.position 	= 0,
			show.home 		= 0;
		return this;
	},
	next: function (e) {
		var show = this;
		e.stopPropagation();
		if ($(show.slide).hasClass('active') === false) $(show.slide).first().addClass('active');
		$(show.slide + '.active').removeClass('active').next().addClass('active');
		if ($(show.slide).hasClass('active') === false) $(show.slide).first().addClass('active');
	},
	prev: function (e) {
		var show = this;
		e.stopPropagation();
		if ($(show.slide).hasClass('active') === false) $(show.slide).last().addClass('active');
		$(show.slide + '.active').removeClass('active').prev().addClass('active');
		if ($(show.slide).hasClass('active') === false) $(show.slide).last().addClass('active');
	}
};