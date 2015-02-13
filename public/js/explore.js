var Explorer = function (config) {
	this.init(config);
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
	init: function (config) {
		var explr = this;
			explr.parent 		= config.parent 		|| explr.parent 			|| "#wrapper",
			explr.element 		= config.element 		|| explr.element 			|| "#explorer",
			explr.tile 			= config.tile 			|| explr.tile 				|| ".tile",
			explr.filter 		= config.filter 		|| explr.filter 			|| "filter",
			explr.loader 		= config.loader 		|| explr.loader 			|| "loader",
			explr.focus 		= config.focus 			|| explr.focus 				|| "focus",
			explr.duration 		= config.duration 		|| explr.duration 			|| 600,
			explr.flipTarget 	= config.flipTarget 	|| explr.flipTarget 		|| ".card",
			explr.routes 		= {
				def 			: 						config.routes.def 			|| "/api/retrieve",
				new 			: 						config.routes.new 			|| "/api/new",
				retrieve 		: 						config.routes.retrieve 		|| "/api/retrieve",
				getTiles 		:  						config.routes.getTiles 		|| "/api/getTiles",
				getByTag		: 						config.routes.getByTag 		|| "/api/getByTag",
				search 			: 						config.routes.search 		|| "/api/search"
			},
			explr.settings 		= config,
			explr.tiles 		= ko.observableArray([]),
			explr.tagSearch 	= false,
			explr.tagData,
			explr.data,
			explr.loc;
		// Initial Get
		explr.request({
			type 			: "GET",
			route 			: explr.routes.def,
			data 			: {}
		}, function () {
			explr.generateTiles();
			ko.applyBindings(explr, document.querySelector(explr.element));
		});
		console.log("Status: Explorer Initialized");
	},

	// Update
	update: function (callback) {
		var explr = this;
		explr.generateTiles();
		if (typeof callback === 'function') callback();
	},

	/*
	Basic UI Methods
	*/

	// Toggle Loader
	toggleLoader: function () {
		var explr = this;
		// $(explr.loader).toggleFade(explr.duration);
	},

	/*
	API Request Methods
	*/

	// Basic API request
	request: function (args, callback) {
		var explr 		= this,
			type 		= args.type,
			route 		= args.route,
			data 		= args.data;
		// Toggle Loader On
		explr.toggleLoader();
		// Construct Request
		$.ajax({
			type 		: type,
			url 		: route,
			dataType 	: "json",
			data 		: data,
		}).done(function (res) {
			explr.tagSearch === true ? explr.tagData = res : explr.data = res;
			console.log("XHR Notification: Request Response "); 
			console.log(explr.data);
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
			console.log(type, route, data);
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			explr.toggleLoader();
			if (typeof callback === 'function') callback();
		});
	},

	// Search API Request
	search: function (query, callback) {
		var explr = this;
		explr.tagSearch = true;
		explr.request({
			type 			: "GET", 
			route 			: explr.routes.search, 
			data 			: {query: query}
		},  function () {
			explr.update();
		});
		if (typeof callback === 'function') callback();
	},

	/*
	Hash Location 
	*/

	//Set Window Locaton
	setLocation: function (location) {
		var explr = this;
		explr.location = location;
		console.log(location);
		explr.loc = (explr.loc !== null && explr.loc !== undefined) ? explr.loc : (location.hash) ? location.hash : '#', link = explr.loc.substr(1);
		// console.log(explr.loc);
		history.pushState ? history.pushState({}, document.title, explr.loc) : location.hash = explr.loc;
		window.dispatchEvent(new HashChangeEvent("hashchange"));
	},

	/*
	Tile Generation & Collection Methods
	*/

	// Create a Tile
	createTile: function (data) {
		var explr 		= this,
			tile  		= new Tile ({
				parent 		: explr.tile.parent,
				element 	: explr.tile.element,
				ratio 		: explr.tile.ratio,
				width 		: explr.tile.width,
				data		: ko.observable(data)
			});
		explr.tiles.push(tile);
	},

	// Generate Tiles From Data 
	generateTiles: function (key, val) {
		var explr = this;
		explr.tiles([]);
		if ((typeof key !== 'undefined') && (typeof val !== 'undefined')) {
			if (explr.tagSearch === false) {
				for (var i = 0; i < explr.data.length; i++) {
					if (explr.data[i][key] === val) {
						explr.createTile(explr.data[i]);
					};
				};
			} else {
				for (var i = 0; i < explr.tagData.length; i++) {
					if (explr.tagData[i][key] === val) {
						explr.createTile(explr.tagData[i]);
					};
				};
			};
		} else {
			if (explr.tagSearch === false) {
				for (var i = 0; i < explr.data.length; i++) {
					explr.createTile(explr.data[i]);
				};
			} else {
				for (var i = 0; i < explr.tagData.length; i++) {
					explr.createTile(explr.tagData[i]);
				};
			};
		};
		console.log("Status: Tiles Generated");
	},

	// Filter Tiles
	filterTiles: function (filter, callback) {
		var explr = this;
		explr.tiles([]);
		if (filter === "all") explr.tagSearch = false;
		if (explr.tagSearch === false && filter === "all") {
			explr.setLocation("");
			for (var i = 0; i < explr.data.length; i++) {
				explr.createTile(explr.data[i]);
			};
		} else if (explr.tagSearch === false) {
			explr.setLocation(filter);
			for (var i = 0; i < explr.data.length; i++) {
				for (var j = 0; j < explr.data[i].tags.length; j++) {
					if (explr.data[i].tags[j] === filter) {
						explr.createTile(explr.data[i]);
					};
				};
			};
		} else {
			explr.setLocation(filter);
			for (var i = 0; i < explr.tagData.length; i++) {
				for (var j = 0; j < explr.tagData[i].tags.length; j++) {
					if (explr.tagData[i].tags[j] === filter) {
						explr.createTile(explr.tagData[i]);
					};
				};
			};
		};
		if (typeof callback === 'function') callback();
	},

	// Flip Tile
	flipTile: function (tile, e) {
		var explr = this;
		e.stopPropagation();
		$('#' + tile.id() + " " + explr.flipTarget).toggleClass('flipped');
	}
};

