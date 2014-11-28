var validator = require('validator');

var Validate = {
	str: function (string) {
		return validator.escape(validator.toString(validator.trim(string)));
	},
	url: function (url) {
		return validator.isURL(url) ? validator.escape(validator.toString(validator.trim(url))) : "";
	},
	tags: function (tags) {
		var temp = validator.escape(validator.toString(validator.trim(tags))).split("#"), arr = [];
		for (var i = 0; i < temp.length; i++) {
			var str = (temp[i].toString()).trim().toLowerCase();
			if (str.length) arr.push(str);
		};
		return arr
	}
};
 
module.exports = Validate;