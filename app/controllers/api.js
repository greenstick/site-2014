/*
Require Dependencies
*/

var Piece 		= require('../models/piece.js'),
	validate 	= require('../utility/validation.js');

/*
General API Methods
*/

// Retrieve Pieces
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Show New Pieces
exports.new 			= function (req, res) {
	var query 			= Piece.find({updated: null}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces)
		});
};
// Show Featured
exports.showFeatured 	= function (req, res) {
	var query 			= Piece.find({featured: true}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
};
// Retrieve by Search Query
exports.search 	= function (req, res) {
	var queryStr = validate.str(req.param("query"));
		queryArr = (validate.str(queryStr)).toLowerCase().split(" ");
		res.json({
			"Search Query Executed" : true,
			"Query String" 			: queryArr
		});
};
