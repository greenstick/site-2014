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
	credentials = (typeof process.env.NODE_ENV === 'undefined') ? require('../development/credentials.js') : undefined;

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
		form 				= new formidable.IncomingForm({
			multiples 		: true,
			keepExtensions 	: true
		}),
		filesUploaded 		= 0,
		filesDetected 		= 0,
		s3FilePaths			= [];
		console.log(date);
	// Parse Form Using Formidable
	form.parse(req, function (error, fields, files) {
		if (error) return console.log(error);
	});

/*
Formidable Events
*/

	form.on('file', function (name, file) {
		filesDetected++;
		console.log("Status: File Detected");
		console.log("Status: " + filesDetected + " Files Detected");
		console.log("Status: " + filesUploaded + " Files Uploaded");
		// console.log(file);
		// console.log(file.path);
		// console.log(file.size);
		// console.log(file.type);
		// console.log(file.name);

// Need to figure out a way of creating unique file names on the fly
// May be able to get this hash from the temporary file path generated
// By the browser. Research whether these hashes are unique or just randomized

		var read 				= fs.createReadStream(file.path),
			compress 			= zlib.createGzip(),
			bytes 				= file.size,
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
				console.log("Status: New Uploader");
				uploadStream.on('chunk', function (data) {
					console.log(data);
					console.log('Status: Chunk Streamed');
				});
				uploadStream.on('uploaded', function (data) {
					console.log("Status: Uploaded, Logging S3 Upload Data...");
					console.log(data)
					s3FilePaths.push(data);
					filesUploaded++;
					if (filesDetected === filesUploaded) {
						// Setup Client Sent Data
						var projectUUID 	= uuid.v4(),
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

					};
				});
				console.log("Status: Uploading...");
				read.pipe(compress).pipe(uploadStream);
			});
			// Save Piece
			// piece.save(function (error, piece, count) {
			// 	if (error) return console.log(error);
			// });
	});
	// Formidable Upload Progress Event - Use This To Roll Progress Bar
	form.on('progress', function (received, expected) {
		console.log(((received/expected).toFixed(2) * 100) + "%");
		res.json((received/expected).toFixed(2))
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