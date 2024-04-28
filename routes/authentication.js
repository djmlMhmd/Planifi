const express = require('express');
const { Router } = require('express');
const router = Router();
const { userValidation } = require('../validation/validation');
const { getClientsCollection } = require('../db/database');
const bcrypt = require('bcrypt');
const {createToken, EXPIRES_IN, verifyJWT, REGISTRATION_EXPIRES_IN} = require("../utils/auth.utils");
const saltRounds = 10;
const {logLogger, errorLogger} = require('../config/winston/winston.config')
const {sendInternalServerError, sendError, sendBadRequest, sendSuccess} = require("../utils/error_message.utils");
const {constants} = require("../constants/constants");
const {sendRegistrationLink} = require("../mail/send-email");

router.use(express.json());

// REGISTRATION
router.post('/inscription', async (req, res) => {
	const { body } = req;
	const reqValue = req.query['user_type'];
	const { error } = userValidation(body);

	if (error) {
		errorLogger(`Erreur lors de la validation des données de l'utilisateur ${JSON.stringify(body)}:`, 'authentification.js [POST] /inscription')
		return sendBadRequest(res, error.details[0].message)
	}
	if(reqValue !== constants.STATUT_CLIENT && reqValue !== constants.STATUT_PROFESSIONNEL) {
		errorLogger(`Le paramètre de requête est incorrect ou manquant (?user_type=): ${reqValue}`, 'authentification.js [POST] /inscription')
		return sendBadRequest(res, `Le paramètre de requête est incorrect: ${reqValue}`)
	}

	try {
		const hash = await bcrypt.hash(body.password, saltRounds);
		const client = getClientsCollection();
		let insertQuery
		const values = [
			body.firstName,
			body.lastName,
			hash,
			body.email,
			body.phone,
		];

		if(reqValue === constants.STATUT_PROFESSIONNEL) {
			// Pour les professionnels, on ajoute aussi company_name et company_address
			values.push(body.company_name);
			values.push(body.company_address);
			insertQuery = `INSERT INTO professionals ("firstName", "lastName", password, email, phone, company_name, company_address)
       						VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *`
		}
		else {
			insertQuery = `INSERT INTO users ("firstName", "lastName", password, email, phone)
       						VALUES($1, $2, $3, $4, $5) RETURNING *`;
		}

		const result = await client.query(insertQuery, values);

		// Vérifie si des lignes ont été insérées
		if (result.rowCount > 0) {
			logLogger(`${reqValue} inscrit avec succès:` + JSON.stringify(result.rows[0]) , 'authentification.js [POST] /inscription')
			const {email, firstName} = result.rows[0]
			let id
			if(reqValue === constants.STATUT_PROFESSIONNEL) {
				id = result.rows[0].professional_id
			}
			else {
				id = result.rows[0].users_id
			}
			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(id, reqValue, constants.CONFIRM_REGISTRATION, REGISTRATION_EXPIRES_IN)

			sendSuccess(res, `Votre inscription a bien été prise en compte, un lien de confirmation d'inscription vous a été envoyé à votre adresse mail: ${email}`)
			await sendRegistrationLink(email, firstName, `${process.env.API_URL}/confirm-registration?token=${token}`)
		} else {
			errorLogger('Le compte existe déjà ou une autre erreur est survenue.', 'authentification.js [POST] /inscription')
			sendBadRequest(res, 'Le compte existe déjà ou une autre erreur est survenue.')
		}
	} catch (e) {
		errorLogger(`Erreur lors de l'inscription : ${e.stack}`, 'authentification.js [POST] /inscription')
		sendInternalServerError(res, "Erreur serveur lors de l'inscription. " + e.message)
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
				/**
				 * correspond à la durée de vie du cookie ici on est sur 3 jours
				 * 3 => nombres de jours
				 * 24 => 24h
				 * 60 => 60 minutes
				 * 60 => 60 secondes
				 * 1000 => 1s (millisecondses)
				 *
				 * la durée de vie d'un cookie se transmet en millisecondes
				 */
				const maxAge = 3 * 24 * 60 * 60 * 1000;
				res.cookie('clientID', clientID, { maxAge });

				const token = createToken(clientID, constants.STATUT_CLIENT)
				res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES_IN * 1000})
				logLogger('Authentification réussie' , 'authentification.js /connexion')
				logLogger(`clientID dans la session : ${clientID}`, 'authentification.js /connexion')
				res.redirect(`/profil/client/${clientID}`);
			} else {
				errorLogger("Échec de l'authentification: mot de passe incorrect", 'authentification.js /connexion')
				sendError(res, "Échec de l'authentification")
			}
		} else if (professionalQuery.rows.length === 1) {
			const professional = professionalQuery.rows[0];
			const hashedPassword = professional.password;

			const match = await bcrypt.compare(password, hashedPassword);

			if (match) {
				const professionalID = professional.professional_id;
				req.cookies.professionalID = professionalID;
				const token = createToken(professionalID, constants.STATUT_PROFESSIONNEL)
				res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES_IN * 1000})
				logLogger('Authentification réussie en tant que professionnel', 'authentification.js /connexion')
				logLogger(`professionalID dans la session :', ${req.session.professionalID}`, 'authentification.js /connexion')
				res.redirect(`/profil/professionnel/${professionalID}`);
			} else {
				errorLogger("Échec de l'authentification en tant que professionnel : mot de passe incorrect", 'authentification.js /connexion')
				sendError(res, "Échec de l'authentification")
			}
		} else {
			errorLogger("Échec de l'authentification : e-mail non trouvé", 'authentification.js /connexion')
			sendError(res, "Échec de l'authentification")
		}
	} catch (e) {
		errorLogger("Erreur lors de l'authentification : " + e.stack, 'authentification.js /connexion')
		sendInternalServerError(res, "Erreur serveur lors de l'authentification. " + e.message)
	}
});

router.get('/confirm-registration', async (req, res) => {
	const token = req.query['token'];
	if(token === undefined || token === '' ){
		return sendBadRequest(res, 'Le token de confirmation est absent')
	}
	const userInfo = verifyJWT(token)
	if(userInfo === null) {
		return sendError(res, "Le token n'est pas valide")
	}

	const {id, statut, type } = userInfo
	if(type === constants.CONFIRM_REGISTRATION) {
		const client = getClientsCollection();
		try {

			if(statut === constants.STATUT_CLIENT) {
				await client.query(
					'UPDATE users SET est_verifie = $1 WHERE users_id = $2',
					[ true, id]
				);
			}
			else {
				await client.query(
					'UPDATE professionals SET est_verifie = $1 WHERE professional_id = $2',
					[ true, id]
				);
			}
			logLogger(`L'inscription de l'utilisateur: ${id} a bien été confirmée`, 'Authentification.js [GET] /confirm-registration')
			return sendSuccess(res, 'Votre inscription a bien été confirmée')
		}
		catch (e) {
			return sendInternalServerError(res, `Erreur lors de la mise à jour du statut 'est_verifie' de l'utilisateur ${id}`)
		}
	}
	return sendInternalServerError(res, 'Problème au niveau du serveur')
});

module.exports = router;
