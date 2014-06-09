/*
Require Dependencies
*/

var Piece 	= require('../models/piece.js'),
	knox 	= require('knox'),
	fs 		= require('fs');

/*
General API Methods
*/

//Retrieve Stories
exports.getTiles = function (req, res) {
	var query = Piece.find({approved: true}, 'location approved featured title url content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
