
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//Portfolio Piece Schema
var Piece = new Schema({
	title: String,
	url: String,
	text: String,
	updatedAt: Date
});

mongoose.model('Piece', Piece);
