/*
Declare Arguments
*/

	var App = function (args) {
		var app = this;
			app.element 	= args.element 		|| 		'#wrapper',
			app.navigation 	= args.navigation 	|| 		'#navigation',
			app.menu 		= args.menu 		|| 		'.menu',
			app.search 		= args.search 		|| 		'#search',
			app.explorer 	= args.explorer
	};

	App.prototype.toggleMenu 	= function () {
		$(app.menu).toggleClass('close');
		$(app.navigation).toggleClass('active');
	};

/*
Macros
*/

	App.prototype.init 			= function () {
		var app = this;
			//Instatiate & Initialize Explorer
			app.explore 		= new Explorer (app.explorer);
			app.explore.init();
	};

	var args = {
		element		: 		"#wrapper",
		navigation 	: 		"#navigation",
		menu 		: 		".menu-open",
		explorer 	: 		{
			parent			: 		"#wrapper",
			element			: 		"#explorer",
			tile 			: 		"tile",
			filter 			: 		"filter",
			loader 			: 		".loader",
			focus 			: 		".focus",
			duration 		: 		1000,
			routes 			:		{}
		}
	},

/*
Instantiation & Initialization
*/

		app 		= new App (args);
		app.init();

/*
Event Bindings
*/

	//Toggle Filters Menu
	$(app.menu).on("click", function (e) {
		app.toggleMenu();
	});

	//Filter Explorer
	$('.' + app.explore.filter).on("click", function (e) {
		var filter = $(this).data().filter;
		app.explore.filterTiles(filter);
	});

