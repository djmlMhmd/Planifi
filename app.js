require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./routes/profil');
const {
	connectToDatabase,
	createTableUser,
	createTableProfessional,
	createTableService,
	getClientsCollection,
	createTableReservation,
	createTableAvailability,
	createTableMessages,
	createTablePreferencePro,
	createTableImagesServicesProfessionals,
	/*createTableDefaultAvailability,*/
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
const { logLogger } = require('./config/winston/winston.config');
const { alterInTables } = require('./db/alterDatabase');

getClientsCollection();
connectToDatabase().then(() => {
	createTableUser();
	createTableProfessional();
	createTableService();
	createTableAvailability();
	createTableReservation();
	//createTableDefaultAvailability();
	createTableMessages();
	//deleteInTables()
	alterInTables();
	createTablePreferencePro();
	createTableImagesServicesProfessionals();
});
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
app.use(professionalRoutes);
app.use('/api', require('./routes/reservation'));
app.use(express.urlencoded({ extended: true }));
app.use('/', messagesRoutes);

// permet de lancer serveur web
server.listen(port, () => {
	logLogger(`App listening port ${port}`, 'App');
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
	console.log("Un utilisateur s'est connecté");

	socket.on('send_message', async (data) => {
		console.log(
			`Tentative d'envoi d'un message avec les données: ${JSON.stringify(
				data
			)}`
		);
		const { sender_id, receiver_id, subject, message_body, service_id } =
			data;
		const client = getClientsCollection();
		try {
			console.log('Exécution de la requête SQL pour insérer un message');
			const result = await client.query(
				`INSERT INTO messages (sender_id, receiver_id, subject, message_body, service_id, sent_at)
                 VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;`,
				[sender_id, receiver_id, subject, message_body, service_id]
			);
			const message = result.rows[0];
			console.log(
				`Message inséré avec succès: ${JSON.stringify(message)}`
			);
			socket.to(receiver_id.toString()).emit('new_message', message);
			socket.emit('message_sent', {
				status: 'success',
				message: message,
			});
		} catch (error) {
			console.error(
				"Erreur lors de l'envoi du message via Socket.IO:",
				error
			);
			socket.emit('message_error', {
				status: 'error',
				message: "Erreur lors de l'envoi du message",
			});
		}
	});

	socket.on('join_room', (room) => {
		socket.join(room);
	});
});

app.use(
	'/public/js',
	express.static(__dirname + '/public/js', {
		'Content-Type': 'text/javascript',
	})
);
