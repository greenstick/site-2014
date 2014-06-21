/*
Declare Arguments
*/

	var Admin = function (args) {
		var admin = this;
			admin.element 		= args.element 		|| 		'#wradminer',
			admin.navigation 	= args.navigation 	|| 		'#navigation',
			admin.menu 			= args.menu 		|| 		'.menu',
			admin.adminGet 		= args.adminGet 	|| 		'.get',
			admin.adminPost 	= args.adminPost 	|| 		'.post',
			admin.searchBar 	= args.searchBar 	|| 		'.search .bar',
			admin.searchGo 		= args.searchGo 	|| 		'.search .submit',
			admin.explorer 		= args.explorer
	};

	Admin.prototype.toggleMenu 	= function () {
		$(admin.menu).toggleClass('close');
		$(admin.navigation).toggleClass('active');
	};

/*
Macros
*/

	Admin.prototype.init 			= function () {
		var admin = this;
			//Instatiate & Initialize Explorer
			admin.explore = new Explorer (admin.explorer);
			admin.explore.init('/cms-new');
	};

/*
Declare Args, Instantiation, & Initialization
*/

	var args = {
		element		: 		"#wrapper",
		navigation 	: 		"#navigation",
		menu 		: 		".menu-open",
		adminGet 	: 		".admin.get",
		adminPost 	: 		".admin.post",
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
	admin = new Admin (args);
	admin.init();

/*
Event Bindings
*/

	//Toggle Filters Menu
	$(admin.menu).on("click", function (e) {
		admin.toggleMenu();
	});

	//Filter Explorer
	$('.' + admin.explore.filter).on("click", function (e) {
		var filter = $(this).data().filter;
		admin.explore.filterTiles(filter);
	});
	//Get Request
	$(admin.adminGet).on("click", function (e) {
		var call = $(this).data().call;
		admin.explore.xhr("GET", call, {}, function () {
			console.log("GET done");
		});
	});
	//Post Request
	$(admin.adminPost).on("click", function (e) {
		var call = $(this).data().call;
		admin.explore.xhr("GET", call, {}, function () {
			console.log("POST done");
		});
	});
	//Search Bar Enter
	$(admin.searchBar).on("keydown", function (e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			var query = $(this).text();
		};
	});
	//Search Bar Go
	$(admin.searchGo).on("click", function (e) {
		var query = $(admin.searchBar).text();

	});
