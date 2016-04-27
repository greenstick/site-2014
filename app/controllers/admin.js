/*
Import Dependencies, etc.
*/

var express 	= require('express'),
	router 		= express.Router(),
	Piece 		= require('../models/piece.js'),
	passport 	= require('passport'),
	Streamer 	= require('../modules/utility/stream.js'),
	Sanitizer 	= require('../modules/security/sanitize.js'),
	fs 			= require('fs'),
	formidable 	= require('formidable'),
	zlib 		= require('zlib'),
	AWS 		= require('aws-sdk'),
	Stream 		= require('s3-upload-stream').Uploader,
	uuid 		= require('node-uuid'),
	instagram   = require('instagram-node').instagram(),
	credentials = process.env.NODE_ENV ? false : require('../development/credentials.js');

/*
Configure 
*/

// Setup Router Authentication for All Endpoints
router.use(passport.authenticate('basic', {session: false}));

// Configure AWS Credentials
AWS.config.credentials = {
	"accessKeyId" 		: process.env.AWS_ACCESSKEY 	|| credentials.aws.accesskey,
	"secretAccessKey" 	: process.env.AWS_SECRETKEY 	|| credentials.aws.secretkey
};

// Configure AWS Connection Timeout
AWS.config.httpOptions = {
	timeout 			: 2500
};


/*
Apply
*/

module.exports 		= function (app) {

	// Set Router Path
	app.use("/admin/", router);

};

/*
Admin Routes & Methods
*/

// Submit Piece
router.post('/submit', function (req, res) {
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
		s3FilePaths			= [],
		sanitize 			= new Sanitizer();
	// Parse Form Using Formidable
	form.parse(req, function (error, fields, files) {
		if (error) return console.log(error);
	});
	// When File is Detected
	form.on('file', function (name, file) {
		if (file.size === 0) return;
		filesDetected++;
		var read 				= fs.createReadStream(file.path),
			compress 			= zlib.createGzip(),
			fileType 			= file.name.split('.').pop(),
			fileName 			= uuid.v4() + "-" + dateString + "." + fileType,
			request 			= {
				"Bucket" 			: process.env.AWS_BUCKET || credentials.aws.bucket,
				"Key" 				: fileName,
				"ContentType" 		: file.type,
				"ContentEncoding" 	: "gzip"
			},
			stream 				= new Stream(request, function (error, uploadStream) {
				if (error) return console.log(error, error.stack);
				// Read File, Compress, & Stream to S3
				read.pipe(compress).pipe(uploadStream);
				// Once File Has Been Uploaded
				uploadStream.on('uploaded', function (data) {
					s3FilePaths.push({path: data.Key});
					filesUploaded++;
					// Save Piece
					if (filesUploaded === filesDetected && s3FilePaths.length > 0) {
						var query 		= Piece.update({projectUUID: projectUUID}, {$set: {files: s3FilePaths}});
							query.exec(function (error, updated) {
								if (error) return console.log(error);
								console.log("MONGO STATUS: Image Update Successful");
							});
					}
				});
			});
	});
	// Formidable Upload Progress Event - Use This To Roll Progress Bar
	form.on('progress', function (received, expected) {
		console.log("Status: Form " + ((received/expected) * 100).toFixed(0) + "% Uploaded");
	});
	// Once Form Data Has Been Uploaded
	form.on('end', function () {
		// Setup Client Sent Data
		var data 			= req.body,
			locationX 		= null,
			locationY 		= null,
			title 			= sanitize.str(data.title),
			client 			= sanitize.str(data.client),
			url 			= sanitize.url(data.url),
			files	 		= s3FilePaths,
			content 		= sanitize.str(data.content),
			type 			= sanitize.str(data.type),
			description 	= sanitize.str(data.description),
			twitter 		= sanitize.str(data.twitter),
			facebook 		= sanitize.str(data.facebook),
			linkedin 		= sanitize.str(data.linkedin),
			tags 			= sanitize.tags(data.tags),
			createdAt 		= date,
			// Set Data & Default Values to Schema
			piece 			= new Piece({
				projectUUID 		: projectUUID,
				location 			: {
					x 					: locationX,
					y 					: locationY
				},
				curated 			: false,
				featured 			: false,
				title 				: title,
				client 				: client,
				url 				: url,
				files 				: files,
				content 			: content, 
				type 				: type,
				description 		: description,
				popularity 			: null,
				social 				: {
					twitter 			: twitter,
					facebook 			: facebook,
					linkedin 			: linkedin
				},
				tags 				: tags,
				createdAt 			: createdAt,
				updatedAt 			: null
			});
			console.log(req);
		// Save Piece to Mongo
		var query = piece.save(function (error, piece, count) {
			if (error) return console.log(error);
			console.log("MONGO STATUS: Document Save Successful");
			res.json(piece);
		});
	});
});

// Retrieve All Cureated Pieces
router.get('/retrieve', function (req, res) {
	var query 			= Piece.find({curated: true}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt', {limit: 16, sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
});

// Show New Piece(s)
router.get('/new', function (req, res) {
	var query 			= Piece.find({updated: null}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json(pieces);
		});
});

// Approve Piece(s)
router.get('/curate', function (req, res) {
	var posts 			= req.params.selectedTiles,
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Hide Piece(s)
router.get('/hide', function (req, res) {
	var posts 			= req.params.selectedTiles,
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: false, featured: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Feature Piece(s)
router.get('/feature', function (req, res) {
	var posts 			= req.params.selectedTiles,
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {curated: true, featured: true, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Unfeature Piece(s)
router.get('/unfeature', function (req, res) {
	var posts 			= req.params.selectedTiles,
		updated 		= new Date(),
		query 			= Piece.update({projectUUID: {$in: posts}}, {$set: {featured: false, updatedAt: updated}}, {multi: true});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Show Approved Piece(s)
router.get('/showCurated', function (req, res) {
	var query 			= Piece.find({curated: true}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces)
		});
});

// Show Hidden Piece(s)
router.get('/showHidden', function (req, res) {
	var query 			= Piece.find({curated: false}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt', {sort: {updatedAt: -1}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Show Featured Piece(s)
router.get('/showFeatured', function (req, res) {
	var query 			= Piece.find({featured: true}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

// Delete Piece(s)
router.get('/delete', function (req, res) {
	var posts 			= req.params.selectedTiles,
		files 			= req.params.selectedFiles,
		updated 		= new Date(),
		s3 				= new AWS.S3();
	if (files) {
		var s3MultiDelete 	= function (items) {
			var arr = [];
			for (var i = 0; i < items.length; i++) {
				var obj = {"Key": items[i]};
				arr.push(obj);
			}
			return arr;
		},
		request 			= {
			"Bucket" 			: process.env.AWS_BUCKET || credentials.aws.bucket,
			"Delete" 			: {
				"Objects" 			: s3MultiDelete(files)
			}
		};
		var query = Piece.remove({projectUUID: {$in: posts}});
		s3.deleteObjects(request, function (error, objects) {
			if (error) return console.log(error);
			query.exec(function (error, pieces) {
				if (error) return console.log(error);
				res.json({deleted: pieces});
			});
		});
	} else {
		var query = Piece.remove({projectUUID: {$in: posts}});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			res.json({deleted: pieces});
		});
	}
});

// Retrieve Piece(s) by Search Query
router.get('/search', function (req, res) {
	var sanitize = new Sanitizer(),
		queryStr = sanitize.str(req.params.query),
		queryArr = (sanitize.str(queryStr)).toLowerCase().split(" ");
		query 	 = Piece.find({tags: {$in: queryArr}}, '_id projectUUID location curated featured title client url files content description type popularity social tags createdAt updatedAt');
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});

router.get('/cleardb', function (req, res) {
	var query 	= Piece.remove({});
		query.exec(function (error, pieces) {
			if (error) return console.log(error);
			console.log(pieces);
			res.json(pieces);
		});
});