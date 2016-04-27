var zlib 		= require('zlib'),
	AWS 		= require('aws-sdk'),
	Stream 		= require('s3-upload-stream').Uploader;

var Streamer = function (config) {
	this.__init__(config);
};

Streamer.prototype = {
	__init__ 		: function () {
		var strm 	= this;
		return this;
	},
	processFile 	: function (name, file) {
		var strm 	= this;
		return this;
	},
	progress 		: function (received, expected) {
		var strn 	= this;
		return this;
	},
};

module.exports = Streamer;