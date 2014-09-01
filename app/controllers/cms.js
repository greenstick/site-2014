/*
Require Modules
*/

var Piece 		= require('../models/piece.js'),
	fs 			= require('fs'),
	util 		= require('util'),
	formidable 	= require('formidable'),
	zlib 		= require('zlib'),
	uploader 	= require('s3-upload-stream').Uploader,
	validate 	= require('../utility/validation.js'),
	credentials = (process.env.NODE_ENV === 'production') ? undefined : require('../development/credentials.js');

/*
CMS API Methods
*/

// Submit Piece
exports.submit 			= function (req, res) {
	var date 				= new Date(),
		form 				= new formidable.IncomingForm(),
		filesUploaded 		= 0;
		form.multiples		= true;
		form.keepExtensions = true;
		form.parse(req, function (error, fields, files) {
			if (error) return console.log(error);
			form.on('progress', function (received, expected) {
				console.log((received/expected).toFixed(2) + "%");
			});
			form.on('file', function (name, file) {
				console.log("Status: File Detected");
				if (file) {
					var read 				= fs.createReadStream(path),
						compress 			= zlib.createGzip(),
						bytes 				= req.form.bytesExpected,
						aws 		 		= {
							"accessKeyId" 		: process.env.AWS_ACCESSKEY || credentials.aws.accesskey,
							"secretAccessKey" 	: process.env.AWS_SECRETKEY || credentials.aws.secretkey,
							"region" 			: process.env.AWS_REGION 	|| credentials.aws.region
						},
						bucket 				= {
							"Bucket" 			: process.env.AWS_BUCKET 	|| credentials.aws.bucket,
							"Key" 				: file.name + '-' + date
						},
						stream 				= new uploader(aws, bucket, function (error, uploadStream) {
							if (error) return console.log(error)
							console.log("Status: New Uploader");
							uploadStream.on('chunk', function (data) {
								console.log(data);
								console.log('Status: Chunk Streamed');
							});
							uploadStream.on('uploaded', function (data) {
								console.log("Status: Uploaded " + data);
								filesUploaded++;
								if (files.files.length === filesUploaded) {
									// Setup Client Sent Data
									var pID 			= ((Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4) + '-' + (Math.random() + 1).toString(36).substring(2, 4) + (Math.random() + 1).toString(36).substring(2, 4)),
										data 			= req.query,
										locationX 		= null,
										locationY 		= null,
										title 			= validate.str(data.title),
										client 			= validate.str(data.client),
										url 			= validate.url(data.url),
										files	 		= files,
										content 		= validate.str(data.content),
										description 	= validate.str(data.description),
										twitter 		= null,
										facebook 		= null,
										tags 			= validate.tags(data.tags),
										createdAt 		= date;

									// Set Data to Schema
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
										files 				: 	files,
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

								};
							});
							console.log("Status: Uploading...");
							read.pipe(compress).pipe(uploadStream);
						});
						// Save Piece
						// piece.save(function (error, piece, count) {
						// 	if (error) return console.log(error);
						// });
				};
			});
		});
		// form.onPart(part);
};

// Retrieve Pieces
exports.retrieve 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Show New Pieces
exports.new 			= function (req, res) {
	var query 			= Piece.find({updated: null}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces)
		})
};
// Approve Piece
exports.curate			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {curated: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Hide Piece
exports.hide 			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {curated: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Feature Piece
exports.feature 		= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.update({_id: {$in: posts}}, {$set: {featured: true, curated: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Show curated Pieces
exports.showCurated 	= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces)
		});
};
// Show Hidden Pieces
exports.showHidden 		= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Show Featured
exports.showFeatured 	= function (req, res) {
	var query 			= Piece.find({featured: true}, '_id pID location curated featured title client url content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
};
// Delete Piece
exports.delete 			= function (req, res) {
	var posts 			= req.param("selectedPosts"),
		updated 		= new Date(),
		query 			= Piece.remove({_id: {$in: posts}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json({deleted: posts});
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