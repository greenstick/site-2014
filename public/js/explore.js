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
			explr.parent 		= args.parent 			|| explr.parent 		|| "#wrapper",
			explr.element 		= args.element 			|| explr.element 		|| "#explorer",
			explr.tile 			= args.tile 			|| explr.tile 			|| "tile",
			explr.filter 		= args.filter 			|| explr.filter 		|| "filter",
			explr.loader 		= args.loader 			|| explr.loader 		|| "loader",
			explr.focus 		= args.focus 			|| explr.focus 			|| "focus",
			explr.duration 		= args.duration 		|| explr.duration 		|| 600,
			explr.routes 		= {
				retrieve 		: 						args.routes.retrieve 	|| "/retrieve",
				getTiles 		:  						args.routes.getTiles 	|| "/getTiles",
				getByTag		: 						args.routes.getByTag 	|| "/getByTag"
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
		this.parent 			= args.parent 			|| this.settings.parent,
		this.element 			= args.element 			|| this.settings.element,
		this.tile 				= args.tile 			|| this.settings.tile,
		this.filter 			= args.filter 			|| this.settings.filter,
		this.loader 			= args.loader 			|| this.settings.loader,
		this.focus 				= args.focus 			|| this.settings.focus,
		this.duration 			= args.duration 		|| this.settings.duration;
	};

/*
Basic UI Methods
*/
	Explorer.prototype.toggleLoader 	= function () {
		var explr = this;
		// $(explr.loader).toggleFade(explr.duration);
	};

/*
API Request Methods
*/

	//Basic Get Requests
	Explorer.prototype.xhr 		= function (type, route, data, callback) {
		var explr = this;
		explr.toggleLoader();
		$.ajax({
			type: type,
			url: route,
			data: data,
		}).done(function (res) {
			console.log("Response: " + res);
			explr.data = res;
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			explr.toggleLoader();
			if (typeof callback === 'function') callback();
		});
	};

/*
Tile Generation & Collection Methods
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
		tile.init();
		explr.tiles.push(tile);
	};

	//Generate Tiles From Data Array
	Explorer.prototype.generateTiles 	= function () {
		var explr = this;
		for (var i = 0; i < explr.data.length; i++) {
			explr.createTile(explr.data[i]);
		};
	};

/*
Public / Access Methods
*/

	//Initialization Macro
	Explorer.prototype.init 			= function (route) {
		var explr = this;
		explr.xhr("GET", (route || explr.routes.retrieve), {}, function () {
			explr.generateTiles();
		});
	};

	//Filter Tiles
	Explorer.prototype.filterTiles 		= function (filter) {
		var explr = this;
		$(explr.tile).removeClass(explr.focus);
		$(filter).addClass(explr.focus);
	};

	//Search For Tiles by String
	Explorer.prototype.search 			= function (query) {
		var explr = this;
		explr.xhr("GET", explr.routes.search, {query: query}, function () {
			explr.generateTiles();
		});
	};

	//Get TIles by Tags
	Explorer.prototype.getByTag 		= function (tags) {
		var explr = this;
		explr.xhr("POST", explr.routes.getByTag, {tags: tags}, function () {
			explr.generateTiles();
		});
	};