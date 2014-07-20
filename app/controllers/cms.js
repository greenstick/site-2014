/*
Require Dependencies
*/

var Piece 		= require('../models/piece.js'),
	knox 		= require('knox'),
	fs 			= require('fs'),
	validate 	= require('../utility/validation.js');

/*
CMS API Methods
*/

//Submit Piece
exports.submit 			= function (req, res) {
	//Setup Client Sent Data
	var date 			= new Date(),
		pID 			= ((Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4)),
		data 			= req.query,
		locationX 		= null,
		locationY 		= null,
		title 			= validate.str(data.title),
		client 			= validate.str(data.client),
		url 			= validate.url(data.url),
		content 		= validate.str(data.content),
		description 	= validate.str(data.description),
		twitter 		= null,
		facebook 		= null,
		tags 			= validate.tags(data.tags).toLowerCase(),
		createdAt 		= date;

		console.log(tags);

	//Set Data to Schema
	var piece 				= new Piece({
		pID 				: 	pID,
		location 		: 	{
			x 					: locationX,
			y 					: locationY,
		},
		curated 			: 	false,
		featured 			: 	false,
		title 				: 	title,
		client 				: 	client,
		url 				: 	url,
		content 			: 	content, 
		description 	: 		description,
		popularity 		: 		null,
		social 			: 	{
			twitter 			: twitter,
			facebook 			: facebook
		},
		tags 				: 	tags,
		createdAt 			: 	date,
		updatedAt 			: 	null
	});
	//Save Piece
	piece.save(function (error, piece, count) {
		if (error) return console.trace(error);
	});
};

//Retrieve Pieces
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show New Pieces
exports.new 			= function (req, res) {
	var query 			= Piece.find({updated: null}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces)
		})
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
//Show curated Pieces
exports.showCurated 	= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces)
		});
};
//Show Hidden Pieces
exports.showHidden 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.trace(error);
			res.json(pieces);
		});
};
//Show Featured
exports.showFeatured 	= function (req, res) {
	var query 			= Piece.find({featured: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
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
//Retrieve by Search Query
exports.search 	= function (req, res) {
	var searchQuery = validate.str(req.param("query"));
	res.json({
		"Search Query Executed" : true,
		"Query String" 			: searchQuery
	});
};