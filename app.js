require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = require('./routes/profil');
const {
	connectToDatabase,
	createTableUser,
	createTableProfessional,
	createTableService,
	getClientsCollection,
	createTableReservation,
	createTableAvailability,
	createTableDefaultAvailability,
} = require('./db/database');

getClientsCollection();
connectToDatabase();
createTableUser();
createTableProfessional();
createTableService();
createTableAvailability();
createTableReservation();
createTableDefaultAvailability();

const { dbConnexion, getDatabase } = require('./db/database');
const path = require('path');
const app = express();
const port = 3000;
const disconnect = require('./routes/disconnect');
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const deleteReservation = require('./routes/delete');
const services = require('./routes/services');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const EventEmitter = require('events');

// Increase the listener limit for an EventEmitter object
const bus = new EventEmitter();
bus.setMaxListeners(30);

bus.on('monEvenement', () => {});

app.use(
	session({
		secret: secretKey,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.static('public'));

app.use('/profile-images', express.static('img'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cookieParser());
app.use(disconnect);
app.use(routes);
app.use(profilRoutes);
app.use(services);
app.use(availability);
app.use(reservation);
app.use('/api', require('./routes/reservation'));
app.use(deleteReservation);
app.use(express.urlencoded({ extended: true }));

// Définissez la route pour la page "À propos"
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'home.html'));
});
app.get('/services', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/disponibilite/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'availability.html'));
});

app.get('/inscription/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/connexion/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/profil/:id', (req, res) => {
	// Checks whether it is a customer or a connected professional
	if (req.session.clientID) {
		// If it's a customer, return the customer profile
		res.sendFile(path.join(__dirname, 'views', 'profil-client.html'));
	} else if (req.session.professionalID) {
		// If it's a professional, return the professional's profile
		res.sendFile(path.join(__dirname, 'views', 'profil-pro.html'));
	} else {
		// If no one is logged in, return an error message or redirect to the login page
		res.status(401).send('Authentification requise');
	}
});

app.get('/reservation', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'reservations.html'));
});

app.get('/navigation', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'navigation.html'));
});

// dbConnexion();

// permet de lancer serveur web
app.listen(port, () => {
	console.log(`App listening port ${port}`);
});

app.use(
	'/public/js',
	express.static(__dirname + '/public/js', {
		'Content-Type': 'text/javascript',
	})
);
