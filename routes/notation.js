const express = require('express');
const { Router } = require('express');
const router = Router();
router.use(express.json());
const { getClientsCollection } = require('../db/database');
const db = getClientsCollection();

router.post('/notes', async (req, res) => {
	const { users_id, rating, comment } = req.body;
	try {
		// Vérifie si user est un pro
		const userCheck = await db.query(
			'SELECT est_pro FROM users WHERE users_id = $1',
			[users_id]
		);
		if (userCheck.rowCount == 0) {
			res.status(404).send("L'utilisateur spécifié n'existe pas.");
			return;
		}

		if (!userCheck.rows[0].est_pro) {
			res.status(403).send(
				'Seuls les professionnels peuvent recevoir des évaluations.'
			);
			return;
		}
		const result = await db.query(
			'INSERT INTO notation (users_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
			[users_id, rating, comment]
		);
		res.status(201).send(result.rows[0]);
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'évaluation:", error);
		res.status(500).send('Erreur serveur');
	}
});

router.get('/notes/:users_id', async (req, res) => {
	try {
		const userCheck = await db.query(
			'SELECT est_pro FROM users WHERE users_id = $1',
			[users_id]
		);
		if (userCheck.rowCount == 0 || !userCheck.rows[0].est_pro) {
			return res.status(404).send('Professionnel non trouvé ou ID');
		}

		const result = await db.query(
			'SELECT * FROM notation WHERE users_id = $1',
			[req.params.users_id]
		);
		if (result.rows.length > 0) {
			res.status(200).send(result.rows);
		} else {
			res.status(404).send('Aucune note trouvé pour ce professionnel');
		}
	} catch (error) {
		console.error('Erreur lors de la réception des notes:', error);
		res.status(500).send(
			'Erreur serveur lors de la récupération des notes'
		);
	}
});

module.exports = router;
