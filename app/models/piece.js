
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//Portfolio Piece Schema
var Piece = new Schema({
	id: 			Number,
	location: {
		x: 			Number,
		y: 			Number
	},
	curated: 		Boolean,
	featured: 		Boolean,
	title: 			String,
	url: 			String,
	content: 		Object,
	description: 	String,
	popularity: 	Number,
	social: {
		twitter: 		String,
		facebook: 		String
	},
	tags: 			String,
	createdAt: 		Date,
	updatedAt: 		Date
});

module.exports = mongoose.model('piece', Piece);
