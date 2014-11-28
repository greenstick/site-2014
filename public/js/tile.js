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

var Tile = function (config) {
	this.init(config);
};

Tile.prototype = {

	/*
	Macro Methods
	*/

	//Initialize
	init: function (config) {
		var tile 				= this;
			tile.parent			= config.parent,
			tile.element		= config.element,
			tile.ratio			= config.ratio,
			tile.width			= ko.observable(config.width),
			tile.height 		= ko.observable(config.width * config.ratio),
			tile.id 			= ko.observable(config.data().projectUUID),
			tile.tags 			= ko.observable(config.data().tags),
			tile.data 			= ko.observable(config.data()),
			tile.tags(tile.sanitizeTags());
	},

	//Update
	update: function (args) {
		this.scale(args.scale);
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
	sanitizeTags: function () {
		var tile = this, tagStr = '', tags = tile.tags(), length = tags.length;
		for (var i = 0; i < length; i++) {
			var tag  	= (i + 1 === length) ? (tags[i]).toString().trim().split(",").join("").split("#").join("") : (tags[i]).toString().trim().split(",").join("").split("#").join("") + " ",
				tagStr 	= (tag === " ") ? tagStr : tagStr += tag;
		};
		return tagStr;
	}
};