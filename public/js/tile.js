/*
Tile Prototype

@Params - Object
		
		- Object.parent  (String)
		- Object.element (String)
		- Object.width	 (Number)
		- Object.ratio	 (Integer)
		- Object.content (Object)

Dependencies
		
		- D3.js

*/


var Tile = function (args) {
	var tile 			= 		this;
		tile.parent		=		args.parent,
		tile.element	=		args.element,
		tile.width		=		args.width,
		tile.ratio		=		args.ratio,
		tile.content	=		args.content,
		tile.height 	=		args.width * args.ratio,
		
/*
Basic Methods
*/

		//Create Tile Element
		tile.create 	=		function () {
			d3.select(tile.parent).append("div")
				.attr("id", tile.element)
				.attr("width", tile.width)
				.attr("height", tile.height);
		};

		tile.scale		=		function (scale) {
			d3.select(tile.element)
				.attr("width", tile.width * scale)
				.attr("height", tile.height * scale)
		};

};


/*
Macro Methods
*/

Tile.prototype.init 	= 		function () {
	this.create;
};

Tile.prototype.update 	= 		function (args) {
	this.scale(args.scale)
};