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

Dependencies	
		- D3.js
*/

	var Tile = function (args) {
		var tile 				= 		this;
			tile.parent			=		args.parent,
			tile.element		=		args.element,
			tile.ratio			=		args.ratio,
			tile.width			=		ko.observable(args.width),
			tile.height 		=		ko.observable(args.width * args.ratio),
			tile.id 			= 		ko.observable(args.data().pID),
			tile.tags 			= 		ko.observable(args.data().tags),
			tile.data 			= 		ko.observable(args.data())
	};

/*
Basic Methods
*/

	//Scale Element
	Tile.prototype.scale		=		function (scale) {
		var tile = this;
		$(tile.element).width(tile.width * scale).height(tile.height * scale);
	};

	//Sanitizes Tags for Rendering to Tile Data Attribute
	Tile.prototype.sanitizeTags = 		function () {
		var tile = this, tagStr = '', tags = tile.tags(), length = tags.length;
			for (var i = 0; i < length; i++) {
				var tag = (i + 1 === length) ? (tags[i]).toString().trim().split(",").join("").split("#").join("") : (tags[i]).toString().trim().split(",").join("").split("#").join("") + " ";
				tagStr = (tag === "" || tag === " ") ? tagStr : tagStr += tag;
			};
		return tagStr;
	};

/*
Macro Methods
*/


	Tile.prototype.init 		= 		function () {
		var tile = this;
			tile.tags(tile.sanitizeTags());
	};

	Tile.prototype.update 		= 		function (args) {
		this.scale(args.scale)
	};