module.exports = function(app){

	// Require Portfolio Controller
	var portfolio 		= require('../app/controllers/portfolio.js'),
		cms 			= require('../app/controllers/cms.js'),
		api 			= require('../app/controllers/api.js'),
		passport 		= require('passport');
		
/*
Public Locations
*/

	// Index
	app.get('/', portfolio.index);

	// Explore
	app.get('/explore', portfolio.explore);

/*
Private Locations
*/

	// Admin
	app.get('/admin', passport.authenticate('basic', {session: false}), portfolio.admin);

/*
API Routes
*/

	// Get New
	app.get('/api/new', api.new);

	// Get Tiles
	app.get('/api/retrieve', api.retrieve);

	// Show Featured
	app.get('/api/showFeatured', api.showFeatured);

	// Search
	app.get('/api/search', api.search);

/*
CMS Routes
*/

	app.post('/cms/submit', passport.authenticate('basic', {session: false}), cms.submit)

	// Basic Retrieval
	app.get('/cms/retrieve', passport.authenticate('basic', {session: false}), cms.retrieve);

	// New
	app.get('/cms/new', passport.authenticate('basic', {session: false}), cms.new);

	// Approve
	app.get('/cms/curate', passport.authenticate('basic', {session: false}), cms.curate);

	// Hide
	app.get('/cms/hide', passport.authenticate('basic', {session: false}), cms.hide);

	// Feature
	app.get('/cms/feature', passport.authenticate('basic', {session: false}), cms.feature);

	// Unfeature
	app.get('/cms/unfeature', passport.authenticate('basic', {session: false}), cms.unfeature);

	// Show Approved
	app.get('/cms/showCurated', passport.authenticate('basic', {session: false}), cms.showCurated);

	// Show Hidden
	app.get('/cms/showHidden', passport.authenticate('basic', {session: false}), cms.showHidden);

	// Show Featured
	app.get('/cms/showFeatured', passport.authenticate('basic', {session: false}), cms.showFeatured);
	
	// Delete
	app.get('/cms/delete', passport.authenticate('basic', {session: false}), cms.delete);

	// Search
	app.get('/cms/search', passport.authenticate('basic', {session: false}), cms.search);

};
