/*
Explorer Prototype

@params {
	parent: 		string (cached, optional)
	element: 		string (cached, optional)
	tile: 			string (cached, optional)
	filter: 		string (cached, optional)
	loader: 		string (cached, optional)
	focus: 			string (cached, optional)
	duration: 		string (cached, optional)
	routes: 		object (required)
		getTiles: 		string (optional)
}
*/

	var Explorer = function (args) {
		var explr = this;
			explr.parent 		= args.parent 		|| explr.parent 		|| "#wrapper",
			explr.element 		= args.element 		|| explr.element 		|| "#explorer",
			explr.tile 			= args.tile 		|| explr.tile 			|| ".tile",
			explr.filter 		= args.filter 		|| explr.filter 		|| ".filter",
			explr.loader 		= args.loader 		|| explr.loader 		|| ".loader",
			explr.focus 		= args.focus 		|| explr.focus 			|| ".focus",
			explr.duration 		= args.duration 	|| explr.duration 		|| 600,
			explr.routes 		= {
				getTiles: 		args.routes.getTiles 	|| "getTiles"
			},
			explr.settings 		= {
				parent: 		explr.parent,
				element: 		explr.element,
				tile: 			explr.tile,
				filter: 		explr.filter,
				loader: 		explr.loader,
				duration: 		explr.duration,
				data: 			explr.data
			},
			explr.tiles 		= [],
			explr.data;
	};

/*
Utility Methods
*/

	Explorer.prototype.reset 			= function (args) {
		this.parent 			= args.parent 		|| this.settings.parent,
		this.element 			= args.element 		|| this.settings.element,
		this.tile 				= args.tile 		|| this.settings.tile,
		this.filter 			= args.filter 		|| this.settings.filter,
		this.loader 			= args.loader 		|| this.settings.loader,
		this.focus 				= args.focus 		|| this.settings.focus,
		this.duration 			= args.duration 	|| this.settings.duration;
	};

/*
Basic UI Methods
*/
	Explorer.prototype.toggleLoader 	= function () {
		var explr = this;
		console.log(explr.loader);
		console.log(explr.duration);
		$(explr.loader).toggleFade(explr.duration);
	};

/*
API Request Methods
*/

	
	Explorer.prototype.getData 			= function () {
		var explr = this, data;
		// explr.toggleLoader();
		$.ajax({
			type: "GET",
			url: explr.routes.getTiles
		}).done(function (res) {
			explr.data = res;
		}).fail(function () {
			console.debug("XHR Status: Failed");
		}).always(function () {
			// explr.toggleLoader();
		});
	};

/*
Tile Manipulation Methods
*/

	//Create a Tile
	Explorer.prototype.createTile 		= function (data) {
		var explr = this,
		tile = new Tile ({
			parent: 		explr.element,
			element: 		explr.tile,
			width: 			explr.width,
			ratio: 			explr.ratio,
			content: 		data
		});
		explr.tiles.push(tile);
	};

	//Generate Tiles From Data Array
	Explorer.prototype.generateTiles 	= function () {
		for (var i = 0; i < this.data.length; i++) {
			this.createTile(this.data[i]);
		};
	};

	//Filter Tiles
	Explorer.prototype.filterTiles 		= function (filter) {
		var explr = this;
		$(explr.tile).removeClass(explr.focus);
		$(filter).addClass(exprl.focus);
	};

/*
Macro Methods
*/

	Explorer.prototype.init 			= function () {
		this.getData();
		this.generateTiles();
		//ajax for data
		//foreach data object create tile
	};

	Explorer.prototype.update 			= function () {

	};