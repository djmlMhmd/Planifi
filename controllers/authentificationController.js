const {
	sendSuccessWithNoContent,
	sendBadRequest,
	sendSuccess,
	sendInternalServerError,
	sendUnauthorized,
	sendError,
	sendFailure,
} = require('../utils/error_message.utils');
//const { userValidation, proValidation } = require('../validation/validation');
const {
	errorLogger,
	logLogger,
	warnLogger,
} = require('../config/winston/winston.config');
const { constants } = require('../constants/constants');
const bcrypt = require('bcrypt');
const { getClientsCollection } = require('../db/database');
const {
	createToken,
	REGISTRATION_EXPIRES_IN,
	JWT_COOKIE_EXPIRES_IN,
	verifyJWT,
	decodeJWT,
} = require('../utils/auth.utils');
const {
	sendRegistrationLink,
	sendResetPassword,
} = require('../mail/send-email');
const { isUndefinedOrEmpty } = require('../utils/methods.utils');
const saltRounds = 10;

module.exports.auth_get = (req, res) => {
	return sendSuccessWithNoContent(res);
};

module.exports.register_user_post = async (req, res) => {
	const { email, password, confirmPassword, est_pro } = req.body;

	if (password !== confirmPassword) {
		return sendBadRequest(res, 'Les mots de passe ne correspondent pas');
	}

	if (isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
		return sendBadRequest(
			res,
			'L’email et le mot de passe sont obligatoires'
		);
	}

	const client = getClientsCollection();

	try {
		const userExists = await client.query(
			'SELECT email FROM users WHERE email = $1',
			[email]
		);
		if (userExists.rows.length > 0) {
			return sendFailure(
				res,
				'Un compte existe déjà avec cette adresse email'
			);
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const insertUserQuery = `
	INSERT INTO users(email, password, est_pro)
	VALUES($1, $2, $3)
	RETURNING users_id, email, est_pro
`;
		const result = await client.query(insertUserQuery, [
			email,
			hashedPassword,
			est_pro ?? false, // par défaut à false si undefined
		]);

		const { users_id } = result.rows[0];
		const token = createToken(
			users_id,
			'',
			constants.CONFIRM_REGISTRATION,
			REGISTRATION_EXPIRES_IN
		);

		await sendRegistrationLink(
			email,
			email,
			`${process.env.API_URL}/confirm-registration?token=${token}`
		);

		return sendSuccess(
			res,
			`Votre inscription a bien été prise en compte, un lien de confirmation vous a été envoyé à ${email}`
		);
	} catch (e) {
		errorLogger(
			`Erreur lors de l'inscription : ${e.stack}`,
			'',
			'authentification.js',
			'/inscription/utilisateur',
			constants.POST_HTTP
		);
		return sendInternalServerError(
			res,
			"Erreur serveur lors de l'inscription"
		);
	}
};

/*module.exports.register_pro_post = async (req, res) => {
	const { body } = req;
	const { id } = decodeJWT(req.cookies.jwt);
	const { error } = proValidation(body);

	if (error) {
		errorLogger(
			`Erreur lors de la validation des données de l'utilisateur ${id}:`,
			'',
			'authentification.js',
			'/inscription/professionnel',
			constants.POST_HTTP
		);
		return sendBadRequest(res, error.details[0].message);
	}
	const client = getClientsCollection();

	try {
		const queryExistingAccount = `SELECT * from pro_account where user_id = $1`;
		const resultExistUser = await client.query(queryExistingAccount, [id]);
		if (resultExistUser.rows.length === 1) {
			errorLogger(
				'Vous possédez déjà un compte professionnel à cette adresse mail',
				'',
				'authentification.js',
				'/inscription/professionnel',
				constants.POST_HTTP
			);
			return sendFailure(
				res,
				`Vous possédez déjà un compte professionnel à cette adresse mail`
			);
		}
	} catch (e) {
		errorLogger(
			`Erreur lors de la vérification à l'inscription : ${e.stack}`,
			'',
			'authentification.js',
			'/inscription/professionnel',
			constants.POST_HTTP
		);
		return sendInternalServerError(
			res,
			"Erreur serveur lors de l'inscription. " + e.message
		);
	}

	try {
		const queryExistingAccount = `SELECT users_id from users where users_id = $1`;
		const resultExistUser = await client.query(queryExistingAccount, id);
		if (resultExistUser.rows.length === 1) {
			const values = [body.company_name, body.company_address, id];

			const insertProQuery =
				'INSERT INTO pro_account(company_name, company_address, user_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';

			const result = await client.query(insertProQuery, values);

			if (result.rowCount > 0) {
				logLogger(
					`Professionnel inscrit avec succès:` +
						JSON.stringify(result.rows[0]),
					'',
					'authentification.js',
					'/inscription/professionnel',
					constants.POST_HTTP
				);
				sendSuccess(
					res,
					'Votre inscription a bien été prise en compte.'
				);
			} else {
				errorLogger(
					'Le compte existe déjà ou une autre erreur est survenue.',
					'',
					'authentification.js',
					'/inscription/professionnel',
					constants.POST_HTTP
				);
				return sendInternalServerError(
					res,
					'Le compte existe déjà ou une autre erreur est survenue.'
				);
			}
		} else {
			errorLogger(
				`Aucun compte existe avec cet ID ${id}:`,
				'',
				'authentification.js',
				'/inscription/professionnel',
				constants.POST_HTTP
			);
			return sendFailure(res, `Aucun compte existe avec cet ID`);
		}
	} catch (e) {
		errorLogger(
			`Erreur lors de l'inscription du professionnel: ${e.stack}`,
			'',
			'authentification.js',
			'/inscription/professionnel',
			constants.POST_HTTP
		);
		return sendInternalServerError(
			res,
			"Erreur serveur lors de l'inscription du professionnel." + e.message
		);
	}
};*/

module.exports.complete_profile_post = async (req, res) => {
	const {
		firstName,
		lastName,
		phone,
		country,
		city,
		address,
		company_name,
		company_address,
	} = req.body;

	const { id } = decodeJWT(req.cookies.jwt);
	if (!id) {
		return sendUnauthorized(res, 'Utilisateur non authentifié');
	}

	const client = getClientsCollection();

	try {
		// Vérifie que l'utilisateur existe et récupère s'il est pro
		const userResult = await client.query(
			'SELECT est_pro FROM users WHERE users_id = $1',
			[id]
		);

		if (userResult.rowCount === 0) {
			return sendFailure(res, 'Utilisateur introuvable');
		}

		const isPro = userResult.rows[0].est_pro;

		// Mise à jour du profil commun
		await client.query(
			`UPDATE users 
			 SET "firstName" = $1, "lastName" = $2, phone = $3, country = $4, city = $5, address = $6 
			 WHERE users_id = $7`,
			[firstName, lastName, phone, country, city, address, id]
		);

		// Si pro, on vérifie les infos et on insère ou met à jour pro_account
		if (isPro && company_name && company_address) {
			const proResult = await client.query(
				'SELECT 1 FROM pro_account WHERE user_id = $1',
				[id]
			);

			if (proResult.rowCount === 0) {
				await client.query(
					'INSERT INTO pro_account(company_name, company_address, user_id) VALUES ($1, $2, $3)',
					[company_name, company_address, id]
				);
			} else {
				await client.query(
					'UPDATE pro_account SET company_name = $1, company_address = $2 WHERE user_id = $3',
					[company_name, company_address, id]
				);
			}
		}

		return sendSuccess(res, 'Profil mis à jour avec succès');
	} catch (e) {
		errorLogger(
			`Erreur lors de la complétion du profil : ${e.stack}`,
			'',
			'authentification.js',
			'/complete-profile',
			constants.POST_HTTP
		);
		return sendInternalServerError(
			res,
			'Erreur serveur lors de la mise à jour du profil'
		);
	}
};

module.exports.connexion_post = async (req, res) => {
	const { email, password } = req.body;

	if (isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
		errorLogger(
			`Le champ "email" et le champ "password" doivent être renseignés`,
			'',
			'authentification.js',
			'/connexion',
			constants.POST_HTTP
		);
		return sendBadRequest(res, 'Les données envoyées sont incorrectes');
	}

	try {
		const client = getClientsCollection();

		const clientQueryResult = await client.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);
		if (clientQueryResult.rows.length === 1) {
			const { users_id, est_verifie } = clientQueryResult.rows[0];

			if (!est_verifie) {
				warnLogger(
					`L'utilisateur ${users_id} essaye de se connecter en étant pas vérifié`,
					'',
					'authentification.js',
					'/connexion',
					constants.POST_HTTP
				);
				return sendUnauthorized(
					res,
					'Veuillez vérifier votre adresse email avant de vous connecter'
				);
			}
			const hashedPassword = clientQueryResult.rows[0].password;

			//Compare the password supplied with the hashed password
			const match = await bcrypt.compare(password, hashedPassword);

			if (match) {
				//const statut = est_pro ? constants.STATUT_PROFESSIONNEL : constants.STATUT_CLIENT
				const token = createToken(users_id);
				res.cookie('jwt', token, {
					httpOnly: true,
					maxAge: JWT_COOKIE_EXPIRES_IN,
				});
				logLogger(
					`Authentification réussie (${email})`,
					'',
					'authentification.js',
					'/connexion',
					constants.POST_HTTP
				);
				return sendSuccessWithNoContent(res);
			} else {
				errorLogger(
					"Échec de l'authentification: mot de passe incorrect",
					'',
					'authentification.js',
					'/connexion',
					constants.POST_HTTP
				);
				return sendError(res, "Échec de l'authentification");
			}
		} else {
			errorLogger(
				"Échec de l'authentification : e-mail non trouvé",
				'',
				'authentification.js',
				'/connexion',
				constants.POST_HTTP
			);
			return sendError(res, "Échec de l'authentification");
		}
	} catch (e) {
		errorLogger(
			"Erreur lors de l'authentification : " + e.stack,
			'',
			'authentification.js',
			'/connexion',
			constants.POST_HTTP
		);
		return sendInternalServerError(
			res,
			"Erreur serveur lors de l'authentification. " + e.message
		);
	}
};

module.exports.confirm_registration_get = async (req, res) => {
	const token = req.query['token'];
	if (isUndefinedOrEmpty(token)) {
		return sendBadRequest(res, 'Le token de confirmation est absent');
	}
	const userInfo = verifyJWT(token);
	if (userInfo === null) {
		return sendError(res, `Le token n'est pas valide: ${token}`);
	}

	const { id, type } = userInfo;
	if (type === constants.CONFIRM_REGISTRATION) {
		const client = getClientsCollection();
		try {
			await client.query(
				'UPDATE users SET est_verifie = $1 WHERE users_id = $2',
				[true, id]
			);
			logLogger(
				`L'inscription de l'utilisateur: ${id} a bien été confirmée`,
				'',
				'Authentification.js',
				'/confirm-registration',
				constants.GET_HTTP
			);
			return sendSuccess(res, 'Votre inscription a bien été confirmée');
		} catch (e) {
			return sendInternalServerError(
				res,
				`Erreur lors de la mise à jour du statut 'est_verifie' de l'utilisateur ${id}`
			);
		}
	}
	return sendInternalServerError(res, 'Problème au niveau du serveur');
};

module.exports.resend_mail_register_post = async (req, res) => {
	const { email } = req.body;

	if (isUndefinedOrEmpty(email)) {
		errorLogger(
			`Le champ "email" doit être renseigné`,
			'',
			'authentification.js',
			'/resend-registration-mail',
			constants.POST_HTTP
		);
		return sendBadRequest(res, 'Les données envoyées sont incorrectes');
	}

	const client = getClientsCollection();
	try {
		let userQuery = 'SELECT * from users where email = $1';

		const userQueryresult = await client.query(userQuery, [email]);

		// Vérifie si des lignes ont été insérées
		if (userQueryresult.rowCount > 0) {
			const { email, firstName, est_verifie } = userQueryresult.rows[0];

			if (est_verifie) {
				warnLogger(
					`L'utilisateur ${email} essaye de renvoyer un mail de confirmation d'inscription en étant vérifié`,
					'',
					'authentification.js',
					'/resend-registration-mail',
					constants.POST_HTTP
				);
				return sendUnauthorized(
					res,
					'Veuillez votre compte est déjà vérifié, veuillez vous connecter'
				);
			}

			let id = userQueryresult.rows[0].users_id;
			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(
				id,
				'',
				constants.CONFIRM_REGISTRATION,
				REGISTRATION_EXPIRES_IN
			);

			sendSuccess(
				res,
				`Un lien de confirmation d'inscription a bien été renvoyé votre adresse mail: ${email}`
			);
			await sendRegistrationLink(
				email,
				firstName,
				`${process.env.API_URL}/confirm-registration?token=${token}`
			);
		} else {
			errorLogger(
				"Échec de l'authentification : e-mail non trouvé",
				'',
				'authentification.js',
				'/resend-registration-mail',
				constants.POST_HTTP
			);
			return sendError(
				res,
				"Échec de l'authentification : e-mail non trouvé"
			);
		}
	} catch (e) {
		return sendInternalServerError(
			res,
			`Erreur lors du renvoie de mail à l'utilisateur ${id}`
		);
	}
};

module.exports.forgot_password_post = async (req, res) => {
	const { email } = req.body;

	if (isUndefinedOrEmpty(email)) {
		errorLogger(
			`Le champ "email" doit être renseigné`,
			'',
			'authentification.js',
			'/forgot-password',
			constants.POST_HTTP
		);
		return sendBadRequest(res, 'Les données envoyées sont incorrectes');
	}

	/**
	 * si l'utilisateur perd son mot de passe
	 * on va agir comme si on savait pas si c'est un pro ou un client
	 * afin de lui renvoyer un mail peu importe son statut
	 */
	const client = getClientsCollection();
	try {
		const userQuery =
			'SELECT users_id, email, "firstName" from users where email = $1';
		const userQueryresult = await client.query(userQuery, [email]);

		// Cas du client
		if (userQueryresult.rowCount > 0) {
			const { users_id, email, firstName } = userQueryresult.rows[0];

			/**
			 * on crée un token qui ne durera que 10 minutes
			 * @type {string}
			 */
			const token = createToken(
				users_id,
				'',
				constants.FORGOT_PASSWORD,
				REGISTRATION_EXPIRES_IN
			);

			sendSuccess(
				res,
				`Un lien de réinitialisation de votre mot de passe a bien été envoyé votre adresse mail: ${email}`
			);
			await sendResetPassword(
				email,
				firstName,
				`${process.env.API_URL}/forgot-password-reset?token=${token}`
			);
		} else {
			errorLogger(
				"Échec de l'authentification : e-mail non trouvé",
				'',
				'authentification.js',
				'/forgot-password',
				constants.POST_HTTP
			);
			return sendError(
				res,
				"Échec de l'authentification : e-mail non trouvé"
			);
		}
	} catch (e) {
		return sendInternalServerError(
			res,
			`Erreur lors de l'envoie du mail pour obtenir la réinitialisation du mot de passe ${email}`
		);
	}
};

module.exports.forget_password_reset_post = async (req, res) => {
	const token = req.query['token'];
	const { password, passwordConfirm } = req.body;

	if (isUndefinedOrEmpty(password) || isUndefinedOrEmpty(passwordConfirm)) {
		errorLogger(
			`Les champs "password" et "passwordConfirm" doivent être renseignés`,
			'',
			'authentification.js',
			'/forgot-password-reset',
			constants.PUT_HTTP
		);
		return sendBadRequest(res, 'Les données envoyées sont incorrectes');
	}

	if (isUndefinedOrEmpty(token)) {
		errorLogger(
			`Le paramètre de requête est incorrect ou manquant (?token=): ${token}`,
			'',
			'authentification.js',
			'/forgot-password-reset',
			constants.PUT_HTTP
		);
		return sendBadRequest(
			res,
			`Le paramètre de requête est incorrect (?token=): ${token}`
		);
	}

	const infosUser = verifyJWT(token);
	if (infosUser === null) {
		warnLogger(
			`Ce token n'est pas valide: ${token}`,
			'',
			'authentification.js',
			'/forgot-password-reset',
			constants.PUT_HTTP
		);
		return sendBadRequest(res, `Le token n'est plus  valide: ${token}`);
	}
	const { id, type } = infosUser;

	if (type === constants.FORGOT_PASSWORD) {
		const client = getClientsCollection();
		try {
			if (password !== passwordConfirm) {
				errorLogger(
					`Les mots de passe ne correspondent pas`,
					'',
					'authentification.js',
					'/forgot-password-reset',
					constants.PUT_HTTP
				);
				return sendBadRequest(
					res,
					'Les mots de passe ne correspondent pas'
				);
			}
			const hash = await bcrypt.hash(password, saltRounds);
			let updatePasswordResult = await client.query(
				'UPDATE users SET password = $1 WHERE users_id = $2',
				[hash, id]
			);

			if (updatePasswordResult.rowCount === 0) {
				errorLogger(
					`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} `,
					'',
					'authentification.js',
					'/forgot-password-reset',
					constants.PUT_HTTP
				);
				return sendFailure(
					res,
					'Echec de la mise à jour du mot de passe'
				);
			}
			return sendSuccessWithNoContent(res);
		} catch (e) {
			errorLogger(
				`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id}: ${e}`,
				'',
				'authentification.js',
				'/forgot-password-reset',
				constants.PUT_HTTP
			);
			return sendInternalServerError(
				res,
				`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id}`
			);
		}
	}
	return sendError(res, `Token incorrect`);
};
