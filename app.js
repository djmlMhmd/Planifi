require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const {
	connectToDatabase,
	createTableUser,
	createTableProAccount,
	createTableService,
	createTableReservation,
	createTableAvailability,
	createTableNotation,
	createTableImagesServicesProfessionals,
} = require('./db/database');
const path = require('path');
const app = express();
const reactDistPath = path.join(__dirname, 'client', 'dist');

const port = 3000;
const disconnect = require('./routes/disconnect');
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');
const secretKey = process.env.SECRET_KEY;
const indexRoutes = require('./routes/index');
const serviceRouter = require('./routes/services');
const professionalRoutes = require('./routes/professionalsRoute');
const {logLogger} = require("./config/winston/winston.config");
const {alterInTables} = require("./db/alterDatabase");
connectToDatabase()
	.then(() => {
		createTableUser();
		createTableProAccount();
		createTableService();
		createTableAvailability();
		createTableReservation();
		createTableNotation();
		alterInTables();
		createTableImagesServicesProfessionals();
	})
	.catch(() => {
		logLogger(
			'Initialisation de la base ignorée car la connexion PostgreSQL a échoué',
			'App'
		);
	});

app.use('/service', serviceRouter);
app.use(
	session({
		secret: secretKey,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.json());
app.use(cookieParser());
app.get('/api/health', (_req, res) => {
	res.json({
		status: 'ok',
		service: 'planifi-api',
		timestamp: new Date().toISOString(),
	});
});

if (fs.existsSync(reactDistPath)) {
	app.use('/app', express.static(reactDistPath));
}

app.use('/', indexRoutes);
app.use(disconnect);
app.use(routes);
app.use(profilRoutes);
app.use(availability);
app.use(reservation);
app.use(professionalRoutes);
app.use(express.urlencoded({ extended: true }));

if (fs.existsSync(reactDistPath)) {
	app.get('/app', (_req, res) => {
		res.sendFile(path.join(reactDistPath, 'index.html'));
	});

	app.get('/app/*', (_req, res) => {
		res.sendFile(path.join(reactDistPath, 'index.html'));
	});
}
// permet de lancer serveur web
app.listen(port, () => {
	logLogger(`App listening port ${port}`, 'App');
});
