module.exports = function(app){

	//Require Portfolio Controller
	var portfolio 	= require('../app/controllers/portfolio.js'),
		api 		= require('../app/controllers/api.js'),
		passport 	= require('passport');

/*
Public Routes
*/

	//Index
	app.get('/', portfolio.index);

	//Explore
	app.get('/explore', portfolio.explore);

	//Portfolio
	app.get('/portfolio', portfolio.portfolio);

	//Interactives
	app.get('/interactives', portfolio.interactives);

	//Websites
	app.get('/websites', portfolio.websites);

	//Music
	app.get('/music', portfolio.music);

	//Sound Design
	app.get('/sounddesign', portfolio.sounddesign);

	//Photography
	app.get('/photography', portfolio.photography);

	//Graphic Design
	app.get('/technologies', portfolio.technologies);

/*
Private Routes
*/

	//Admin
	app.get('/admin', passport.authenticate('basic', {session: false}), portfolio.admin);

/*
API Public Routes
*/
	//Basic Retrieval
	app.get('/retrieve', api.retrieve);

	//Show Featured
	app.get('/showFeatured', api.showFeatured);

/*
API Private Routes
*/

	//New
	app.get('/new', passport.authenticate('basic', {session: false}), api.new);

	//Approve
	app.post('/approve', passport.authenticate('basic', {session: false}), api.approve);

	//Hide
	app.post('/hide', passport.authenticate('basic', {session: false}), api.hide);

	//Feature
	app.post('/feature', passport.authenticate('basic', {session: false}), api.feature);

	//Delete
	app.post('/delete', passport.authenticate('basic', {session: false}), api.delete);
	
	//Show Approved
	app.get('/showApproved', passport.authenticate('basic', {session: false}), api.showApproved);

	//Show Hidden
	app.get('/showHidden', passport.authenticate('basic', {session: false}), api.showHidden);

};
