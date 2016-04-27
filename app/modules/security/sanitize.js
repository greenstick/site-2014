var Sanitize = function () {
	return this.__init();
};

Sanitize.prototype = {
	__init: function () {
		var self = this;
		self.validator = require('validator');
	},
	str 	: function (string) {
		var self = this;
		return self.validator.escape(self.validator.toString(self.validator.trim(string)));
	},
	url 	: function (url) {
		var self = this;
		return self.validator.isURL(url) ? self.validator.escape(self.validator.toString(self.validator.trim(url))) : "";
	},
	tags 	: function (tags) {
		var self = this,
			temp = self.validator.escape(self.validator.toString(self.validator.trim(tags))).split("#"), arr = [];
		for (var i = 0; i < temp.length; i++) {
			var str = (temp[i].toString()).trim().toLowerCase();
			if (str.length) arr.push(str);
		};
		return arr;
	}
};
 
module.exports = Sanitize;