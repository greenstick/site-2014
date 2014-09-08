/*
Require Modules
*/

var Piece 		= require('../models/piece.js'),
	fs 			= require('fs'),
	util 		= require('util'),
	formidable 	= require('formidable'),
	zlib 		= require('zlib'),
	Stream 		= require('s3-upload-stream').Uploader,
	validate 	= require('../utility/validation.js'),
	uuid 		= require('node-uuid'),
	AWS 		= require('aws-sdk'),
	credentials = (typeof process.env.NODE_ENV === 'undefined') ? require('../development/credentials.js') : undefined;

	AWS.config.httpOptions = {timeout: 5000};
/*
CMS API Methods
*/

// Submit Piece

/*
Outline:

- Set date timestamp to be used
- Create new formidable instance
- Use formidable parse function
- Once form has been received, send form received status to client
- If files are detected, for each file setup new stream to S3 by
	- Creating read stream
	- Creating gZip compression
	- Getting bytes expected - from client, but also possibly from formidable
	- Create new upload stream using above params and s3-upload-stream module
	- Once all files have been streamed, save form fields + S3/Cloudfront locations to Mongo
- Else, no files, save files to Mongo
- Finally send response using JSON of success (just to see in network tab logs)

*/

exports.submit 			= function (req, res) {
	// Define date, form, form options
	var date 	 			= new Date(),
		dateString 			= date.valueOf(),
		projectUUID 		= uuid.v4(),
		form 				= new formidable.IncomingForm({
			multiples 		: true,
			keepExtensions 	: true
		}),
		filesDetected 		= 0,
		filesUploaded 		= 0,
		s3FilePaths			= [];

	// Parse Form Using Formidable
	form.parse(req, function (error, fields, files) {
		if (error) return console.log(error);
	});

/*
Formidable Events
*/

	form.on('file', function (name, file) {
		filesDetected++;
		console.log("Status: File Detected - " + filesUploaded + '/' + filesDetected + " Uploaded");
		var read 				= fs.createReadStream(file.path),
			compress 			= zlib.createGzip(),
			filePath 			= uuid.v4() + "-admin-" + dateString,
			aws 		 		= {
				"accessKeyId" 		: process.env.AWS_ACCESSKEY || credentials.aws.accesskey,
				"secretAccessKey" 	: process.env.AWS_SECRETKEY || credentials.aws.secretkey
			},
			bucket 				= {
				"Bucket" 			: process.env.AWS_BUCKET 	|| credentials.aws.bucket,
				"Key" 				: filePath,
				"ContentType" 		: file.type
			},
			stream 				= new Stream(aws, bucket, function (error, uploadStream) {
				if (error) return console.log(error, error.stack);
				console.log("Status: New Uploader Streaming");
				// Once File Has Been Uploaded
				uploadStream.on('uploaded', function (data) {
					console.log("Status: Uploaded " + data.Key);
					s3FilePaths.push(data.Key);
					console.log(s3FilePaths);
					filesUploaded++;
					// Save Piece
					if (filesUploaded === filesDetected && s3FilePaths.length > 0) {
						console.log("Status: Files Uploaded");
						var updated 	= new Date(),
							query 		= Piece.update({projectUUID: projectUUID}, {$set: {files: s3FilePaths, updatedAt: updated}});
							query.exec(function (error, piece) {
								if (error) return console.log(error);
								console.log("Status: Mongo Updated");
								console.log(piece);
								return res.json(piece);
							});
					}
				});
				// Read File, Compress, & Stream to S3
				read.pipe(compress).pipe(uploadStream);
			});
	});
	// Formidable Upload Progress Event - Use This To Roll Progress Bar
	form.on('progress', function (received, expected) {
		console.log("Status: Form " + ((received/expected).toFixed(2) * 100) + "% Uploaded");
	});
	// Once Form Data Has Been Uploaded
	form.on('end', function () {
		console.log("Status: Form Received");
		// Setup Client Sent Data
		var data 			= req.query,
			locationX 		= null,
			locationY 		= null,
			title 			= validate.str(data.title),
			client 			= validate.str(data.client),
			url 			= validate.url(data.url),
			files	 		= s3FilePaths,
			content 		= validate.str(data.content),
			description 	= validate.str(data.description),
			twitter 		= null,
			facebook 		= null,
			tags 			= validate.tags(data.tags),
			createdAt 		= date;
		// Set Data to Schema
		var piece 				= new Piece({
			projectUUID 		: 	projectUUID,
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
		// Save Piece to Mongo
		piece.save(function (error, piece, count) {
			if (error) return console.log(error);
			console.log("Status: Saved to Mongo");
			return res.json(piece);
		});
	});

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