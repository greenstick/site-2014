(function () {

	var Admin = function (config) {
		return this.__init__(config);
	};

	/*
	Admin Prototype

	@Params
			- Object
			- Object.explorer 		(Module)
			- Object.element 	 	(String)
			- Object.navigation  	(String)
			- Object.menu 		 	(String)
			- Object.sub 		 	(String)
			- Object.openSub 	 	(String)
			- Object.createSub  	(String)
			- Object.closeSub 	 	(String)
			- Object.selectTiles 	(String)
			- Object.deselectTiles	(String)
			- Object.adminGet		(String)
			- Object.adminPost	 	(String)
			- Object.searchBar	 	(String)
			- Object.searchGo	 	(String)
			- Object.fileInput	 	(String)
			- Object.fileMask	 	(String)
			- Object.form 		 	(String)
			- Object.submit	  		(String)
	*/

	Admin.prototype = {

		/*
		Macro Methods
		*/

		//Initialize
		__init__ 			: function (config) {
			console.log("Status: App Controller Initializing...");
			var admin = this;
				admin.explorer 				= new Explorer (config.explorer),
				admin.element 				= typeof config.element 		=== 'string' ? config.element		: '#wrapper',
				admin.navigation 			= typeof config.navigation 		=== 'string' ? config.navigation 	: '#navigation',
				admin.menu 					= typeof config.menu 			=== 'string' ? config.menu 			: '.menu',
				admin.sub 					= typeof config.sub 			=== 'string' ? config.sub 			: '#submission-pane',
				admin.openSub				= typeof config.openSub 		=== 'string' ? config.openSub 		: '#open-submission',
				admin.createSub 			= typeof config.create 			=== 'string' ? config.create 		: '#create-submission',
				admin.closeSub 				= typeof config.closeSub 		=== 'string' ? config.closeSub 		: '#close-submission',
				admin.selectTiles			= typeof config.selectTiles 	=== 'string' ? config.selectTiles 	: '#selectTiles',
				admin.deselectTiles			= typeof config.deselectTiles 	=== 'string' ? config.deselectTiles : '#deselectTiles',
				admin.adminGet 				= typeof config.adminGet 		=== 'string' ? config.adminGet 		: '.get',
				admin.adminPost 			= typeof config.adminPost 		=== 'string' ? config.adminPost 	: '.post',
				admin.searchBar 			= typeof config.searchBar 		=== 'string' ? config.searchBar 	: '.search .bar',
				admin.searchGo 				= typeof config.searchGo 		=== 'string' ? config.searchGo 		: '.search .submit',
				admin.scrollable 			= typeof config.scrollable		=== 'string' ? config.scrollable 	: '.scrollable',
				admin.fileInput 			= typeof config.fileInput 		=== 'string' ? config.fileInput 	: '#file-input',
				admin.fileMask 				= typeof config.fileMask 		=== 'string' ? config.fileMask 		: '#file-input-mask',
				admin.form 					= typeof config.form 			=== 'string' ? config.form 			: '#form',
				admin.submit 				= typeof config.submit 			=== 'string' ? config.submit 		: '#create-submission',
				admin.selectedTiles 		= [],
				admin.selectedFiles 		= [],
				admin.contentOpts 			= Array.isArray(config.contentOpts) ? ko.observableArray(config.contentOpts) 	: ko.observableArray([]),
				admin.typeOpts 				= Array.isArray(config.typeOpts) 	? ko.observableArray(config.typeOpts) 		: ko.observableArray([]),
				admin.selectedContent 		= ko.observable(""),
				admin.selectedContentText	= ko.computed(function () {
					if (admin.selectedContent() === "") return "CONTENT";
					return admin.selectedContent();
				}),
				admin.selectedType 			= ko.observable(""),
				admin.selectedTypeText 		= ko.computed(function () {
					if (admin.selectedType() === "") return "TYPE";
					return admin.selectedType();
				}),
				admin.scrollBar();
			return this;
		},

		/*
		UI Handling Functions
		*/

		//Toggle Le Menu
		toggleMenu 			: function () {
			var admin = this;
			$(admin.menu).toggleClass('close');
			$(admin.navigation).toggleClass('active');
			return this;
		},

		// Toggle Submissions
		toggleSub 			: function () {
			var admin = this;
			$(admin.sub).toggleClass('active');
			$(admin.explorer.element).toggleClass('active');
			return this;
		},

		//Instantiate Scroll Bar
		scrollBar 			: function () {
			var admin = this;
			$(admin.scrollable).perfectScrollbar();
			$(admin.scrollable).perfectScrollbar('update');
			return this;
		},

		//Toggles Selection Class of Tiles & Tile Adds/Removes Tile ID & Tile 
		//File Paths From selectedTiles and selectedFiles Arrays Respectively
		toggleTile 			: function (data) {
			console.log(data);
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
				console.log(admin.selectedFiles);
			};
			return this;
		},

		//Select All Tiles
		selectAllTiles 		: function () {
			var admin = this;
			if ($('.' + admin.explorer.tile.element).hasClass('selected')) {
				return 
			} else {
				$('.' + admin.explorer.tile.element).addClass('selected');
				$.each($('.' + admin.explorer.tile.element), function (k, v) {
					var id = $(this).attr("id");
					admin.selectedTiles.push(id);
					$.each(admin.explorer.data, function (k, v) {
						if (id === v.projectUUID) {
							for (var i = 0; i < v.files.length; i++) {
								admin.selectedFiles.push(v.files[i].path);
							};
						};
					});
				});
			}
			return this;
		},

		//Deselect All Tiles
		deselectAllTiles 	: function () {
			admin.selectedTiles = [];
			admin.selectedFiles = [];
			$('.' + admin.explorer.tile.element).removeClass('selected');
			return this;
		},

		//Image Previewer
		previewImage 		: function (input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();
		        reader.onload = function (e) {
		            $('#preview .image').attr('src', e.target.result);
		        };
		        reader.readAsDataURL(input.files[0]);
		    };
		    return this;
		},

		// Update File Placeholder Text
		showFilePath 		: function (path) {
			var admin 	= this;
			if (path.length) $(admin.fileMask).val("UPLOAD READY");
			return this;
		},

		// Clear Form Inputs
		clearForm 			: function () {
			setTimeout(function () {
				$('.input-field').val('');
			}, 500);
			return this;
		},

		// Get Form Values
		submitForm 			: function (form) {
			var data = new FormData(form);
			console.log(data);
			$.ajax({
				type 		: "POST",
				url 		: "/admin/submit",
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
				console.log("POST", "/admin/submit", data);
			}).always(function () {
				console.debug("XHR Notification: Request Complete");
			});
			return this;
		},

		/*
		Utility
		*/

		//Remove Value From Array
		removeArrayValue 	: function (arr) {
			var what, a = arguments, l = a.length, ax;
		    while (l > 1 && arr.length) {
		        what = a[--l];
		        while ((ax = arr.indexOf(what)) !== -1) arr.splice(ax, 1);
		    };
		    return arr;
		}
	};

	/*
	Configure
	*/

	var config = {
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
					def 			: 		"/admin/new",
					new 			: 		"/admin/new",
					retrieve 		: 		"/admin/retrieve",
					getByTag 		: 		"/admin/getByTag",
					search 			: 		"/admin/search"
			}
		},
		typeOpts 	: 		["Slideshow", "Blogpost", "Soundcloud", "Instagram"],
		contentOpts : 		["About", "Website", "Interactive", "Music", "Sound", "Photography", "Technology", "Codesnippets", "Experience"]
	};

	/*
	Instatiation & Initialization
	*/

	admin = new Admin (config);
	ko.applyBindings(admin, document.getElementById(admin.form.split("#")[1]));

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
		admin.toggleSub();
		admin.toggleMenu();
	});

	// Close Submission Pane
	$(admin.closeSub).on("click", function (e) {
		admin.toggleSub();
	});

	// Select All Tiles
	$(admin.selectTiles).on("click", function (e) {
		admin.selectAllTiles();
	});

	// Deselect ALl Tiles
	$(admin.deselectTiles).on("click", function (e) {
		admin.deselectAllTiles();
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
			admin.deselectAllTiles();
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
			admin.deselectAllTiles();
			console.log("POST done");
		});
	});

	// Search Bar Enter
	$(admin.searchBar).on("keydown", function (e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			var query = $(admin.searchBar).text();
			admin.explorer.search(query, function () {
				admin.deselectAllTiles();
				$(admin.searchBar).text("");
			});
		};
	});

	// Search Bar Go
	$(admin.searchGo).on("click", function (e) {
		var query = $(admin.searchBar).text().toLowerCase();
		console.log(query);
		admin.explorer.search(query, function () {
			admin.deselectAllTiles();
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
		var form = $(admin.form)[0];
		console.log(form);
		e.preventDefault();
		admin.submitForm(form);
	});

	// Close Submission
	$(admin.submit).on("click", function (e) {
		$(admin.sub).removeClass('active');
		var delay = setTimeout(
			function () { 
				admin.explorer.request({
					type 		: "GET",
					route 		: "/admin/new",
					data 		: {}
				},  function () {
					var key = "updatedAt",
						val = null;
					admin.explorer.generateTiles(key, val);
					admin.deselectAllTiles();
					console.log("GET done");
				})
			}, 2000);
	});

})(jQuery, ko, Explorer, Tile)
