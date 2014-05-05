module.exports = function(app){

	//Require Portfolio Controller
	var portfolio 	= require('../app/controllers/portfolio'),
		passport 	= require('passport');

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
};
