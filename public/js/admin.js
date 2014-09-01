/*
Declare Arguments
*/

	var Admin = function (args) {
		var admin = this;
			admin.element 		= args.element 		|| 		'#wradminer',
			admin.navigation 	= args.navigation 	|| 		'#navigation',
			admin.menu 			= args.menu 		|| 		'.menu',
			admin.sub 			= args.sub 			|| 		'#submission-pane',
			admin.openSub		= args.openSub 		|| 		'#open-submission',
			admin.createSub 	= args.create 		|| 		'#create-submission',
			admin.closeSub 		= args.closeSub 	|| 		'#close-submission',
			admin.adminGet 		= args.adminGet 	|| 		'.get',
			admin.adminPost 	= args.adminPost 	|| 		'.post',
			admin.searchBar 	= args.searchBar 	|| 		'.search .bar',
			admin.searchGo 		= args.searchGo 	|| 		'.search .submit',
			admin.scrollable 	= args.scrollable 	|| 		'.scrollable',
			admin.fileInput 	= args.fileInput 	|| 		'#file-input',
			admin.fileMask 		= args.fileMask 	|| 		'#file-input-mask',
			admin.submit 		= args.submit 		|| 		'#create-submission',
			admin.explorer 		= new Explorer (args.explorer),
			admin.selectedTiles = [];
	};

	// Toggle Le Menu
	Admin.prototype.toggleMenu 		= function () {
		$(admin.menu).toggleClass('close');
		$(admin.navigation).toggleClass('active');
	};

	// Instantiate Scroll Bar
	Admin.prototype.scrollBar 		= function () {
		var admin = this;
		$(admin.scrollable).perfectScrollbar();
		$(admin.scrollable).perfectScrollbar('update');
	};
	// Base Request Method
	Admin.prototype.request 			= function (type, data, route) {
		var admin = this;
		$.ajax({
			type: type,
			data: data,
			url: route,
		}).done(function (res) {
			admin.data = res;
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

	// Binds Events Once Tiles Have Been Rendered
	Admin.prototype.bindEvents 		= function () {
		//Select Tile
		$('.' + admin.explorer.tile.element).on("click", function (e) {
			admin.toggleTile(e);
		});
		console.log("Status: Tile Events Bound");
	};
	// Toggles Selection Class of Tiles
	Admin.prototype.toggleTile 		= function (e) {
		$(e.currentTarget).toggleClass('selected');
	};
	// Collects IDs of Selected Tiles
	Admin.prototype.collectTiles 	= function () {
		var admin = this,
			tiles = $('.selected');
		$.each(tiles, function (k, v) {
			admin.selectedTiles.push(v.id);
		});
	};

/*
Macros
*/

	// Initialize
	Admin.prototype.init 			= function () {
		console.log("Status: Initializing...")
		var admin = this;
			//Instatiate & Initialize Explorer
			admin.scrollBar();
			admin.explorer.init(function () {
				admin.bindEvents();
				console.log("Status: Ready");
			});
	};

	Admin.prototype.showFilePath 		= function (e) {
		var admin 	= this,
			path 	= $(e.currentTarget).val();
		if (path.length) $(admin.fileMask).val("FILE(S) READY");
	};

	// Get Form Values
	Admin.prototype.submitForm 			= function () {
		var data = {
			title 		: $('#title-input').val(),
			client 		: $('#client-input').val(),
			url 		: $('#url-input').val(),
			content 	: $('#content-input').val(),
			description : $('#description-input').val(),
			tags 		: $('#tags-input').val()
		};
		// this.request('GET', data, '/cms-submit');
	};

	// Clear Form Inputs
	Admin.prototype.clearForm 			= function () {
		setTimeout(function () {
			$('.input-field').val('');
		}, 500);
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
					new 			: 		"/cms-new",
					retrieve 		: 		"/cms-retrieve",
					getByTag 		: 		"/cms-getByTag",
					search 			: 		"/cms-search"
			}
		}
	},
	admin = new Admin (args);
	admin.init();

/*
Event Bindings
*/

	// Toggle Filters Menu
	$(admin.menu).on("click", function (e) {
		admin.toggleMenu();
	});

	// Filter Explorer
	$('.' + admin.explorer.filter).on("click", function (e) {
		var filter = $(this).data().filter;
		admin.explorer.filterTiles(filter);
	});

	// Open Submission Pane
	$(admin.openSub).on("click", function (e) {
		$(admin.sub).addClass('active');
	});

	// Close Submission Pane
	$(admin.closeSub).on("click", function (e) {
		$(admin.sub).removeClass('active');
	});

	// Get Request
	$(admin.adminGet).on("click", function (e) {
		var call = $(this).data().call;
		admin.explorer.request("GET", call, {}, function () {
			console.log("GET done");
		});
	});

	// Post Request
	$(admin.adminPost).on("click", function (e) {
		var call = $(this).data().call;
		admin.explorer.request("GET", call, {}, function () {
			console.log("POST done");
		});
	});

	// Search Bar Enter
	$(admin.searchBar).on("keydown", function (e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			var query = $(admin.searchBar).text();
			admin.explorer.search(query, function () {
				$(admin.searchBar).text("");
			});
		};
	});

	// Search Bar Go
	$(admin.searchGo).on("click", function (e) {
		var query = $(admin.searchBar).text();
		console.log(query);
		admin.explorer.search(query, function () {
			$(admin.searchBar).text("");
		});
	});

	// Display File Input Value on Selection
	$(admin.fileInput).on("change", function (e) {
		admin.showFilePath(e);
	});

	// Submit Piece Form
	$(admin.submit).on("click", function (e) {
		admin.submitForm();
		admin.clearForm();
		$(admin.sub).removeClass('active');
	});
