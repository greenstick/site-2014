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
			tile.data 		= ko.observable(config.data()),
			tile.type 		= config.data()["postType"].toLowerCase()
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
			tile.setType(tile.type, tile.id, tile.data);
	},
	//Update
	update: function (args) {

	},

	//Set Tile Type
	setType: function (type, id, data) {
		var tile 	= this,
			types 	= {
				slideshow 	: function (id) {
					config = {
						id 			: id,
						data 		: data(),
						container 	: ".tile",
						element 	: ".carousel",
						slide 		: ".image",
						direction 	: "left",
						duration 	: 550,
						easing 		: "linear",
						width	 	: 560,
						height 		: 560,
						navigation 	: ".navigation"
					};
					return new Slideshow(config)
				},
				blogpost 	: function (id) {
					config = tile.config.blogpost;
					return new Blogpost(config)
				},
				soundcloud 	: function (id) {
					config = tile.config.soundcloud;
					return new Soundcloud(config)
				},
				default 	: function (id) {
					config = {
						id 			: id,
						container 	: ".tile",
						element 	: ".slideshow",
						slide 		: ".slide",
						direction 	: "left",
						duration 	: 550,
						easing 		: "linear",
						width	 	: 560,
						height 		: 560,
						navigation 	: ".navigation"
					};
					return new Slideshow(config)
				},
				error 		: function () {
					return new TileError();
				}
			};
		return types[type]() || types["default"]() || types["error"];
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
	}
};