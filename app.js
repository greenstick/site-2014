/*
Load Express, Authentication, Database, & Routes
*/


// Initialize App
var app                         = require('express')(),
    fs                          = require('fs'),
    auth                        = require('./app/modules/security/authenticate.js'),
    mongoose                    = require('mongoose'),

// Configure Server / Routing
    config                      = require('./config/config'),
    server                      = require('./config/server')(app, config),

// Set Environment 
    env                         = process.env.NODE_ENV || 'development';
    app.locals.ENV              = env;
    app.locals.ENV_DEVELOPMENT  = env == 'development';

// Initialize Authentication
auth.basic();

// Connect to DB
mongoose.connect(config.db);
var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

// Require DB Models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) require(modelsPath + '/' + file);
});

// Initialize
app.listen(config.port);