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
			app.explorer 	= new Explorer (args.explorer),
			app.data;
	};

	// Toggle Meunu - Duh
	App.prototype.toggleMenu 	= function () {
		$(app.menu).toggleClass('close');
		$(app.navigation).toggleClass('active');
	};

	// Base Request Method
	App.prototype.request 		= function (type, data, route) {
		var admin = this;
		$.ajax({
			type: type,
			data: data,
			url: route,
		}).done(function (res) {
			app.data = res;
			console.log("Response: ");
			console.log(res);
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
			console.log(type, data, route);
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			if (typeof callback === 'function') callback();
		});
	};

/*
Macros
*/

	App.prototype.init 			= function () {
		var app = this;
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
					new 			: 		"/new",
					retrieve 		: 		"/retrieve",
					getByTag 		: 		"/getByTag",
					search 			: 		"/search"
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
			e.preventDefault();
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

