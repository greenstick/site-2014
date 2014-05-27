/*
Tile Prototype

@Params - Object
		- Object.id 	 	(String)
		- Object.parent  	(String)
		- Object.element 	(String)
		- Object.width	 	(Number)
		- Object.ratio	 	(Number)
		- Object.content 	(Object)

Dependencies
		
		- D3.js
*/

(function () {

	var Tile = function (args) {
		var tile 			= 		this;
			tile.parent		=		args.parent,
			tile.element	=		args.element,
			tile.width		=		args.width,
			tile.ratio		=		args.ratio,
			tile.content	=		args.content,
			tile.height 	=		args.width * args.ratio		
	};

	/*
	Basic Methods
	*/

	//Create Tile Element
	Tile.prototype.create 	=		function () {
		d3.select(this.parent).append("div")
			.attr("id", 	this.id)
			.attr("class",  this.element)
			.attr("width",  this.width)
			.attr("height", this.height);
	};

	//Scale Element
	Tile.prototype.scale	=		function (scale) {
		d3.select(this.element)
			.attr("width",  this.width * scale)
			.attr("height", this.height * scale);
	};

/*
Macro Methods
*/


	Tile.prototype.init 	= 		function () {
		this.create();
	};

	Tile.prototype.update 	= 		function (args) {
		this.scale(args.scale)
	};

}(d3))