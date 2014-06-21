/*
Require Dependencies
*/

var Piece 	= require('../models/piece.js'),
	knox 	= require('knox'),
	fs 		= require('fs');

/*
General API Methods
*/

//Retrieve Pieces
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({curated: true}, 'location curated featured title url content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show Featured
exports.showFeatured 	= function (req, res) {
	var query 			= Piece.find({featured: true}, '*');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
//Retrieve by Search Query
exports.search 	= function (req, res) {
	res.json({"Search Query Executed": true});
};
