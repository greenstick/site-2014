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
			show.slide 		= "#" + show.id + " " + config.slide 		|| "#" + show.id + " .slide",
			show.navigation = "#" + show.id + " " + config.navigation 	|| "#" + show.id + " .navigation",
			show.direction 	= config.direction 							|| "left",
			show.duration 	= config.duration 							|| 600,
			show.easing 	= config.easing 							|| "linear",
			show.width 		= config.width 								|| "100%",
			show.height 	= config.height 							|| "100%",
			show.length 	= config.width * show.data.files.length,
			show.position 	= 0,
			show.home 		= 0;
			$(show.element).width(show.length);
		return show
	},
	update: function () {

	},
	animate: function (args) {
		var selector = args.selector, duration = args.duration, animation = {};
		animation[args.attr] = args.value;
 		return $(selector).stop().animate(animation, duration);
	},
	style: function (args) {
		var selector = args.selector, style = {}; 
		style[args.attr] = args.value;
 		return $(selector).css(style);
	},
	next: function (e) {
		var show = this;
		e.stopPropagation();
		if (show.position - show.width * (show.length / show.width) < - show.length) {
			show.position = show.home;
			show.style({
				selector: show.element,
				attr 	: show.direction,
				value 	: show.home - show.width + "px"
			});
		} else {
			show.position = show.position - show.width;
		};
		show.animate({
			selector: show.element,
			duration: show.duration,
			attr 	: show.direction,
			value 	: show.position + "px"
		});
	},
	prev: function (e) {
		var show = this;
		e.stopPropagation();	
		if (show.position + show.width * (show.length / show.width) > show.home) {
			show.position = show.home;
			show.style({
				selector: show.element,
				attr 	: show.direction,
				value 	: show.home + show.width + "px"
			});
		} else {
			show.position = show.position + show.width;
		};
		show.animate({
			selector: show.element,
			duration: show.duration,
			attr 	: show.direction,
			value 	: show.position + "px"
		});
	},
	to: function () {

	},
	home: function () {

	},
	pause: function () {

	},
	transition: function () {

	}
};