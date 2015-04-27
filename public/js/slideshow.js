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
			show.container 	= "#" + show.id + " " + config.container 	|| "#" + show.id + " .tile",
			show.element 	= "#" + show.id + " " + config.element 		|| "#" + show.id + " .slideshow",
			show.slide 		= "#" + show.id + " " + config.slide 		|| "#" + show.id + " .image",
			show.navigation = "#" + show.id + " " + config.navigation 	|| "#" + show.id + " .navigation",
			show.direction 	= config.direction 							|| "left",
			show.duration 	= config.duration 							|| 600,
			show.easing 	= config.easing 							|| "linear",
			show.width 		= config.width 								|| 600,
			show.height 	= config.height 							|| 600,
			show.length 	= config.width * show.data.files.length,
			show.position 	= 0,
			show.home 		= 0;
			console.log($(show.slide));
		return show
	},
	update: function () {

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