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
		new: 			string (optional)
		retrieve: 		string (optional)
		getTiles: 		string (optional)
		getByTag: 		string (optional)
		search: 		string (optional)
}
*/

	var Explorer = function (args) {
		var explr = this;
			explr.parent 		= args.parent 			|| explr.parent 		|| "#wrapper",
			explr.element 		= args.element 			|| explr.element 		|| "#explorer",
			explr.tile 			= args.tile 			|| explr.tile,
			explr.filter 		= args.filter 			|| explr.filter 		|| "filter",
			explr.loader 		= args.loader 			|| explr.loader 		|| "loader",
			explr.focus 		= args.focus 			|| explr.focus 			|| "focus",
			explr.duration 		= args.duration 		|| explr.duration 		|| 600,
			explr.routes 		= {
				def 			: 						args.routes.def 		|| "/api/retrieve",
				new 			: 						args.routes.new 		|| "/api/new",
				retrieve 		: 						args.routes.retrieve 	|| "/api/retrieve",
				getTiles 		:  						args.routes.getTiles 	|| "/api/getTiles",
				getByTag		: 						args.routes.getByTag 	|| "/api/getByTag",
				search 			: 						args.routes.search 		|| "/api/search"
			},
			explr.settings 		= {
				parent 			: explr.parent,
				element 		: explr.element,
				tile 			: explr.tile,
				filter 			: explr.filter,
				loader 			: explr.loader,
				duration 		: explr.duration,
				routes 			: explr.routes,
				data 			: explr.data
			},
			explr.tiles 		= ko.observableArray([]),
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

	// Basic Request Method
	Explorer.prototype.request 		= function (args) {
		var explr 		= this,
			type 		= args.type,
			route 		= args.route,
			data 		= args.data,
			callback	= args.callback;
		// Toggle Loader On
		explr.toggleLoader();
		// Construct Request
		$.ajax({
			type 		: type,
			url 		: route,
			dataType 	: "json",
			data 		: data,
		}).done(function (res) {
			explr.data = res;
			console.log("XHR Notification: Response... "); 
			console.log(explr.data);
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
			console.log(type, route, data);
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			explr.toggleLoader();
			if (typeof callback === 'function') callback();
		});
	};

/*
Tile Generation & Collection Methods
*/

	// Create a Tile
	Explorer.prototype.createTile 		= function (data) {
		var explr = this,
			tile = new Tile ({
				parent 		: 	explr.tile.parent,
				element 	: 	explr.tile.element,
				ratio 		: 	explr.tile.ratio,
				width 		: 	explr.tile.width,
				data		: 	ko.observable(data)
			});
		tile.init();
		explr.tiles.push(tile);
	};

	// Generate Tiles From Data Array
	Explorer.prototype.generateTiles 	= function (key, val) {
		var explr = this;
		explr.tiles([]);
		if ((typeof key !== 'undefined') && (typeof val !== 'undefined')) {
			for (var i = 0; i < explr.data.length; i++) {
				if (explr.data[i][key] === val) {
					explr.createTile(explr.data[i]);
				};
			};
		} else {
			for (var i = 0; i < explr.data.length; i++) {
				explr.createTile(explr.data[i]);
			};
		};
		console.log("Status: Tiles Generated");
	};

/*
Public / Access Methods
*/

	// Initialization Macro
	Explorer.prototype.init 			= function (callback) {
		var explr = this;
		explr.request({
			type 			: "GET",
			route 			: explr.routes.def,
			data 			: {},
			callback 		: function () {
				explr.generateTiles();
				ko.applyBindings(explr, document.querySelector(explr.element));
			}
		});
		if (typeof callback === 'function') callback();
		console.log("Status: Explorer Initialized");
	};

	// Update Macro
	Explorer.prototype.update 			= function (callback) {
		var explr = this;
		explr.generateTiles();
		if (typeof callback === 'function') callback();
	};

	// Filter Tiles
	Explorer.prototype.filterTiles 		= function (filter, callback) {
		var explr = this;
		explr.tiles([]);
		for (var i = 0; i < explr.data.length; i++) {
			for (var j = 0; j < explr.data[i].tags.length; j++) {
				if (explr.data[i].tags[j] === filter) {
					explr.createTile(explr.data[i]);
				}
			}
		};
	};

	// Search For Tiles by String
	Explorer.prototype.search 			= function (query, callback) {
		var explr = this;
		explr.request("GET", explr.routes.search, {query: query}, function (res) {
			console.log(res);
			explr.generateTiles();
			if (typeof callback === 'function') callback();
		});
	};

	// Get Tiles by Tags
	Explorer.prototype.getByTag 		= function (tags, callback) {
		var explr = this;
		explr.request("GET", explr.routes.getByTag, {tags: tags}, function () {
			explr.generateTiles();
			if (typeof callback === 'function') callback();
		});
	};