var zlib 		= require('zlib'),
	AWS 		= require('aws-sdk'),
	Stream 		= require('s3-upload-stream').Uploader;

var Streamer = function (config) {
	this.__init__(config);
};

Streamer.prototype = {
	__init__ 	: function () {
		return this;
	}
};

module.exports = Streamer;