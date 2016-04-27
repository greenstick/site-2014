/*
Import Dependencies, etc.
*/

var express 	= require('express'),
	router 		= express.Router(),
	passport 	= require('passport'),

	// JS Libraries
	lib 		= {
		analytics 	: "analytics.min.js",
		custbind 	: "custom-bindings.js",
		d3 			: "d3.min.js",
		jquery 		: "jquery.min.js",
		ko 			: "ko.min.js",
		pace 		: "pace.min.js",
		scrollbar 	: "perfect-scrollbar.min.js"
	},

	// Custom JS
	js 			= {
		admin 		: "core/admin.js",
		app 		: "core/app.js",
		explore		: "core/explore.js",
		tile 		: "core/tile.js",
		flip 		: "core/flip.js",
		iris 		: "core/iris.js"
	},

	// CSS
	css 		= {
		main 		: "core/main.css",
		admin 		: "admin.css",
		previous 	: "previous.css"
	};

/*
Configure
*/
	
// ...

/*
Apply
*/

module.exports 		= function (app) {

	// Set Router Path
	app.use("/", router);

};

/*
General Methods
*/

// Index
router.get('/', function (req, res) {
	res.render('', {
		title 	: 'Welcome',
		css 	: [],
		libs 	: [lib.d3, lib.jquery, lib.analytics],
		js 		: [js.iris]
	});
});

// Explore
router.get('/explore', function (req, res) {
	res.render('explore', {
		title: 'Explore',
		css 	: [],
		libs 	: [lib.d3, lib.jquery, lib.analytics, lib.ko, lib.scrollbar],
		js 		: [js.tile, js.explore, js.app]
	});
});

// Admin - Private
router.get('/admin', passport.authenticate('basic', {session: false}), function (req, res) {
	res.render('admin', {
		title: 'Admin',
		css 	: [css.admin],
		libs 	: [lib.d3, lib.jquery, lib.analytics, lib.ko, lib.scrollbar],
		js 		: [js.tile, js.explore, js.admin]
	});
});