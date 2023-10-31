const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
const session = require('express-session');
router.use(express.json());
const path = require('path');

// PROFESSIONAL PROFILE

router.get('/profil/professionnel/:id', async (req, res) => {
	const professionnelId = req.session.professionalID;

	if (!professionnelId) {
		return res.status(401).json({ message: 'Authentification requise' });
	}
	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM professionals WHERE professional_id = $1',
			values: [professionnelId],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ message: 'Profil professionnel non trouvé' });
		}

		//const professionnel = result.rows[0];
		const { password, creation_date, ...professionalProfile } =
			result.rows[0];
		res.json(professionalProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil professionnel:',
			e.stack
		);
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

// CLIENT PROFILE

router.get('/profil/client/:id', async (req, res) => {
	// Retrieves the client ID from the session or cookie
	const clientID = req.session.clientID;

	if (!clientID) {
		return res.status(401).json({ message: 'Authentification requise' });
	}

	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [clientID],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ message: 'Profil client non trouvé' });
		}

		const { password, creation_date, ...clientProfile } = result.rows[0];
		res.json(clientProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil client:',
			e.stack
		);
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

module.exports = router;
