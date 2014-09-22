/*
Declare Arguments
*/

	var Admin = function (args) {
		var admin = this;
			admin.element 		= args.element 			|| 	'#wradminer',
			admin.navigation 	= args.navigation 		|| 	'#navigation',
			admin.menu 			= args.menu 			|| 	'.menu',
			admin.sub 			= args.sub 				|| 	'#submission-pane',
			admin.openSub		= args.openSub 			|| 	'#open-submission',
			admin.createSub 	= args.create 			|| 	'#create-submission',
			admin.closeSub 		= args.closeSub 		|| 	'#close-submission',
			admin.adminGet 		= args.adminGet 		|| 	'.get',
			admin.adminPost 	= args.adminPost 		|| 	'.post',
			admin.searchBar 	= args.searchBar 		|| 	'.search .bar',
			admin.searchGo 		= args.searchGo 		|| 	'.search .submit',
			admin.scrollable 	= args.scrollable 		|| 	'.scrollable',
			admin.fileInput 	= args.fileInput 		|| 	'#file-input',
			admin.fileMask 		= args.fileMask 		|| 	'#file-input-mask',
			admin.form 			= args.form 			|| 	'#form',
			admin.submit 		= args.submit 			|| 	'#create-submission',
			admin.explorer 		= new Explorer (args.explorer),
			admin.selectedTiles = [];
	};

	// Toggle Le Menu
	Admin.prototype.toggleMenu 		= function () {
		var admin = this;
		$(admin.menu).toggleClass('close');
		$(admin.navigation).toggleClass('active');
	};

	// Instantiate Scroll Bar
	Admin.prototype.scrollBar 		= function () {
		var admin = this;
		$(admin.scrollable).perfectScrollbar();
		$(admin.scrollable).perfectScrollbar('update');
	};
	// Binds Events Once Tiles Have Been Rendered
	Admin.prototype.bindEvents 		= function () {
		var admin 	= this;
		// Select Tile Event
		$('.' + admin.explorer.tile.element).on("click", function (e) {
			admin.toggleTile(e);
		});
		console.log("Status: Tile Events Bound");
		console.log($('.' + admin.explorer.tile.element));
	};
	// Toggles Selection Class of Tiles & Tile Adds/Removes Tile ID From Select Array
	Admin.prototype.toggleTile 		= function (data) {
		var admin 	= this,
			tile 	= $('#' + data.id());
		$(tile).toggleClass('selected');
		($(tile).hasClass('selected')) ? admin.selectedTiles.push($(tile).attr('id')) : admin.removeID(admin.selectedTiles, $(tile).attr('id'));
	};
	// Collects IDs of Selected Tiles
	Admin.prototype.collectTiles 	= function () {
		var admin = this,
			tiles = $('.selected');
		$.each(tiles, function (k, v) {
			admin.selectedTiles.push(v.id);
		});
	};
	// Remove ID From Array
	Admin.prototype.removeID 		= function (arr) {
		var what, a = arguments, L = a.length, ax;
	    while (L > 1 && arr.length) {
	        what = a[--L];
	        while ((ax = arr.indexOf(what)) !== -1) {
	            arr.splice(ax, 1);
	        };
	    };
	    return arr;
	};

/*
Macros
*/

	// Initialize
	Admin.prototype.init 			= function () {
		console.log("Status: Initializing...");
		var admin = this;
			//Instatiate & Initialize Explorer
			admin.scrollBar();
			admin.explorer.init(function () {
				admin.bindEvents();
				console.log("Status: Ready");
			});
	};

	Admin.prototype.showFilePath 	= function (e) {
		var admin 	= this,
			path 	= $(e.currentTarget).val();
		if (path.length) $(admin.fileMask).val("FILE(S) READY");
	};

	// Get Form Values
	Admin.prototype.submitForm 		= function () {
		var data = {
			title 		: $('#title-input').val(),
			client 		: $('#client-input').val(),
			url 		: $('#url-input').val(),
			content 	: $('#content-input').val(),
			description : $('#description-input').val(),
			tags 		: $('#tags-input').val()
		};
	};

	// Clear Form Inputs
	Admin.prototype.clearForm 		= function () {
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
		form 		: 		"#piece",
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
					new 			: 		"/cms/new",
					retrieve 		: 		"/cms/retrieve",
					getByTag 		: 		"/cms/getByTag",
					search 			: 		"/cms/search"
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
		var call 	= $(this).data().call,
			key 	= $(this).data().key,
			val 	= $(this).data().val;
		admin.explorer.request({
			type 		: "GET",
			route 		: call,
			data 		: {},
			callback 	: function () {
				admin.explorer.generateTiles(key, val);
				console.log("GET done");
			}
		});
	});

	// Post Request
	$(admin.adminPost).on("click", function (e) {
		var call 	= $(this).data().call,
			key 	= $(this).data().key,
			val 	= $(this).data().val;
		admin.explorer.request({
			type 		: "GET", 
			route 		: call, 
			data 		: {"selectedTiles": admin.selectedTiles}, 
			callback 	: function () {
				admin.explorer.generateTiles(key, val);
				admin.selectedTiles = [];
				console.log("POST done");
			}
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

	// Prevent Form Redirect
	// $(admin.form).on("submit", function (e) {
	// 	e.preventDefault();
	// });
