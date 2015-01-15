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
	//Update
	update: function (args) {

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
						direction 	: "left",
						duration 	: 550,
						easing 		: "linear",
						width	 	: 600,
						height 		: 600,
						navigation 	: ".navigation"
					};
					tile.content = new Slideshow(config);
					return tile.content
				},
				blogpost 	: function (id, data) {
					var config = {

					};
					tile.content = new Blogpost(config);
					return tile.content
				},
				soundcloud 	: function (id, data) {
					var config = {
						player 		: "",
						link 		: ""
					};
					tile.content = new Soundcloud(config);
					return tile.content
				},
				instagram 	: function (id, data) {
					var config = {

					};
					tile.content = new Instagram(config);
					return tile.content;
				},
				default 	: function (id, data) {
					console.log("Default tile render mode");
					// var config = {
					// 	id 			: id,
					// 	container 	: ".tile",
					// 	element 	: ".slideshow",
					// 	slide 		: ".slide",
					// 	direction 	: "left",
					// 	duration 	: 550,
					// 	easing 		: "linear",
					// 	width	 	: 600,
					// 	height 		: 600,
					// 	navigation 	: ".navigation"
					// };
					// tile.content =  new Slideshow(config);
					// return tile.content
				},
				error 		: function (id, data, e) {
					console.log("Error on tile render: ");
					console.log("\t", id);
					// console.log("\t", data);
					console.log("\t", e.message);
				}
			};
		try {
			return types[type](id, data);
		} catch (e) {
			return types["default"](id, data) || types["error"](e, id, data);
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

	}
};