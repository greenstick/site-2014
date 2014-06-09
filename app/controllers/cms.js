/*
Require Dependencies
*/

var Piece 	= require('../models/piece.js'),
	knox 	= require('knox'),
	fs 		= require('fs');

/*
CMS API Methods
*/

//Submit Piece
exports.submit 			= function (req, res) {
	//Setup Client Sent Data
	var date 			= new Date(),
		data 			= req.param("data"),
		locationX 		= data.location.x,
		locationY 		= data.location.y,
		title 			= data.title,
		url 			= data.url,
		content 		= data.content,
		description 	= data.description,
		twitter 		= data.twitter,
		facebook 		= data.facebook,
		tags 			= data.tags,
		createdAt 		= date;

	//Set Data to Schema
	var piece 			= new Piece({
		location: {
			x: locationX,
			y: locationY,
		},
		curated: 			false,
		featured: 			false,
		title: 				title,
		url: 				url,
		content: 			content, 
		description: 		description,
		popularity: 		null,
		social: {
			twitter: 		twitter,
			facebook: 		facebook
		},
		tags: 				tags,
		createdAt: 			date,
		updatedAt: 			null
	});
	//Save Piece
	Piece.save(function (error, piece, count) {
		if (error) return console.trace(error);
	});
};

//Retrieve Stories
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({curated: true}, 'location curated featured title url content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};

//Approve Piece
exports.curate			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {curated: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show curated Pieces
exports.showCurated 	= function (req, res) {
	var query 			= Piece.find({curated: true}, '*');
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces)
		});
};
//Hide Piece
exports.hide 			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {curated: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show Hidden Pieces
exports.showHidden 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '*', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Feature Piece
exports.feature 		= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {featured: true, curated: true, updatedAt: updated}}, {multi: true});
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
//Show New Pieces
exports.new 			= function (req, res) {
	var query 			= Piece.find({updated: null}, '*');
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces)
		})
};
//Delete Piece
exports.delete 			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.remove({_id: {$in: posts}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json({deleted: posts});
		});
};