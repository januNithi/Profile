var express = require('express');

// var mysql = require('mysql');

var path = require('path');

var session = require('express-session');

var logger = require('morgan');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var passport = require('passport');


module.exports = function() {
	
	var app = express();

	app.set('views', path.join(__dirname, '../public/views'));
	app.set('view engine', 'html');

	var store = new session.MemoryStore();

	// uncomment after placing your favicon in /public
	// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(session({ secret: 'something', store: store }));

	app.use(function (req, res, next) {
	  res.header('Access-Control-Allow-Origin', 'http://localhost');

	  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/auth/facebook');

	  next();
	});

	app.disable('etag');

	require('../routes/profileRoute.js')(app);


	return app;
};