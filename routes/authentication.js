const express = require('express');
const { Router } = require('express');
const router = Router();
const { userValidation } = require('../validation/validation');
const { getClientsCollection } = require('../db/database');
const bcrypt = require('bcrypt');
const {createToken, verifyJWT, REGISTRATION_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN} = require("../utils/auth.utils");
const saltRounds = 10;
const {logLogger, errorLogger, warnLogger} = require('../config/winston/winston.config')
const {sendInternalServerError, sendError, sendBadRequest, sendSuccess, sendSuccessWithNoContent, sendUnauthrorized,
	sendFailure
} = require("../utils/error_message.utils");
const {constants} = require("../constants/constants");
const {sendRegistrationLink, sendResetPassword} = require("../mail/send-email");
const {isUndefinedOrEmpty} = require("../utils/methods.utils");

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
	const reqValue = req.query['user_type'];

	if (isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
		errorLogger(`Le champ "email" et le champ "password" doivent être renseignés`, 'authentification.js [POST] /connexion')
		return sendBadRequest(res, "Les données envoyées sont incorrectes")
	}

	if(reqValue !== constants.STATUT_CLIENT && reqValue !== constants.STATUT_PROFESSIONNEL) {
		errorLogger(`Le paramètre de requête est incorrect ou manquant (?user_type=): ${reqValue}`, 'authentification.js [POST] /inscription')
		return sendBadRequest(res, `Le paramètre de requête est incorrect (?user_type=): ${reqValue}`)
	}

	const client = getClientsCollection();
	try {
		if(reqValue === constants.STATUT_CLIENT) {
			const clientQueryResult = await client.query(
				'SELECT * FROM users WHERE email = $1',
				[email]
			);
			if (clientQueryResult.rows.length === 1) {
				const {users_id, est_verifie} = clientQueryResult.rows[0]

				if (!est_verifie) {
					warnLogger(`L'utilisateur ${users_id} (client) essaye de se connecter en étant pas vérifié`, 'authentification.js [POST] /connexion')
					return sendUnauthrorized(res, 'Veuillez vérifier votre adresse email avant de vous connecter')
				}
				const hashedPassword = clientQueryResult.rows[0].password;

				//Compare the password supplied with the hashed password
				const match = await bcrypt.compare(password, hashedPassword);

				if (match) {
					const token = createToken(users_id, constants.STATUT_CLIENT)
					res.cookie('jwt', token, {httpOnly: true, maxAge: JWT_COOKIE_EXPIRES_IN})
					logLogger('Authentification réussie', 'authentification.js [POST] /connexion')
					return sendSuccessWithNoContent(res)
				}
				errorLogger("Échec de l'authentification: mot de passe incorrect", 'authentification.js [POST] /connexion')
				return sendError(res, "Échec de l'authentification")

			} else {
				const professionalQueryResult = await client.query(
					'SELECT * FROM professionals WHERE email = $1',
					[email]
				);

				if (professionalQueryResult.rows.length === 1) {
					const {professional_id, est_verifie} = professionalQueryResult.rows[0];

					if (!est_verifie) {
						warnLogger(`L'utilisateur ${users_id} (professionnel) essaye de se connecter en étant pas vérifié`, 'authentification.js [POST] /connexion')
						return sendUnauthrorized(res, 'Veuillez vérifier votre adresse email avant de vous connecter')
					}

					const hashedPassword = professionalQueryResult.rows[0].password;

					const match = await bcrypt.compare(password, hashedPassword);

					if (match) {
						const token = createToken(professional_id, constants.STATUT_PROFESSIONNEL)
						res.cookie('jwt', token, {httpOnly: true, maxAge: JWT_COOKIE_EXPIRES_IN})
						logLogger('Authentification réussie en tant que professionnel', 'authentification.js /connexion')
						return sendSuccessWithNoContent(res)
					} else {
						errorLogger("Échec de l'authentification en tant que professionnel : mot de passe incorrect", 'authentification.js /connexion')
						sendError(res, "Échec de l'authentification")
					}
				} else {
					errorLogger("Échec de l'authentification : e-mail non trouvé", 'authentification.js /connexion')
					sendError(res, "Échec de l'authentification")
				}
			}
		}
	} catch (e) {
		errorLogger("Erreur lors de l'authentification : " + e.stack, 'authentification.js /connexion')
		sendInternalServerError(res, "Erreur serveur lors de l'authentification. " + e.message)
	}
});

router.get('/confirm-registration', async (req, res) => {
	const token = req.query['token'];
	if(isUndefinedOrEmpty(token)){
		return sendBadRequest(res, 'Le token de confirmation est absent')
	}
	const userInfo = verifyJWT(token)
	if(userInfo === null) {
		return sendError(res, `Le token n'est pas valide: ${token}`)
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


router.post('/resend-registration-mail', async (req, res) => {
	const user_type = req.query['user_type'];
	const { email } = req.body;

	if (isUndefinedOrEmpty(email)) {
		errorLogger(`Le champ "email" doit être renseigné`, 'authentification.js [POST] /resend-registration-mail')
		return sendBadRequest(res, "Les données envoyées sont incorrectes")
	}

	if(user_type !== constants.STATUT_CLIENT && user_type !== constants.STATUT_PROFESSIONNEL) {
		errorLogger(`Le paramètre de requête est incorrect ou manquant (?user_type=): ${user_type}`, 'authentification.js [POST] /resend-registration-mail')
		return sendBadRequest(res, `Le paramètre de requête est incorrect (?user_type=): ${user_type}`)
	}

	const client = getClientsCollection();
	try {
		let userQuery
		if(user_type === constants.STATUT_CLIENT) {
			userQuery = 'SELECT * from users where email = $1'
		}
		else {
			userQuery = 'SELECT * from professionals where email = $1'
		}
		const userQueryresult = await client.query(userQuery, [ email]);

		// Vérifie si des lignes ont été insérées
		if (userQueryresult.rowCount > 0) {
			const {email, firstName, est_verifie} = userQueryresult.rows[0]

			if(est_verifie) {
				warnLogger(`L'utilisateur ${email} essaye de renvoyer un mail de confirmation d'inscription en étant vérifié`, 'authentification.js [POST] /resend-registration-mail')
				return sendUnauthrorized(res, 'Veuillez votre compte est déjà vérifié, veuillez vous connecter')
			}

			let id
			if(user_type === constants.STATUT_PROFESSIONNEL) {
				id = userQueryresult.rows[0].professional_id
			}
			else {
				id = userQueryresult.rows[0].users_id
			}
			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(id, user_type, constants.CONFIRM_REGISTRATION, REGISTRATION_EXPIRES_IN)

			sendSuccess(res, `Un lien de confirmation d'inscription a bien été renvoyé votre adresse mail: ${email}`)
			await sendRegistrationLink(email, firstName, `${process.env.API_URL}/confirm-registration?token=${token}`)
		} else {
			errorLogger("Échec de l'authentification : e-mail non trouvé", 'authentification.js /resend-registration-mail')
			sendError(res, "Échec de l'authentification : e-mail non trouvé")
		}
	}
	catch (e) {
		return sendInternalServerError(res, `Erreur lors du renvoie de mail à l'utilisateur ${id}`)
	}
});

router.post('/forgot-password', async (req, res) => {
	const { email } = req.body;

	if (isUndefinedOrEmpty(email)) {
		errorLogger(`Le champ "email" doit être renseigné`, 'authentification.js [POST] /forgot-password')
		return sendBadRequest(res, "Les données envoyées sont incorrectes")
	}

	/**
	 * si l'utilisateur perd son mot de passe
	 * on va agir comme si on savait pas si c'est un pro ou un client
	 * afin de lui renvoyer un mail peu importe son statut
	 */
	const client = getClientsCollection();
	try {
		const userQuery = 'SELECT users_id, email, "firstName" from users where email = $1'
		const proQuery = 'SELECT professional_id, email, "firstName" from professionals where email = $1'

		const userQueryresult = await client.query(userQuery, [ email]);
		const proQueryresult = await client.query(proQuery, [ email]);

		// Cas du client
		if(userQueryresult.rowCount > 0) {
			const {users_id, email, firstName} = userQueryresult.rows[0]

			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(users_id, constants.STATUT_CLIENT, constants.FORGOT_PASSWORD, REGISTRATION_EXPIRES_IN)

			sendSuccess(res, `Un lien de réinitialisation de votre mot de passe a bien été envoyé votre adresse mail: ${email}`)
			await sendResetPassword(email, firstName, `${process.env.API_URL}/forgot-password-reset?token=${token}&user_type=${constants.STATUT_CLIENT}`)
		}
		else if(proQueryresult.rowCount > 0){
			const {professional_id, email, firstName} = proQueryresult.rows[0]

			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(professional_id, constants.STATUT_PROFESSIONNEL, constants.FORGOT_PASSWORD, REGISTRATION_EXPIRES_IN)

			sendSuccess(res, `Un lien de réinitialisation de votre mot de passe a bien été envoyé votre adresse mail: ${email}`)
			await sendResetPassword(email, firstName, `${process.env.API_URL}/forgot-password-reset'?token=${token}&user_type=${constants.STATUT_PROFESSIONNEL}`)
		}
		else {
			errorLogger("Échec de l'authentification : e-mail non trouvé", 'authentification.js /forgot-password')
			return sendError(res, "Échec de l'authentification : e-mail non trouvé")
		}
	}
	catch (e) {
		return sendInternalServerError(res, `Erreur lors de l'envoie du mail pour obtenir la réinitialisation du mot de passe ${email}`)
	}
});

router.put('/forgot-password-reset', async (req, res) => {
	const token = req.query['token'];
	const { password, passwordConfirm } = req.body;

	if (isUndefinedOrEmpty(password) || isUndefinedOrEmpty(passwordConfirm)) {
		errorLogger(`Les champs "password" et "passwordConfirm" doivent être renseignés`, 'authentification.js [PUT] /forgot-password-reset')
		return sendBadRequest(res, "Les données envoyées sont incorrectes")
	}

	if(isUndefinedOrEmpty(token)) {
		errorLogger(`Le paramètre de requête est incorrect ou manquant (?token=): ${token}`, 'authentification.js [PUT] /forgot-password-reset')
		return sendBadRequest(res, `Le paramètre de requête est incorrect (?token=): ${token}`)
	}

	const infosUser = verifyJWT(token)
	if(infosUser === null){
		warnLogger(`Ce token n'est pas valide: ${token}`, 'authentification.js [PUT] /forgot-password-reset')
		return sendBadRequest(res, `Le token n'est plus  valide: ${token}`)
	}
	const { id, statut, type } = infosUser

	if(type === constants.FORGOT_PASSWORD) {
		const client = getClientsCollection();
		try {
			if(password !== passwordConfirm) {
				errorLogger(`Les mots de passe ne correspondent pas`, 'authentification.js [PUT] /forgot-password-reset')
				return sendBadRequest(res, "Les mots de passe ne correspondent pas")
			}
			const hash = await bcrypt.hash(password, saltRounds);
			let updatePasswordResult

			if(statut === constants.STATUT_PROFESSIONNEL) {
				updatePasswordResult = await client.query(
					'UPDATE professionals SET password = $1 WHERE professional_id = $2',
					[ hash, id]
				);
			}
			else {
				updatePasswordResult = await client.query(
					'UPDATE users SET password = $1 WHERE users_id = $2',
					[ hash, id]
				);
			}
			if(updatePasswordResult.rowCount === 0){
				errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut})`, "authentification.js [PUT] /forgot-password-reset")
				return sendFailure(res, 'Echec de la mise à jour du mot de passe')
			}
			return sendSuccessWithNoContent(res)
		}
		catch (e) {
			errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut}): ${e}`, "authentification.js [PUT] /forgot-password-reset")
			return sendInternalServerError(res, `Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut})`)
		}
	}
	return sendError(res, `Token incorrect`)
});

module.exports = router;
