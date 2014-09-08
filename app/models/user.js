var mongoose 	= require('mongoose'),
	Schema  	= mongoose.Schema;

// User Schema
var User = new Schema({
	userUUID 	: String,
	name 		: String,
	level 		: Number,
	bin 		: String,
	social 		: 	{
		twitter		: 	String,
		facebook 	: 	String
	},
	createdAt 	: Date,
	updatedAt 	: Date
});

module.exports  = mongoose.model('user', User);