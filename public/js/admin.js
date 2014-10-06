/*
Declare Arguments
*/

	var Admin = function (args) {
		var admin = this;
			admin.element 		= args.element 				|| 	'#wradminer',
			admin.navigation 	= args.navigation 			|| 	'#navsigation',
			admin.menu 			= args.menu 				|| 	'.menu',
			admin.sub 			= args.sub 					|| 	'#submission-pane',
			admin.openSub		= args.openSub 				|| 	'#open-submission',
			admin.createSub 	= args.create 				|| 	'#create-submission',
			admin.closeSub 		= args.closeSub 			|| 	'#close-submission',
			admin.adminGet 		= args.adminGet 			|| 	'.get',
			admin.adminPost 	= args.adminPost 			|| 	'.post',
			admin.searchBar 	= args.searchBar 			|| 	'.search .bar',
			admin.searchGo 		= args.searchGo 			|| 	'.search .submit',
			admin.scrollable 	= args.scrollable 			|| 	'.scrollable',
			admin.fileInput 	= args.fileInput 			|| 	'#file-input',
			admin.fileMask 		= args.fileMask 			|| 	'#file-input-mask',
			admin.form 			= args.form 				|| 	'#form',
			admin.submit 		= args.submit 				|| 	'#create-submission',
			admin.explorer 		= new Explorer (args.explorer),
			admin.selectedTiles = [],
			admin.selectedFiles = [];
	};

/*
UI Handling Functions
*/

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

	// Toggles Selection Class of Tiles & Tile Adds/Removes Tile ID & Tile 
	// File Paths From selectedTiles and selectedFiles Arrays Respectively
	Admin.prototype.toggleTile 		= function (data) {
		var admin 	= this,
			id 		= data.id(),
			tile 	= $('#' + id);
		tile.toggleClass('selected');
		if (tile.hasClass('selected')) {
			admin.selectedTiles.push(id);
			$.each(admin.explorer.data, function (k, v) {
				if (id === v.projectUUID) {
					for (var i = 0; i < v.files.length; i++) {
						admin.selectedFiles.push(v.files[i].path);
					};
				};
			});
			console.log(admin.selectedFiles);
		} else {
			admin.removeArrayValue(admin.selectedTiles, id);
			$.each(admin.explorer.data, function (k, v) {
				if (id === v.projectUUID) {
					for (var i = 0; i < v.files.length; i++) {
						admin.removeArrayValue(admin.selectedFiles, v.files[i].path);
					};
				};
			});
		};
	};

	// Remove Value From Array
	Admin.prototype.removeArrayValue 		= function (arr) {
		var what, a = arguments, l = a.length, ax;
	    while (l > 1 && arr.length) {
	        what = a[--l];
	        while ((ax = arr.indexOf(what)) !== -1) arr.splice(ax, 1);
	    };
	    return arr;
	};

	// Populate Image Preview
	Admin.prototype.previewImage 	= function (input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            $('#preview .image').attr('src', e.target.result);
	        };
	        reader.readAsDataURL(input.files[0]);
	    };
	};

	// Update File Placeholder Text
	Admin.prototype.showFilePath 	= function (path) {
		var admin 	= this;
		if (path.length) $(admin.fileMask).val("UPLOAD READY");
	};

	// Clear Form Inputs
	Admin.prototype.clearForm 		= function () {
		setTimeout(function () {
			$('.input-field').val('');
		}, 500);
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
				console.log("Status: Admin Controller Initialized");
			});
	};

	// Get Form Values
	Admin.prototype.submitForm 		= function (form) {
		var data = new FormData(form);
		$.ajax({
			type 		: "POST",
			url 		: "/cms/submit",
			data 		: data,
			processData : false,
			contentType : 'multipart/form-data',
			mimeType 	: 'multipart/form-data'
		}).done(function (res) {
			console.log("XHR Notification: Response... "); 
			console.log(res);
			admin.clearForm();
			admin.explorer.generateTiles();
		}).fail(function () {
			console.debug("XHR Alert: Request Failed");
			console.log(type, route, data);
		}).always(function () {
			console.debug("XHR Notification: Request Complete");
		});
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
					def 			: 		"/cms/new",
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
		admin.toggleMenu();
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
			data 		: {}
		},  function () {
			admin.explorer.generateTiles(key, val);
			console.log("GET done");
		});
	});

	// Post Request
	$(admin.adminPost).on("click", function (e) {
		var call 	= $(this).data().call,
			key 	= $(this).data().key,
			val 	= $(this).data().val,
			data 	= admin.selectedFiles.length ? {"selectedTiles": admin.selectedTiles, "selectedFiles": admin.selectedFiles} : {"selectedTiles": admin.selectedTiles};
		admin.explorer.request({
			type 		: "GET", 
			route 		: call, 
			data 		: data
		},  function () {
			console.log(admin.selectedFiles);
			admin.explorer.generateTiles(key, val);
			admin.selectedTiles = [];
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
		var input = $(e.currentTarget);
		admin.showFilePath(input.val());
		admin.previewImage(input);
	});

	// Submit Piece Form
	$(admin.submit).on("submit", function (e) {
		var form = $(this)[0];
		e.preventDefault();
		admin.submitForm(form);
		$(admin.sub).removeClass('active');
	});
