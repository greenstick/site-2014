
var mongoose 	= require('mongoose'),
	Schema  	= mongoose.Schema;

// Portfolio Piece Schema
var Piece = new Schema({
	pID 		: 	String,
	location	: 	{
		x			: 	Number,
		y 			: 	Number
	},
	curated 	: 	Boolean,
	featured 	: 	Boolean,
	title 		: 	String,
	client 		: 	String,
	url 		: 	String,
	files 		: 	Array,
	content 	: 	Object,
	description : 	String,
	popularity 	: 	Number,
	social 		: 	{
		twitter 	: 	String,
		facebook 	: 	String
	},
	tags 		: 	Array,
	createdAt 	: 	Date,
	updatedAt 	: 	Date
});

module.exports = mongoose.model('piece', Piece);
