require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {
	connectToDatabase,
	createTableUser,
	createTableProfessional,
	createTableService,
	getClientsCollection,
	createTableReservation,
	createTableAvailability,
	createTableMessages,
	createTableDefaultAvailability, createTablePreferencePro, createTableImagesServicesProfessionals,
} = require('./db/database');
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
const secretKey = process.env.SECRET_KEY;
const EventEmitter = require('events');
const indexRoutes = require('./routes/index');
const serviceRouter = require('./routes/services');

// message en temps réel
const http = require('http');
const socketIo = require('socket.io');
const {alterInTables} = require("./db/alterDatabase");
const {logLogger} = require("./config/winston/winston.config");
const {sendResetPassword, sendRestart} = require("./mail/send-email");
const {deleteInTables} = require("./db/deleteDatabase");
const server = http.createServer(app);
const io = socketIo(server);

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
	console.log("Un utilisateur s'est connecté");

	// Réception d'un message d'un client et transmission au professionnel
	socket.on('send_message', (message) => {
		// utilise socket.to pour envoyer le message à un socket/pro spécifique
		// Sauvegarde le message dans votre base de données ici
		console.log(message);
	});
});

getClientsCollection();
connectToDatabase().then( ()=> {
	createTableUser();
	createTableProfessional();
	createTableService();
	createTableAvailability();
	createTableReservation();
	createTableDefaultAvailability();
	createTableMessages();
	//deleteInTables()
	alterInTables();
	createTablePreferencePro();
	createTableImagesServicesProfessionals()
})
// Increase the listener limit for an EventEmitter object
const bus = new EventEmitter();
bus.setMaxListeners(30);

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
app.use('/api', require('./routes/reservation'));
app.use(deleteReservation);
app.use(express.urlencoded({ extended: true }));

//sendRestart()
//sendResetPassword('marius.vitta@gmail.com', "Marius", "http://localhost:3000/confirm-registration")

// permet de lancer serveur web
app.listen(port, () => {
	logLogger(`App listening port ${port}`, 'App');
});

app.use(
	'/public/js',
	express.static(__dirname + '/public/js', {
		'Content-Type': 'text/javascript',
	})
);
