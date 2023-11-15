const session = require('express-session');
const express = require('express');
const { Router } = require('express');
const router = Router();
const { userValidation } = require('../validation/validation');
const { getClientsCollection } = require('../db/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(express.json());

// REGISTRATION
router.post('/inscription', async (req, res) => {
	const { body } = req;
	const reqValue = req.query['user_type'];
	const { error } = userValidation(body);

	if (error) {
		return res.status(400).json(error.details[0].message);
	}

	try {
		const hash = await bcrypt.hash(body.password, saltRounds);
		const client = getClientsCollection();
		const tableName =
			reqValue === 'professionnel' ? 'professionals' : 'users';

		const values = [
			body.firstName,
			body.lastName,
			hash,
			body.email,
			body.phone,
		];

		// Pour les professionnels, on ajoute aussi company_name et company_address
		if (reqValue === 'professionnel') {
			values.push(body.company_name);
			values.push(body.company_address);
		}

		const insertQuery =
			reqValue === 'professionnel'
				? `INSERT INTO ${tableName}("firstName", "lastName", password, email, phone, company_name, company_address)
       VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *`
				: `INSERT INTO ${tableName}("firstName", "lastName", password, email, phone)
       VALUES($1, $2, $3, $4, $5) RETURNING *`;

		const result = await client.query(insertQuery, values);

		// Vérifie si des lignes ont été insérées
		if (result.rowCount > 0) {
			console.log(`${reqValue} inscrit avec succès:`, result.rows[0]);
			res.json({
				success: true,
				redirectUrl: 'http://localhost:3000/connexion',
			});
		} else {
			res.status(400).json({
				success: false,
				message:
					'Le compte existe déjà ou une autre erreur est survenue.',
			});
		}
	} catch (e) {
		console.error("Erreur lors de l'inscription :", e.stack);
		res.status(500).json(
			"Erreur serveur lors de l'inscription. " + e.message
		);
	}
});

// CONNEXION

router.post('/connexion', async (req, res) => {
	const { email, password } = req.body;

	const client = getClientsCollection();
	try {
		const connexionResult = await client.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		const professionalQuery = await client.query(
			'SELECT * FROM professionals WHERE email = $1',
			[email]
		);

		if (connexionResult.rows.length === 1) {
			const hashedPassword = connexionResult.rows[0].password;

			//Compare the password supplied with the hashed password
			const match = await bcrypt.compare(password, hashedPassword);

			if (match) {
				const clientID = connexionResult.rows[0].users_id;
				res.cookie('clientID', clientID);
				req.session.clientID = clientID;
				console.log('Authentification réussie');
				console.log('clientID dans la session :', req.session.clientID);
				res.redirect(`/profil/client/${clientID}`);
			} else {
				console.log(
					"Échec de l'authentification: mot de passe incorrect"
				);
				res.status(401).json({
					message: "Échec de l'authentification",
				});
			}
		} else if (professionalQuery.rows.length === 1) {
			const professional = professionalQuery.rows[0];
			const hashedPassword = professional.password;

			const match = await bcrypt.compare(password, hashedPassword);

			if (match) {
				const professionalID = professional.professional_id;
				req.session.professionalID = professionalID;
				console.log(
					'Authentification réussie en tant que professionnel'
				);
				console.log(
					'professionalID dans la session :',
					req.session.professionalID
				);
				res.redirect(`/profil/professionnel/${professionalID}`);
			} else {
				console.log(
					"Échec de l'authentification en tant que professionnel : mot de passe incorrect"
				);
				res.status(401).json({
					message: "Échec de l'authentification",
				});
			}
		} else {
			console.log("Échec de l'authentification : e-mail non trouvé");
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
