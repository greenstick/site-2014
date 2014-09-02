// Require Dependencies
var app             = require('express')(),
    mongoose        = require('mongoose'),
    fs              = require('fs'),
    config          = require('./config/config'),
    passport        = require('passport'),
    BasicStrategy   = require('passport-http').BasicStrategy,
    knox            = require('knox'),
    instagram       = require('instagram-node').instagram(),
    // io              = require('socket.io')(app),
    credentials     = (process.env.NODE_ENV === 'production') ? undefined : require('./app/development/credentials.js');

// Configure
require('./config/express')(app, config);
require('./config/routes')(app);

// Set Port
app.listen(process.env.PORT || config.port);

// Connect to DB
mongoose.connect(config.db);
var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

// Access Models
var modelsPath = __dirname + '/app/models';
    fs.readdirSync(modelsPath).forEach(function (file) {
        if (file.indexOf('.js') >= 0) {
            require(modelsPath + '/' + file);
        }
    });

// Authentication Layer
passport.use(new BasicStrategy (
	function (username, password, done) {
		if (username.valueOf() === process.env.OWNER_USERNAME || credentials.admin.user && password.valueOf() === process.env.OWNER_PASSWORD || credentials.admin.password) return done(null, true);
		return done(null, false);
	})
);