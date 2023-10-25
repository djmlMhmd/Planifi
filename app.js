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

// Définissez la route pour la page "À propos"
app.get('/services', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'services.html'));
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
