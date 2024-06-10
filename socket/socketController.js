const { decodeJWT } = require('../utils/auth.utils');
const { getClientsCollection } = require('../db/database');

function initializeSocket(io) {
	io.use((socket, next) => {
		// Logique simplifiée pour test
		console.log('Token Received:', socket.handshake.query.token);
		return next();
	});

	io.on('connection', (socket) => {
		console.log("Un utilisateur s'est connecté");

		socket.on('send_message', async (data) => {
			console.log(
				`Tentative d'envoi d'un message avec les données: ${JSON.stringify(
					data
				)}`
			);
			const { sender_id, receiver_id, subject, message_body } = data.data;
			const client = getClientsCollection();

			try {
				const result = await client.query(
					`INSERT INTO messages (sender_id, receiver_id, subject, message_body, sent_at)
                     VALUES ($1, $2, $3, $4, NOW()) RETURNING *;`,
					[sender_id, receiver_id, subject, message_body]
				);
				const message = result.rows[0];
				message.sent_at = new Date().toISOString();
				console.log(
					`Message inséré avec succès: ${JSON.stringify(message)}`
				);

				socket.broadcast.emit('join_new_room', {
					sender_id,
					receiver_id,
				});
				socket
					.to(`${sender_id.toString()}-${receiver_id.toString()}`)
					.emit('new_message', message);
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
			socket.join(room.nom);
			console.log(
				`Utilisateur ${socket.id} a rejoint la salle ${room.nom}`
			);
		});
	});
}

module.exports = initializeSocket;
