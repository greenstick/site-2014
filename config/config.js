var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'site-2014'
    },
    port: 3000,
    db: 'mongodb://localhost/site-2014-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'site-2014'
    },
    port: 3000,
    db: 'mongodb://localhost/site-2014-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'site-2014'
    },
    port: 5000,
    db: 'mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_DATABASE
  }
};

module.exports = config[env];
