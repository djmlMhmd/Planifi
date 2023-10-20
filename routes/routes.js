const express = require('express');
const { Router } = require('express');
const router = Router();
const userValidation = require('../validation/validation');
const { getClientsCollection } = require('../db/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(express.json());

router.post('/inscription', async (req, res) => {
	// recover data
	const { body } = req;

	try {
		//hash password
		const hash = await bcrypt.hash(body.password, saltRounds);

		// validate the data
		const { error } = userValidation(body);
		if (error) {
			return res.status(400).json(error.details[0].message);
		}
		const client = getClientsCollection();

		//Insert the user in the database with the hashed password
		const result = await client.query(
			'INSERT INTO users("firstName", "lastName", password, email, phone) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[body.firstName, body.lastName, hash, body.email, body.phone]
		);
		console.log('Utilisateur inséré avec succès:', result.rows[0]);
		res.json(result.rows[0]);
	} catch (e) {
		console.error("Erreur lors de l'insertion de l'utilisateur:", e.stack);
		res.status(500).json("Erreur serveur lors de l'inscription.");
	}
});

router.post('/connexion', async (req, res) => {
	const { email, password } = req.body;

	const client = getClientsCollection();
	try {
		const connexionResult = await client.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		if (connexionResult.rows.length === 1) {
			const hashedPassword = connexionResult.rows[0].password;

			//Compare the password supplied with the hashed password
			const match = await bcrypt.compare(password, hashedPassword);

			if (match) {
				res.json({ message: 'Authentification réussie' });
			} else {
				res.status(401).json({
					message: "Échec de l'authentification",
				});
			}
		} else {
			res.status(401).json({ message: "Échec de l'authentification" });
		}
	} catch (e) {
		console.error("Erreur lors de l'authentification : ", e.stack);
		res.status(500).json({
			message: "Erreur serveur lors de l'authentification.",
		});
	}
});
module.exports = router;
