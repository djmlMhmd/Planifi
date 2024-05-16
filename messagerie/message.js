const express = require('express');
//const path = require('path');
const router = express.Router();
const { getClientsCollection } = require('../db/database');

// Endpoint pour récupérer les messages pour un professionnel
router.get('/api/messages/:professionalId', async (req, res) => {
	const client = getClientsCollection();
	const professionalId = req.params.professionalId;

	try {
		const result = await client.query(
			`SELECT m.message_id, m.sender_id, m.receiver_id, m.subject, m.message_body,
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

// Endpoint pour récupérer les messages pour un utilisateur
router.get('/api/user-messages/:userId', async (req, res) => {
	const client = getClientsCollection();
	const userId = req.params.userId;

	try {
		const result = await client.query(
			`SELECT m.message_id, m.sender_id, m.receiver_id, m.subject, m.message_body,
             TO_CHAR(m.sent_at, 'YYYY-MM-DD HH24:MI') AS sent_at, p.company_name AS sender_name
             FROM messages m
             JOIN professionals p ON m.sender_id = p.professional_id
             WHERE m.receiver_id = $1
             ORDER BY m.sent_at DESC;`,
			[userId]
		);
		if (result.rows.length > 0) {
			res.json(
				result.rows.map((msg) => ({
					...msg,
					sender_name: msg.sender_name || 'Non spécifié', // Incase any NULL slips through
				}))
			);
		} else {
			res.status(204).send(); // Aucun message trouvé
		}
	} catch (error) {
		console.error('Erreur lors de la récupération des messages:', error);
		res.status(500).json({
			message: 'Erreur lors de la récupération des messages',
		});
	}
});

// Endpoint pour récupérer toutes les conversations d'un utilisateur
router.get('/api/conversations/:userId', async (req, res) => {
	const client = getClientsCollection();
	const userId = req.params.userId;

	try {
		const result = await client.query(
			`SELECT m.message_id, m.sender_id, m.receiver_id, m.subject, m.message_body,
             TO_CHAR(m.sent_at, 'YYYY-MM-DD HH24:MI') AS sent_at, 
			 CASE 
			 	WHEN m.sender_id = $1 THEN p.company_name
				ELSE u."firstName" || ' ' || u."lastName"
			 END AS sender_name
             FROM messages m
             LEFT JOIN professionals p ON m.receiver_id = p.professional_id
             LEFT JOIN users u ON m.sender_id = u.users_id
             WHERE m.receiver_id = $1 OR m.sender_id = $1
             ORDER BY m.sent_at DESC
             LIMIT 50;`,
			[userId]
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
