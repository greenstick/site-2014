/*
Require Dependencies
*/

var Piece 	= require('../models/piece.js')
	knox 	= require('knox'),
	fs 		= require('fs');

/*
API Methods
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
		approved: 			false,
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
	piece.save(function (error, piece, count) {
		if (error) return console.trace(error);
	});
};

//Retrieve Pieces
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({approved: true}, '*', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};

//Approve Piece
exports.approve 		= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {approved: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show Approved Pieces
exports.showApproved 	= function (req, res) {
	var query 			= Piece.find({approved: true}, '*');
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces)
		});
};
//Hide Piece
exports.hide 			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {approved: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show Hidden Pieces
exports.showHidden 		= function (req, res) {
	var query 			= Piece.find({approved: true}, '*', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Feature Piece
exports.feature 		= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {featured: true, approved: true, updatedAt: updated}}, {multi: true});
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
