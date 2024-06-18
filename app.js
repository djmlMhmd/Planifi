require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const EventEmitter = require('events');

const socketConfig = require('./config/socketConfig');
const databaseConfig = require('./config/databaseConfig');
const middlewareConfig = require('./config/middlewareConfig');
const routeConfig = require('./config/routeConfig');
const { logLogger } = require('./config/winston/winston.config');

const app = express();
const server = http.createServer(app); // Créer le serveur ici
const port = 3000;

// Initialize database tables
databaseConfig.init();

// Initialize Socket.IO
socketConfig.init(server);

// Setup middleware
middlewareConfig.setup(app);

// Setup all routes
routeConfig.setup(app);

// Increase the listener limit for an EventEmitter object
const bus = new EventEmitter();
bus.setMaxListeners(30);
bus.on('monEvenement', () => {});

// Static file
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// permet de lancer serveur web
server.listen(port, () => {
	logLogger(`App listening port ${port}`, 'App');
});

app.use(
	'/public/js',
	express.static(__dirname + '/public/js', {
		'Content-Type': 'text/javascript',
	})
);
