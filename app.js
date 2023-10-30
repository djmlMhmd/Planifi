//const { MongoClient } = require('mongodb');
const express = require('express');
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
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const services = require('./routes/services');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(routes);
app.use(profilRoutes);
app.use(services);
app.use(availability);
app.use(reservation);
app.use('/api', require('./routes/reservation'));

// Définissez la route pour la page "À propos"
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'home.html'));
});
app.get('/services', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/availability/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'availability.html'));
});

app.get('/inscription/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/connexion/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/client/:id', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'profil-client.html'));
});

app.get('/profil/:id', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'profil-client.html'));
});

// dbConnexion();
app.use(express.json());

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
