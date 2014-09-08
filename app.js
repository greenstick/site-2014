// Require Dependencies
var app             = require('express')(),
    mongoose        = require('mongoose'),
    fs              = require('fs'),
    config          = require('./config/config'),
    knox            = require('knox'),
    instagram       = require('instagram-node').instagram(),
    // io              = require('socket.io')(app),
    Authenticator   = require('./app/utility/authenticate.js');
   
// Configure
require('./config/express')(app, config);
require('./config/routes')(app);

// Initialize Authentication
Authenticator.basic();

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
    if (file.indexOf('.js') >= 0) require(modelsPath + '/' + file);
});