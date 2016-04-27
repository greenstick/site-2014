/*
Generate Utility
*/
var Generate = function () {
	return this;
};

Generate.prototype = {

	/*
	Generate an RFC4122 version 4 compliant UUID
	*/

	uuid 	: 	function () {
		var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	},

	/*
	Generate a Random Password String
	@params:
		length: 		number 	- the length of the password
		characters: 	string 	- the characters to use when gnerating the password
	*/
	
	password 	: function (length, characters) {
		var l = length 		|| 16,
			c = characters 	|| "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			p = '';
		for (var i = 0; i < l; i++) { var s = (Math.random() * (c.length - 1)).toFixed(0); p += c[s]; }
		return p;
	}
	
};

// Export
module.exports = Generate;