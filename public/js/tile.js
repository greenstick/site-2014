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

	var Tile = function (args) {
		var tile 			= 		this;
			tile.parent		=		args.parent,
			tile.element	=		args.element,
			tile.ratio		=		args.ratio,
			tile.width		=		args.width,
			tile.height 	=		args.width * args.ratio,
			tile.id 		= 		args.id,
			tile.data 		= 		args.data
	};

	/*
	Basic Methods
	*/

	//Create Tile Element
	Tile.prototype.create 	=		function () {
		var tile = this;
		$(tile.parent)
			.append("<div></div>")
			.children().attr("id", tile.id)
			.addClass(tile.element)
			.css({"width": tile.width, "height": tile.height})
			.data(tile.data);
	};

	//Scale Element
	Tile.prototype.scale	=		function (scale) {
		var tile = this;
		$(tile.element).width(tile.width * scale).height(tile.height * scale);
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