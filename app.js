require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { verifyRecaptcha } = require('./middleware/recaptchaMiddleware');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const initializeSocket = require('./socket/socketController');

const {
	connectToDatabase,
	createTableUser,
	createTableProAccount,
	createTableService,
	getClientsCollection,
	createTableReservation,
	createTableAvailability,
	createTableNotation,
	createTableMessages,
	createTableImagesServicesProfessionals,
} = require('./db/database');
const path = require('path');
const app = express();
const server = http.createServer(app); // Créer le serveur ici
const io = socketIo(server); // Initialiser Socket.IO avec le serveur
const port = 3000;
const disconnect = require('./routes/disconnect');
const routes = require('./routes/authentication');
const profilRoutes = require('./routes/profil');
const services = require('./routes/services');
const availability = require('./routes/availability');
const reservation = require('./routes/reservation');
const secretKey = process.env.SECRET_KEY;
const EventEmitter = require('events');
const indexRoutes = require('./routes/index');
const serviceRouter = require('./routes/services');
const messagesRoutes = require('./messagerie/message');
const professionalRoutes = require('./routes/professionalsRoute');
const noteRoutes = require('./routes/notation');
const { logLogger } = require('./config/winston/winston.config');
const { alterInTables } = require('./db/alterDatabase');

getClientsCollection();
connectToDatabase().then(() => {
	createTableUser();
	createTableProAccount();
	createTableService();
	createTableAvailability();
	createTableReservation();
	createTableNotation();
	createTableMessages();
	alterInTables();
	createTableImagesServicesProfessionals();
});
// Increase the listener limit for an EventEmitter object
const bus = new EventEmitter();
bus.setMaxListeners(30);

initializeSocket(io);

bus.on('monEvenement', () => {});

app.use('/service', serviceRouter);
app.use(
	session({
		secret: secretKey,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(express.static('public'));
app.use('/profile-images', express.static('img'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cookieParser());
app.use('/', indexRoutes);
app.use(disconnect);
app.use(routes);
app.use(profilRoutes);
app.use(services);
app.use(availability);
app.use(reservation);
app.use(professionalRoutes);
app.use('/api', require('./routes/reservation'));
app.use(express.urlencoded({ extended: true }));
app.use('/', messagesRoutes);
app.use('/', noteRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
