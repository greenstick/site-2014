/*
Require Modules
*/

var Piece 		= require('../models/piece.js'),
	fs 			= require('fs'),
	formidable 	= require('formidable'),
	zlib 		= require('zlib'),
	AWS 		= require('aws-sdk'),
	Stream 		= require('s3-upload-stream').Uploader,
	validate 	= require('../utility/validation.js'),
	uuid 		= require('node-uuid'),
	credentials = (typeof process.env.NODE_ENV === 'undefined') ? require('../development/credentials.js') : false;
	
	// Configure AWS Connection Timeout
	AWS.config.httpOptions = {timeout: 5000};
/*
CMS API Methods
*/

// Submit Piece
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
	// When File is Detected
	form.on('file', function (name, file) {
		console.log(file);
		filesDetected++;
		console.log("Status: File Detected - " + filesUploaded + '/' + filesDetected + " Uploaded");
		var read 				= fs.createReadStream(file.path),
			compress 			= zlib.createGzip(),
			fileType 			= file.name.split('.').pop(),
			fileName 			= uuid.v4() + "-admin-" + dateString + "." + fileType,
			aws 		 		= {
				"accessKeyId" 		: process.env.AWS_ACCESSKEY 	|| credentials.aws.accesskey,
				"secretAccessKey" 	: process.env.AWS_SECRETKEY 	|| credentials.aws.secretkey,
			},
			bucket 				= {
				"Bucket" 			: process.env.AWS_BUCKET 		|| credentials.aws.bucket,
				"Key" 				: fileName,
				"ContentType" 		: file.type,
				"ContentEncoding" 	: "gzip"
			},
			stream 				= new Stream(aws, bucket, function (error, uploadStream) {
				if (error) return console.log(error, error.stack);
				// Read File, Compress, & Stream to S3
				console.log("Status: New Uploader Streaming");
				// read.pipe(compress).pipe(uploadStream);
				read.pipe(compress).pipe(uploadStream);
				// When A Part Has Completed
				uploadStream.on('part', function (details) {
					console.log("Status: Part Streamed...");
					console.log(details);
				});
				// Once File Has Been Uploaded
				uploadStream.on('uploaded', function (data) {
					console.log("Status: Uploaded " + data.Key);
					s3FilePaths.push({path: data.Key});
					console.log(s3FilePaths);
					filesUploaded++;
					// Save Piece
					if (filesUploaded === filesDetected && s3FilePaths.length > 0) {
						console.log("Status: Files Uploaded");
						var query 		= Piece.update({projectUUID: projectUUID}, {$set: {files: s3FilePaths}});
							query.exec(function (error, updated) {
								if (error) return console.log(error);
								console.log("Status: CloudFront URL Updated");
							});
					}
				});
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
		var data 			= req.body,
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
		// Set Data & Default Values to Schema
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
			createdAt 			: 	createdAt,
			updatedAt 			: 	null
		});
		// Save Piece to Mongo
		piece.save(function (error, piece, count) {
			if (error) return console.log(error);
			console.log("Status: Saved to Mongo");
			res.location(req.headers.referer);
		});
	});

};

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
		// Piece.remove({}, function (error, removed) {
		// 	if (error) return console.log(error);
		// 	console.log(removed);
		// });
	var query 			= Piece.find({updated: null}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces)
		});
};
// Approve Piece
exports.curate			= function (req, res) {
	var posts 			= req.param("selectedTiles"),
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
};
// Hide Piece
exports.hide 			= function (req, res) {
	var posts 			= req.param("selectedTiles"),
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: false, featured: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
};
// Feature Piece
exports.feature 		= function (req, res) {
	var posts 			= req.param("selectedTiles"),
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: true, featured: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
};
// Unfeature Piece
exports.unfeature 		= function (req, res) {
	var posts 			= req.param("selectedTiles"),
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {featured: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
};
// Show curated Pieces
exports.showCurated 	= function (req, res) {
	var query 			= Piece.find({curated: true}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces)
		});
};
// Show Hidden Pieces
exports.showHidden 		= function (req, res) {
	var query 			= Piece.find({curated: false}, '_id projectUUID location curated featured title client url files content description popularity social tags createdAt updatedAt', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
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
// Delete Piece
exports.delete 			= function (req, res) {
	var posts 			= req.param("selectedTiles"),
		updated 		= new Date(),
		query 			= Piece.remove({projectUUID: {$in: posts}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json({deleted: pieces});
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