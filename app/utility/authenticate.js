var passport 		= require('passport'),
	BasicStrategy   = require('passport-http').BasicStrategy,
	env         	= process.env.NODE_ENV || 'development',
	credentials 	= require('../development/testers.js');
	

// Authentication Module
var Authenticator = {
	basic 		: function () {
		passport.use(new BasicStrategy (
			function (username, password, done) {
		        if (env === 'development') {
		            for (var i = 0; i < credentials.users.length; i++) {
		                var user = credentials.users[i].username, pass = credentials.users[i].password;
		                if (username.valueOf() === user && password.valueOf() === pass) return done(null, true);
		            }
		        }
		        if (env === 'production') {
		            if (username.valueOf() === process.env.OWNER_USERNAME && password.valueOf() === process.env.PASSWORD) return done(null, true);
		        }
		        return done(null, false);
		 	})
		);
	}
}

module.exports = Authenticator;