var Tile = function (config) {
	this.init(config);
};

/*
Tile Prototype

@Params
		- Object
		- Object.id 	 	(String)
		- Object.parent  	(String)
		- Object.element 	(String)
		- Object.width	 	(Number)
		- Object.ratio	 	(Number)
		- Object.content 	(Object)
*/

Tile.prototype = {

	/*
	Macro Methods
	*/

	//Initialize
	init: function (config) {
		var tile 			= this;
			tile.parent		= config.parent,
			tile.element	= config.element,
			tile.ratio		= config.ratio,
			tile.width		= ko.observable(config.width),
			tile.height 	= ko.observable(config.width * config.ratio),
			tile.id 		= ko.observable(config.data().projectUUID),
			tile.tags 		= ko.observable(tile.sanitizeTags(config.data().tags)),
			tile.data 		= config.data,
			tile.type 		= ko.observable(config.data().type.toLowerCase()),
			tile.content 	= {},
			tile.settings 	= {
				parent			: tile.parent,
				element 		: tile.element,
				ratio 			: tile.ratio,
				width 			: tile.width(),
				height 			: tile.height(),
				id 				: tile.id(),
				tags 			: tile.tags(),
				data 			: tile.data()
			};
		tile.setContent(tile.type(), tile.id(), tile.data());
	},

	//Set Tile Type
	setContent: function (type, id, data) {
		var tile 	= this,
			types 	= {
				slideshow 	: function (id, data) {
					var config = {
						id 			: id,
						data 		: data,
						container 	: ".tile",
						element 	: ".slideshow",
						slide 		: ".image",
						navigation 	: ".navigation",
						direction 	: "left",
						duration 	: 900,
						easing 		: "linear",
						width	 	: 600,
						height 		: 600
					};
					tile.content = new Slideshow(config);
					return tile.content;
				},
				blogpost 	: function (id, data) {
					var config = {
						id			: id,
						data 		: data 
					};
					tile.content = new Blogpost(config);
					return tile.content;
				},
				soundcloud 	: function (id, data) {
					var config = {
						id 			: id,
						data 		: data
					};
					tile.content = new Soundcloud(config);
					return tile.content;
				},
				instagram 	: function (id, data) {
					var config = {
						id 	 		: id,
						data 		: data
					};
					tile.content = new Instagram(config);
					return tile.content;
				},
				iframe 		: function (id, data) {
					var config = {

					};
					tile.content = new Iframe(config);
					return tile.content
				},
				default 	: function (id, data) {
					console.log("Init Default Tile Rendering");
					var config = {
						id 			: id,
						data 		: data
					}
					tile.content = new Default(config);
					return tile.content;
				},
				error 		: function (id, data, e) {
					var error = {
						id			: id,
						data 		: data,
						e 			: e
					};
					tile.content = null;
					console.log(error);
					return tile.content;
				}
			};
		console.log(type);
		try {
			return types[type](id, data);
		} catch (e) {
			console.log("Error Rendering Tile:", "\n\t ID:", id, "\n\t Message:", e.message, "\n\t Type Data:", data.type);
			return types["default"](id, data);
		}
	},

	/*
	Basic Methods
	*/

	// Scale Element
	scale: function (scale) {
		var tile = this;
		$(tile.element).width(tile.width * scale).height(tile.height * scale);
	},

	// Sanitizes Tags for Rendering to Tile Data Attribute
	sanitizeTags: function (tags) {
		var tile = this, tagStr = '', length = tags.length;
		for (var i = 0; i < length; i++) {
			var tag  	= (i + 1 === length) ? (tags[i]).toString().trim().split(",").join("").split("#").join("") : (tags[i]).toString().trim().split(",").join("").split("#").join("") + " ",
				tagStr 	= (tag === " ") ? tagStr : tagStr += tag;
		};
		tagStr = tagStr.toLowerCase();
		return tagStr;
	},
	toggle: function () {
		return this;
	}
};

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