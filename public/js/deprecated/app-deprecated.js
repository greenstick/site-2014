/*
Declare Arguments
*/

	var App = function (args) {
		var app = this;
			app.element 	= args.element 		|| 		'#wrapper',
			app.navigation 	= args.navigation 	|| 		'#navigation',
			app.menu 		= args.menu 		|| 		'.menu',
			app.searchBar 	= args.searchBar 	|| 		'.search .bar',
			app.searchGo	= args.searchGo		|| 		'.search .submit',
			app.scrollable 	= args.scrollable 	|| 		'.scrollable',
			app.explorer 	= new Explorer (args.explorer),
			app.data;
	};

	// Toggle Le Menu
	App.prototype.toggleMenu 	= function () {
		$(app.menu).toggleClass('close');
		$(app.navigation).toggleClass('active');
	};

		// Instantiate Scroll Bar
	App.prototype.scrollBar 		= function () {
		var app = this;
		$(app.scrollable).perfectScrollbar();
		$(app.scrollable).perfectScrollbar('update');
	};

/*
Macros
*/

	App.prototype.init 			= function () {
		var app = this;
			app.scrollBar();
			//Initialize Explorer
			app.explorer.init();
	};

/*
Declare Args, Instantiation, & Initialization
*/

	var args = {
		element		: 		"#wrapper",
		navigation 	: 		"#navigation",
		menu 		: 		".menu-open",
		explorer 	: 		{
			parent			: 		"#wrapper",
			element			: 		"#explorer",
			tile 			: 		{
					parent 			:  		"#explorer",
					element 		: 		"tile",
					width 			: 		600,
					ratio 			: 		1,
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
	},
	app = new App (args);
	app.init();

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

