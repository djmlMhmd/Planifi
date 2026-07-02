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
	createTableDocuments,
	createTableImagesServicesProfessionals,
	seedDemoDocuments,
} = require('./db/database');
const path = require('path');
const app = express();
const reactDistPath = path.join(__dirname, 'client', 'dist');

const port = Number(process.env.PORT) || 3000;
const disconnect = require('./routes/disconnect');
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');
const secretKey = process.env.SECRET_KEY;
const indexRoutes = require('./routes/index');
const serviceRouter = require('./routes/services');
const professionalRoutes = require('./routes/professionalsRoute');
const documentsRoutes = require('./routes/documents');
const {logLogger} = require("./config/winston/winston.config");
const {alterInTables} = require("./db/alterDatabase");
connectToDatabase()
	.then(async () => {
		// Je garde l'initialisation dans un ordre lisible pour éviter les seeds avant les tables utiles.
		await createTableUser();
		await createTableProAccount();
		await createTableService();
		await createTableAvailability();
		await createTableReservation();
		await createTableNotation();
		await createTableDocuments();
		await alterInTables();
		await createTableImagesServicesProfessionals();
		await seedDemoDocuments();
	})
	.catch(() => {
		logLogger(
			'Initialisation de la base ignorée car la connexion PostgreSQL a échoué',
			'App'
		);
	});

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
app.use(serviceRouter);
app.use(availability);
app.use(reservation);
app.use(professionalRoutes);
app.use(documentsRoutes);
app.use(express.urlencoded({ extended: true }));

if (fs.existsSync(reactDistPath)) {
	app.get('/app', (_req, res) => {
		res.sendFile(path.join(reactDistPath, 'index.html'));
	});

	app.get('/app/*', (_req, res) => {
		res.sendFile(path.join(reactDistPath, 'index.html'));
	});
}
// Je garde une erreur lisible si le port est déjà pris au lieu de laisser Node crasher sans contexte métier.
const server = app.listen(port, () => {
	logLogger(`App listening port ${port}`, 'App');
});

server.on('error', (error) => {
	if (error?.code === 'EADDRINUSE') {
		console.error(
			`Le port ${port} est déjà utilisé. ` +
			`Arrête le process en cours ou relance avec un autre port, par exemple: PORT=3001 npm run dev`
		);
		process.exit(1);
	}

	throw error;
});
