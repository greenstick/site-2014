module.exports = function(app){

	//Require Portfolio Controller
	var portfolio 	= require('../app/controllers/portfolio.js'),
		cms 		= require('../app/controllers/cms.js'),
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
CMS Routes
*/
	//Basic Retrieval
	app.get('/retrieve', cms.retrieve);

	//Show Featured
	app.get('/showFeatured', cms.showFeatured);

	//New
	app.get('/new', passport.authenticate('basic', {session: false}), cms.new);

	//Approve
	app.post('/curate', passport.authenticate('basic', {session: false}), cms.curate);

	//Hide
	app.post('/hide', passport.authenticate('basic', {session: false}), cms.hide);

	//Feature
	app.post('/feature', passport.authenticate('basic', {session: false}), cms.feature);

	//Delete
	app.post('/delete', passport.authenticate('basic', {session: false}), cms.delete);
	
	//Show Approved
	app.get('/showCurated', passport.authenticate('basic', {session: false}), cms.showCurated);

	//Show Hidden
	app.get('/showHidden', passport.authenticate('basic', {session: false}), cms.showHidden);

};
