(function () {

	var App = function (config) {
		this.__init__(config);
	};

	/*
	App Prototype

	@Params
			- Object
			- Object.element 	 	(String)
			- Object.navigation  	(String)
			- Object.menu 		 	(String)
			- Object.searchBar  	(String)
			- Object.searchGo 		(String)
			- Object.scrollable 	(String)
			- Object.explorer	 	(module)
	*/

	App.prototype = {

		/*
		Macro Methods
		*/

		//Initialize
		__init__ 		: function (config) {
			var app = this;
				app.explorer 		= new Explorer (config.explorer),
				app.element 		= typeof config.element 	=== 'string' ? config.element 		: '#wrapper',
				app.navigation 		= typeof config.navigation 	=== 'string' ? config.navigation 	: '#navigation',
				app.menu 			= typeof config.menu 		=== 'string' ? config.menu 			: '.menu',
				app.searchBar 		= typeof config.searchBar 	=== 'string' ? config.searchBar 	: '.search .bar',
				app.searchGo		= typeof config.searchGo	=== 'string' ? config.searchGo		: '.search .submit',
				app.scrollable 		= typeof config.scrollable 	=== 'string' ? config.scrollable 	: '.scrollable',
				app.scrollBar(),
				app.data;
			return this;
		},

		/*
		UI
		*/

		// Toggle Menu
		toggleMenu		: function () {
			var app = this;
			$(app.menu).toggleClass('close');
			$(app.navigation).toggleClass('active');
			return this;
		},

		// Init & Update Scroll Bar
		scrollBar 		: function () {
			var app = this;
			$(app.scrollable).perfectScrollbar();
			$(app.scrollable).perfectScrollbar('update');
			return this;
		}
	};

	/*
	Configure
	*/

	var config = {
		element		: 		"#wrapper",
		navigation 	: 		"#navigation",
		menu 		: 		".menu-open",
		explorer 	: 		{
			parent			: 		"#wrapper",
			element			: 		"#explorer",
			tile 			: 		{
					parent 			:  		"#explorer",
					element 		: 		"tile",
					ratio 			: 		1,
					width 			: 		600,
			},
			filter 			: 		"filter",
			loader 			: 		".loader",
			focus 			: 		".focus",
			duration 		: 		1000,
			routes 			:		{
					def 			: 		"/api/retrieve",
					new 			: 		"/api/new",
					retrieve 		: 		"/api/retrieve",
					getByTag 		: 		"/api/getByTag",
					search 			: 		"/api/search"
			}
		}
	};

	/*
	Instatiation & Initialization
	*/

	app = new App (config);

	/*
	Event Bindings
	*/

	// Toggle Filters Menu
	$(app.menu).on("click", function (e) {
		app.toggleMenu();
	});

	// Filter Explorer
	$('.' + app.explorer.filter).on("click", function (e) {
		var filter = $(this).data().filter;
		app.explorer.filterTiles(filter);
	});

	// Search Bar Enter
	$(app.searchBar).on("keydown", function (e) {
		if (e.keyCode === 13) {
			var query = $(app.searchBar).text();
			app.explorer.search(query, function () {
				$(app.searchBar).text("");
			});
		};
	});

	// Search Bar Go
	$(app.searchGo).on("click", function (e) {
		var query = $(app.searchBar).text();
		app.explorer.search(query, function () {
			$(app.searchBar).text("");
		});
	});

})(jQuery, ko, Explorer, Tile)