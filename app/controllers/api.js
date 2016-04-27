/*
Import Dependencies, etc.
*/

var express 	= require('express'),
	router 		= express.Router(),
	Piece 		= require('../models/piece.js'),
	validate 	= require('../modules/security/sanitize.js');

/*
Configure 
*/

// ...

/*
Apply
*/

module.exports 		= function (app) {

	// Set Router Path
	app.use("/api", router);

};

/*
API Methods
*/

// Show New Pieces
router.get('/api/new', function (req, res) {
	var query 			= Piece.find({updated: null}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces)
		});
});

// Retrieve Pieces
router.get('/api/retrieve', function (req, res) {
	var query 			= Piece.find({curated: true}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
});

// Show Featured
router.get('/api/showFeatured', function (req, res) {
	var query 			= Piece.find({featured: true}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Retrieve by Search Query
router.get('/api/search', function (req, res) {
	var queryStr 		= validate.str(req.params.query),
		queryArr 		= (validate.str(queryStr)).toLowerCase().split(" ");
		query 			= Piece.find({tags: {$in: queryArr}}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});