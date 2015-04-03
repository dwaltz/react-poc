'use strict';

//Core Modules
var fs              = require('fs');
var http            = require('http');
var https           = require('https');

//Basic Dependencies
var express         = require('express');
//var mongoose        = require('mongoose');

//required express 4 middleware
var session         = require('express-session');
var cookieParser    = require('cookie-parser');
var compression     = require('compression');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

//mongo session storage
var RedisStore = require('connect-redis')(session);

var exphbs          = require( 'express3-handlebars' );
var helpers         = require('./lib/hbs-helpers');

//Loading configuration options
var config         = require( 'config' );

// getting main controller for routes
var mainController  = require('./controllers/main');

// creating express application
var app             = express();

// setting mime types for webfonts and other things
express.static.mime.define( { 'application/x-font-woff': [ 'woff' ] } );
express.static.mime.define( { 'application/x-font-ttf': [ 'ttf' ] } );
express.static.mime.define( { 'application/vnd.ms-fontobject': [ 'eot' ] } );
express.static.mime.define( { 'font/opentype': [ 'otf' ] } );
express.static.mime.define( { 'image/svg+xml': [ 'svg' ] } );

app.disable( 'X-Powered-By' ); //SITE SECURITY: this way people cant see that we are using express.js and exploit its vulnerabilities
app.use( compression() ); // gzipping
app.set( 'port', process.env.PORT || config.port ); //setting port


// Configuring view engine
app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: helpers
	//partialsDir: __dirname +'/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname +'/views');

// serving static content
app.use( express.static( __dirname + '/public' ) );
app.use( '/bower_components', express.static( __dirname + '/bower_components' ) );

// Emulating RESTful app
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use( methodOverride() );
app.use( cookieParser('mysecret!') );

//using mongostore for session storage
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'mySecret!',
	store: new RedisStore({
		db : config.redis.port
	}),
	cookie: {
		httpOnly: !!config.ssl, //SITE SECURITY:cookies can only be sent over https
		secure: !!config.ssl //SITE SECURITY:securing cookies if in an ssl environment
	}
}));

// routing for application
mainController( app );

// connecting to our db
//mongoose.connect(config.mongodb.url);

// closing the connection with the db on application termination
process.on('SIGINT', function() {
	console.log('App instance terminated');
	/*mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});*/
});

if ( config.ssl ) {
	https.createServer({
		key: fs.readFileSync(config.ssl.key, 'utf8'),
		cert: fs.readFileSync(config.ssl.cert, 'utf8')
	}, app ).listen( app.get( 'port' ) );

} else {
	// otherwise starting the server up without SSL
	http.createServer( app ).listen( app.get( 'port' ) );
}
console.log( 'Application listening to port:', app.get( 'port' ));