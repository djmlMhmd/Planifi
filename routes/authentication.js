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
	try {
		//hash password
		const hash = await bcrypt.hash(body.password, saltRounds);

		if (error) {
			return res.status(400).json(error.details[0].message);
		}

		const client = getClientsCollection();

		const tableName =
			reqValue === 'professionnel' ? 'professionals' : 'users';

		if (reqValue == 'professionnel') {
			const result = await client.query(
				`INSERT INTO ${tableName}("firstName", "lastName", password, email, phone, company_name, company_address)
				VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *`,
				[
					body.firstName,
					body.lastName,
					hash,
					body.email,
					body.phone,
					body.company_name,
					body.company_address,
				]
			);

			if (result.rows == undefined) {
				res.json('Le compte existe déjà');
				return;
			}
			console.log(`${reqValue} inscrit avec succès:`, result.rows[0]);
			res.json(`${reqValue} inscrit avec succès`);

			const professionalId = result.rows[0].professional_id;
			const checkDefaultAvailabilityQuery = `
    SELECT * FROM default_availability WHERE professional_id = $1;
`;
			const checkDefaultAvailabilityResult = await client.query(
				checkDefaultAvailabilityQuery,
				[professionalId]
			);

			if (checkDefaultAvailabilityResult.rows.length === 0) {
				const insertDefaultAvailabilityQuery = `
        INSERT INTO default_availability (professional_id, day_of_week, start_time, end_time)
        SELECT $1, day_of_week, '08:00:00', '21:00:00'
        FROM unnest(ARRAY['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']) day_of_week;
    `;

				await client.query(insertDefaultAvailabilityQuery, [
					professionalId,
				]);
			}
		} else if (reqValue == 'client') {
			const result = await client.query(
				'INSERT INTO users("firstName", "lastName", password, email, phone) VALUES($1, $2, $3, $4, $5) RETURNING *',
				[body.firstName, body.lastName, hash, body.email, body.phone]
			);
			console.log('Client inséré avec succès:', result.rows[0]);
			res.json(result.rows[0]);
		}
	} catch (e) {
		console.error("Erreur lors de l'inscription :", e.stack);
		res.status(500).json(
			"Erreur serveur lors de l'inscription." + e.message
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
				const clientID = connexionResult.rows[0].id;
				res.redirect(`/profil/client/${clientID}`);
				console.log('Authentification réussie');
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
				console.log(
					'Authentification réussie en tant que professionnel'
				);
				res.json({
					message:
						'Authentification réussie en tant que professionnel',
				});
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
