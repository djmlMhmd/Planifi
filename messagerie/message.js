const express = require('express');
//const path = require('path');
const router = express.Router();
const { getClientsCollection } = require('../db/database');

// Endpoint pour envoyer un message
router.post('/api/send-message', async (req, res) => {
	const client = getClientsCollection();
	const { subject, message_body, service_id, sender_id, receiver_id } =
		req.body;

	try {
		const result = await client.query(
			`INSERT INTO messages (sender_id, receiver_id, subject, message_body, service_id, sent_at)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;`,
			[sender_id, receiver_id, subject, message_body, service_id]
		);
		res.status(201).json({
			message: 'Message envoyé avec succès',
			data: result.rows[0],
		});
	} catch (error) {
		console.error("Erreur lors de l'envoi du message:", error);
		res.status(500).json({ message: "Erreur lors de l'envoi du message" });
	}
});

// Endpoint pour récupérer les messages pour un professionnel
router.get('/api/messages/:professionalId', async (req, res) => {
	const client = getClientsCollection();
	const professionalId = req.params.professionalId;

	try {
		const result = await client.query(
			`SELECT m.message_id, m.sender_id, m.receiver_id, m.subject, m.message_body, m.service_id,
             TO_CHAR(m.sent_at, 'YYYY-MM-DD HH24:MI') AS sent_at, u."firstName", u."lastName"
             FROM messages m
             JOIN users u ON m.sender_id = u.users_id
             WHERE m.receiver_id = $1
             ORDER BY m.sent_at DESC;`,
			[professionalId]
		);
		if (result.rows.length > 0) {
			res.json(result.rows);
		} else {
			res.status(204).send();
		}
	} catch (error) {
		console.error('Erreur lors de la récupération des messages:', error);
		res.status(500).json({
			message: 'Erreur lors de la récupération des messages',
		});
	}
});

module.exports = router;
