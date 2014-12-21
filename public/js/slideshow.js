/*
Basic Slideshow Prototype
Author: Ben Cordier
Dependencies: jQuery
*/

var Slideshow = function (config) {
	this.init(config)
	return this
};

Slideshow.prototype = {
	init: function (config) {
		var show = this;
			show.id 		= config.id,
			show.data 		= config.data,
			show.container 	= show.id + " " + config.container 	|| show.id + " .tile",
			show.element 	= show.id + " " + config.element 	|| show.id + " .slideshow",
			show.slide 		= show.id + " " + config.slide 		|| show.id + " .slide",
			show.navigation = show.id + " " + config.navigation || show.id + " .navigation",
			show.direction 	= config.direction 					|| "left",
			show.duration 	= config.duration 					|| 600,
			show.easing 	= config.easing 					|| "linear",
			show.width 		= config.width 						|| "100%",
			show.height 	= config.height 					|| "100%",
			show.eventHooks = {
				next: ".next",
				prev: ".prev"
			},
			show.index 		= 0;
		return show
	},
	update: function () {

	},
	animate: function (args) {
		var selector = args.selector, duration = args.duration, animation = {};
 			animation[args.attr] = args.value;
 		return $(selector).stop().animate(animation, duration);
	},
	next: function () {
		var show = this;
		console.log("meow");
		show.animate({
			selector: show.slide,
			duration: show.duration,
			attr 	: show.direction,
			value 	: show.width
		});
	},
	previous: function () {
		var show = this;
		console.log("meow");
		show.animate({
			selector: show.slide,
			duration: show.duration,
			attr 	: show.direction,
			value 	: show.width
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