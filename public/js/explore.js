var Explorer = function (config) {
	return this.__init__(config);
};

/*
Explorer Prototype

@params {
	parent: 		string (cached, optional)
	element: 		string (cached, optional)
	tile: 			module (cached, optional)	
	filter: 		string (cached, optional)
	loader: 		string (cached, optional)
	focus: 			string (cached, optional)
	duration: 		number (cached, optional)
	routes: 		object (required)
		new: 			string (optional)
		retrieve: 		string (optional)
		getTiles: 		string (optional)
		getByTag: 		string (optional)
		search: 		string (optional)
}
*/

Explorer.prototype = {

	/*
	Macro Methods
	*/

	// Initialize
	__init__ 		: function (config) {
		var xplr = this;
			xplr.parent 		= typeof config.parent 		=== 'string' ? config.parent 		: "#wrapper",
			xplr.element 		= typeof config.element 	=== 'string' ? config.element  		: "#explorer",
			xplr.tile 			= typeof config.tile 		=== 'string' ? config.tile 		 	: ".tile",
			xplr.filter 		= typeof config.filter 		=== 'string' ? config.filter 	 	: "filter",
			xplr.loader 		= typeof config.loader 		=== 'string' ? config.loader 	 	: "loader",
			xplr.focus 			= typeof config.focus 		=== 'string' ? config.focus 	 	: "focus",
			xplr.duration 		= typeof config.duration 	=== 'number' ? config.duration 	 	: 600,
			xplr.flipTarget 	= typeof config.flipTarget 	=== 'string' ? config.flipTarget 	: ".card",
			xplr.routes 		= {
				def 			: typeof config.routes.def 		=== 'string' ? config.def				: "/api/retrieve",
				new 			: typeof config.routes.new 		=== 'string' ? config.new 				: "/api/new",
				retrieve 		: typeof config.routes.retrieve === 'string' ? config.retrieve 			: "/api/retrieve",
				getTiles 		: typeof config.routes.getTiles === 'string' ? config.getTiles 			: "/api/getTiles",
				getByTag		: typeof config.routes.getByTag === 'string' ? config.routes.getByTag 	: "/api/getByTag",
				search 			: typeof config.routes.search 	=== 'string' ? config.routes.search 	: "/api/search"
			},
			xplr.tiles 		= ko.observableArray([]),
			xplr.tagSearch 	= false,
			xplr.tagData,
			xplr.data,
			xplr.loc;
		// Initial Get
		xplr.request({
			type 			: "GET",
			route 			: xplr.routes.def,
			data 			: {}
		}, function () {
			xplr.generateTiles();
			ko.applyBindings(xplr, document.querySelector(xplr.element));
		});
		console.log("Status: Explorer Initialized");
		return this;
	},

	// Update
	update 			: function (callback) {
		var xplr = this;
		xplr.generateTiles();
		if (typeof callback === 'function') callback();
		return this;
	},

	/*
	Basic UI Methods
	*/

	// Toggle Loader
	toggleLoader 	: function () {
		var xplr = this;
		// $(xplr.loader).toggleFade(xplr.duration);
		return this;
	},

	/*
	API Request Methods
	*/

	// Basic API request
	request 		: function (args, callback) {
		var xplr 		= this,
			type 		= args.type,
			route 		= args.route,
			data 		= args.data;
		// Toggle Loader On
		xplr.toggleLoader();
		// Construct Request
		$.ajax({
			type 		: type,
			url 		: route,
			dataType 	: "json",
			data 		: data,
		}).done(function (res) {
			xplr.tagSearch === true ? xplr.tagData = res : xplr.data = res;
			console.log("XHR Notification: Request Response "); 
			console.log(xplr.data);
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
			console.log(type, route, data);
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			xplr.toggleLoader();
			if (typeof callback === 'function') callback();
		});
		return this;
	},

	// Search API Request
	search 			: function (query, callback) {
		var xplr = this;
		xplr.tagSearch = true;
		xplr.request({
			type 			: "GET", 
			route 			: xplr.routes.search, 
			data 			: {query: query}
		},  function () {
			xplr.update();
		});
		if (typeof callback === 'function') callback();
		return this;
	},

	/*
	Hash Location 
	*/

	//Set Window Locaton
	setLocation 	: function (location) {
		var xplr = this;
		xplr.location = location;
		console.log(location);
		xplr.loc = (xplr.loc !== null && xplr.loc !== undefined) ? xplr.loc : (location.hash) ? location.hash : '#', link = xplr.loc.substr(1);
		// console.log(xplr.loc);
		history.pushState ? history.pushState({}, document.title, xplr.loc) : location.hash = xplr.loc;
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		return this;
	},

	/*
	Tile Generation & Collection Methods
	*/

	// Create a Tile
	createTile 		: function (data) {
		var xplr 		= this,
			tile  		= new Tile ({
				parent 		: xplr.tile.parent,
				element 	: xplr.tile.element,
				ratio 		: xplr.tile.ratio,
				width 		: xplr.tile.width,
				data		: ko.observable(data)
			});
		xplr.tiles.push(tile);
		return this;
	},

	// Generate Tiles From Data 
	generateTiles 	: function (key, val) {
		var xplr = this;
		xplr.tiles([]);
		if ((typeof key !== 'undefined') && (typeof val !== 'undefined')) {
			if (xplr.tagSearch === false) {
				for (var i = 0; i < xplr.data.length; i++) {
					if (xplr.data[i][key] === val) {
						xplr.createTile(xplr.data[i]);
					};
				};
			} else {
				for (var i = 0; i < xplr.tagData.length; i++) {
					if (xplr.tagData[i][key] === val) {
						xplr.createTile(xplr.tagData[i]);
					};
				};
			};
		} else {
			if (xplr.tagSearch === false) {
				for (var i = 0; i < xplr.data.length; i++) {
					xplr.createTile(xplr.data[i]);
				};
			} else {
				for (var i = 0; i < xplr.tagData.length; i++) {
					xplr.createTile(xplr.tagData[i]);
				};
			};
		};
		console.log("Status: Tiles Generated");
		return this;
	},

	// Filter Tiles
	filterTiles 	: function (filter, callback) {
		var xplr = this;
		xplr.tiles([]);
		if (filter === "all") xplr.tagSearch = false;
		if (xplr.tagSearch === false && filter === "all") {
			xplr.setLocation("");
			for (var i = 0; i < xplr.data.length; i++) {
				xplr.createTile(xplr.data[i]);
			};
		} else if (xplr.tagSearch === false) {
			xplr.setLocation(filter);
			for (var i = 0; i < xplr.data.length; i++) {
				for (var j = 0; j < xplr.data[i].tags.length; j++) {
					if (xplr.data[i].tags[j] === filter) {
						xplr.createTile(xplr.data[i]);
					};
				};
			};
		} else {
			xplr.setLocation(filter);
			for (var i = 0; i < xplr.tagData.length; i++) {
				for (var j = 0; j < xplr.tagData[i].tags.length; j++) {
					if (xplr.tagData[i].tags[j] === filter) {
						xplr.createTile(xplr.tagData[i]);
					};
				};
			};
		};
		if (typeof callback === 'function') callback();
		return this;
	},

	// Flip Tile
	flipTile 		: function (tile, e) {
		var xplr = this;
		e.stopPropagation();
		$('#' + tile.id() + " " + xplr.flipTarget).toggleClass('flipped');
		return this;
	}
};

