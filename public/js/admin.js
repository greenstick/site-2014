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
			admin.submit 		= args.submit 		|| 		'#create-submission',
			admin.explorer 		= new Explorer (args.explorer),
			admin.selectedTiles = [];
	};

	Admin.prototype.toggleMenu 		= function () {
		$(admin.menu).toggleClass('close');
		$(admin.navigation).toggleClass('active');
	};

	Admin.prototype.scrollBar 		= function () {
		var admin = this;
		$(admin.scrollable).perfectScrollbar();
		$(admin.scrollable).perfectScrollbar('update');
	};
	//Base Request Method
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
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
			if (typeof callback === 'function') callback();
		});
	};

	//Binds Events Once Tiles Have Been Rendered
	Admin.prototype.bindEvents 		= function () {
		//Select Tile
		$('.' + admin.explorer.tile.element).on("click", function (e) {
			admin.toggleTile(e);
		});
	};
	//Toggles Selection Class of Tiles
	Admin.prototype.toggleTile 		= function (e) {
		$(e.currentTarget).toggleClass('selected');
	};
	//Collects IDs of Selected Tiles
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

	Admin.prototype.init 			= function () {
		var admin = this;
			//Instatiate & Initialize Explorer
			admin.scrollBar();
			admin.explorer.init('/cms-new', function () {
				// ko.applyBindings(admin.explorer, document.getElementById(admin.explorer.element.split('#', 1)));
				admin.bindEvents();
			});
	};

	Admin.prototype.submitForm 			= function () {
		var data = {
			title 		: $('#title-input').val(),
			client 		: $('#client-input').val(),
			url 		: $('#url-input').val(),
			content 	: $('#content-input').val(),
			description : $('#description-input').val(),
			tags 		: $('#tags-input').val()
		};
		this.request('GET', data, '/cms-submit');
	};

	Admin.prototype.resetForm 			= function () {
		$('#title-input').val('');
		$('#client-input').val('');
		$('#url-input').val('');
		$('#content-input').val('');
		$('#description-input').val('');
		$('#tags-input').val('');
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
	$('.' + admin.explorer.filter).on("click", function (e) {
		var filter = $(this).data().filter;
		admin.explorer.filterTiles(filter);
	});
	//Open Submission Pane
	$(admin.openSub).on("click", function (e) {
		$(admin.sub).addClass('active');
	});
	//Close Submission Pane
	$(admin.closeSub).on("click", function (e) {
		$(admin.sub).removeClass('active');
	});
	//Get Request
	$(admin.adminGet).on("click", function (e) {
		var call = $(this).data().call;
		admin.explorer.request("GET", call, {}, function () {
			console.log("GET done");
		});
	});
	//Post Request
	$(admin.adminPost).on("click", function (e) {
		var call = $(this).data().call;
		admin.explorer.request("GET", call, {}, function () {
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
		console.log(query);
		admin.explorer.search(query);

	});
	//Submit Piece Form
	$(admin.submit).on("click", function (e) {
		admin.submitForm();
		admin.resetForm();
		$(admin.sub).removeClass('active');
	});
