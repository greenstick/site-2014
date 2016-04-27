var path        = require('path'),
    rootPath    = path.normalize(__dirname + '/..'),
    env         = process.env.NODE_ENV || 'development';

var config = {
    development : {
        root    : rootPath,
        app     : {
            name    : 'site-2014'
        },
        port    : 3000,
        wssport : 4000,
        db      : 'mongodb://localhost/site-2014-development'
    },

    production  : {
        root    : rootPath,
        app     : {
            name    : 'portfolio'
        },
        port    : 5000,
        wssport : 4000,
        db      : 'mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_DATABASE
    }
};

module.exports = config[env]; 