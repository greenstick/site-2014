module.exports = function (app, config) {

// Init Environment and Require Some Dependencies & Middleware
var env                         = process.env.NODE_ENV || 'development';
    express                     = require('express'),
    glob                        = require('glob'),
    favicon                     = require('serve-favicon'),
    logger                      = require('morgan'),
    cookieParser                = require('cookie-parser'),
    bodyParser                  = require('body-parser'),
    compress                    = require('compression'),
    methodOverride              = require('method-override');

    // Set Environment 
    app.locals.ENV              = env;
    app.locals.ENV_DEVELOPMENT  = env == 'development';

    // Set View Engine and Views Directory
    app.set('views', config.root + '/app/views/jade');
    app.set('view engine', 'jade');

    // Use this Middleware & Stuff
    app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    // Initialize Controllers
    var controllers             = glob.sync(config.root + '/app/controllers/*.js');
        controllers.forEach(function (controller) {
            require(controller)(app);
        });

    // No Route to Handle Request - 404 Error Handling
    app.use(function (req, res, next) {
        var err                 = new Error('Not Found');
            err.status          = 404;
        next(err);
    });

    // Development Error Rendering
    if (app.locals.ENV_DEVELOPMENT) {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('../core/error', {
                message : err.message,
                error   : err,
                title   : 'Uh Oh!',
                css     : 'error.css', 
                libs    : [],
                js      : []
            });
        });
    // Staging & Live Error Rendering
    } else {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('../core/error', {
                message : err.message,
                error   : {},
                title   : 'Uh Oh!',
                css     : 'error.css',
                libs    : [],
                js      : []
            });
        });
    }

};
