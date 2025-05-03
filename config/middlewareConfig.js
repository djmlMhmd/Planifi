const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const secretKey = process.env.SECRET_KEY;

function setupMiddleware(app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(
		session({
			secret: secretKey,
			resave: false,
			saveUninitialized: true,
		})
	);

	// Static files configuration
	app.use(express.static('public'));
	app.use('/profile-images', express.static('img'));

	// EJS as view engine
	app.set('view engine', 'ejs');
}

module.exports = {
	setup: setupMiddleware,
};
