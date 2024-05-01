const {sendSuccessWithNoContent, sendBadRequest, sendSuccess, sendInternalServerError, sendUnauthorized, sendError,
    sendFailure
} = require("../utils/error_message.utils");
const {userValidation} = require("../validation/validation");
const {errorLogger, logLogger, warnLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const bcrypt = require("bcrypt");
const {getClientsCollection} = require("../db/database");
const {createToken, REGISTRATION_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN, verifyJWT} = require("../utils/auth.utils");
const {sendRegistrationLink, sendResetPassword} = require("../mail/send-email");
const {isUndefinedOrEmpty} = require("../utils/methods.utils");
const saltRounds = 10;

module.exports.auth_get = (req, res) => {
    return sendSuccessWithNoContent(res)
}

module.exports.register_client_post = async (req, res) => {
    const { body } = req;
    const { error } = userValidation(body);

    // Validatin initale des mots de passe
    if (body.password !== body.confirmPassword) {
        errorLogger(`Les mots de passe ne correspondent pas`, '', 'authentification.js', '/inscription/utilisateur', constants.POST_HTTP)
        return sendBadRequest(res, 'Les mots de passe ne correspondent pas')
    }

    if (error) {
        errorLogger(`Erreur lors de la validation des données de l'utilisateur ${JSON.stringify(body.email)}:`, '', 'authentification.js', '/inscription/utilisateur', constants.POST_HTTP)
        return sendBadRequest(res, error.details[0].message)
    }


    try {
        const hash = await bcrypt.hash(body.password, saltRounds);
        const client = getClientsCollection();
        const values = [
            body.firstName,
            body.lastName,
            hash,
            body.email,
            body.phone,
            body.country,
            body.city,
            body.address,
        ];

        const insertQuery = `INSERT INTO users("firstName", "lastName", password, email, phone, country, city, address)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING RETURNING *`;

        const result = await client.query(insertQuery, values);

        // Vérifie si des lignes ont été insérées
        if (result.rowCount > 0) {
            logLogger(`Utilisateur inscrit avec succès:` + JSON.stringify(result.rows[0]) , '', 'authentification.js', '/inscription/utilisateur', constants.POST_HTTP)
            const {email, firstName} = result.rows[0]
            let id = result.rows[0].users_id

            /**
             * on crée un token qui ne durera que 10 minutes
             * @type {string}
             */
            const token = createToken(id, constants.STATUT_CLIENT, constants.CONFIRM_REGISTRATION, REGISTRATION_EXPIRES_IN)

            sendSuccess(res, `Votre inscription a bien été prise en compte, un lien de confirmation d'inscription vous a été envoyé à votre adresse mail: ${email}`)
            await sendRegistrationLink(email, firstName, `${process.env.API_URL}/confirm-registration?token=${token}`)
        } else {
            errorLogger('Le compte existe déjà ou une autre erreur est survenue.', '', 'authentification.js', '/inscription/utilisateur', constants.POST_HTTP)
            return sendBadRequest(res, 'Le compte existe déjà ou une autre erreur est survenue.')
        }
    } catch (e) {
        errorLogger(`Erreur lors de l'inscription : ${e.stack}`, '', 'authentification.js', '/inscription/utilisateur', constants.POST_HTTP)
        return sendInternalServerError(res, "Erreur serveur lors de l'inscription. " + e.message)
    }
}

module.exports.register_pro_post = async (req, res) => {
    const { body } = req;
    const { error } = userValidation(body);

    if (body.password !== body.confirmPassword) {
        errorLogger(`Les mots de passe ne correspondent pas`, '', 'authentification.js', '/inscription/professionnel', constants.POST_HTTP)
        return sendBadRequest(res, 'Les mots de passe ne correspondent pas')
    }

    if (error) {
        errorLogger(`Erreur lors de la validation des données de l'utilisateur ${JSON.stringify(body.email)}:`, '', 'authentification.js', '/inscription/professionnel', constants.POST_HTTP)
        return sendBadRequest(res, error.details[0].message)
    }

    try {
        const hash = await bcrypt.hash(body.password, saltRounds);
        const client = getClientsCollection();

        const values = [
            body.firstName,
            body.lastName,
            hash,
            body.email,
            body.phone,
            body.company_name,
            body.company_address,
            body.country,
            body.city,
            body.address,
        ];

        const insertQuery = `INSERT INTO professionals("firstName", "lastName", password, email, phone, company_name, company_address, country, city, address)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING RETURNING *`;

        const result = await client.query(insertQuery, values);

        if (result.rowCount > 0) {
            logLogger(`Professionnel inscrit avec succès:` + JSON.stringify(result.rows[0]) , '', 'authentification.js', '/inscription/professionnel', constants.POST_HTTP)
            sendSuccess(res, `Votre inscription a bien été prise en compte, un lien de confirmation d'inscription vous a été envoyé à votre adresse mail: ${result.rows[0].email}`)
        } else {
            errorLogger('Le compte existe déjà ou une autre erreur est survenue.', '', 'authentification.js', '/inscription/professionnel', constants.POST_HTTP)
            return sendBadRequest(res, 'Le compte existe déjà ou une autre erreur est survenue.')
        }
    } catch (e) {
        errorLogger(`Erreur lors de l'inscription du professionnel: ${e.stack}`, '', 'authentification.js', '/inscription/professionnel', constants.POST_HTTP)
        return sendInternalServerError(res, "Erreur serveur lors de l'inscription du professionnel." + e.message)
    }
}

module.exports.connexion_post = async (req, res) => {
    const { email, password } = req.body;
    const reqValue = req.query['user_type'];

    if (isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
        errorLogger(`Le champ "email" et le champ "password" doivent être renseignés`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
        return sendBadRequest(res, "Les données envoyées sont incorrectes")
    }

    if(reqValue !== constants.STATUT_CLIENT && reqValue !== constants.STATUT_PROFESSIONNEL) {
        errorLogger(`Le paramètre de requête est incorrect ou manquant (?user_type=): ${reqValue}`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
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
                    warnLogger(`L'utilisateur ${users_id} (${constants.STATUT_CLIENT}) essaye de se connecter en étant pas vérifié`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
                    return sendUnauthorized(res, 'Veuillez vérifier votre adresse email avant de vous connecter')
                }
                const hashedPassword = clientQueryResult.rows[0].password;

                //Compare the password supplied with the hashed password
                const match = await bcrypt.compare(password, hashedPassword);

                if (match) {
                    const token = createToken(users_id, constants.STATUT_CLIENT)
                    res.cookie('jwt', token, {httpOnly: true, maxAge: JWT_COOKIE_EXPIRES_IN})
                    logLogger(`Authentification réussie en tant que client (${email})`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
                    return sendSuccessWithNoContent(res)
                }
            }
            else {
                errorLogger("Échec de l'authentification: mot de passe incorrect", '', 'authentification.js', '/connexion', constants.POST_HTTP)
                return sendError(res, "Échec de l'authentification")
            }
        }
        else {

            const professionalQueryResult = await client.query(
                'SELECT * FROM professionals WHERE email = $1',
                [email]
            );

            if (professionalQueryResult.rows.length === 1) {
                const {professional_id, est_verifie} = professionalQueryResult.rows[0];

                if (!est_verifie) {
                    warnLogger(`L'utilisateur ${professional_id} (${constants.STATUT_PROFESSIONNEL}) essaye de se connecter en étant pas vérifié`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
                    return sendUnauthorized(res, 'Veuillez vérifier votre adresse email avant de vous connecter')
                }

                const hashedPassword = professionalQueryResult.rows[0].password;

                const match = await bcrypt.compare(password, hashedPassword);

                if (match) {
                    const token = createToken(professional_id, constants.STATUT_PROFESSIONNEL)
                    res.cookie('jwt', token, {httpOnly: true, maxAge: JWT_COOKIE_EXPIRES_IN})
                    logLogger(`Authentification réussie en tant que professionnel (${email})`, '', 'authentification.js', '/connexion', constants.POST_HTTP)
                    return sendSuccessWithNoContent(res)
                } else {
                    errorLogger("Échec de l'authentification en tant que professionnel : mot de passe incorrect", '', 'authentification.js', '/connexion', constants.POST_HTTP)
                    return sendError(res, "Échec de l'authentification")
                }
            } else {
                errorLogger("Échec de l'authentification : e-mail non trouvé", '', 'authentification.js', '/connexion', constants.POST_HTTP)
                return sendError(res, "Échec de l'authentification")
            }
        }
    } catch (e) {
        errorLogger("Erreur lors de l'authentification : " + e.stack, '', 'authentification.js', '/connexion', constants.POST_HTTP)
        return sendInternalServerError(res, "Erreur serveur lors de l'authentification. " + e.message)
    }
    return sendInternalServerError(res, 'Erreur serveur')
}

module.exports.confirm_registration_get = async (req, res) => {
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
            logLogger(`L'inscription de l'utilisateur: ${id} a bien été confirmée`, '','Authentification.js', '/confirm-registration', constants.GET_HTTP)
            return sendSuccess(res, 'Votre inscription a bien été confirmée')
        }
        catch (e) {
            return sendInternalServerError(res, `Erreur lors de la mise à jour du statut 'est_verifie' de l'utilisateur ${id}`)
        }
    }
    return sendInternalServerError(res, 'Problème au niveau du serveur')
}

module.exports.resend_mail_register_post =  async (req, res) => {
    const user_type = req.query['user_type'];
    const { email } = req.body;

    if (isUndefinedOrEmpty(email)) {
        errorLogger(`Le champ "email" doit être renseigné`, '','authentification.js', '/resend-registration-mail', constants.POST_HTTP)
        return sendBadRequest(res, "Les données envoyées sont incorrectes")
    }

    if(user_type !== constants.STATUT_CLIENT && user_type !== constants.STATUT_PROFESSIONNEL) {
        errorLogger(`Le paramètre de requête est incorrect ou manquant (?user_type=): ${user_type}`, '','authentification.js', '/resend-registration-mail', constants.POST_HTTP)
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
                warnLogger(`L'utilisateur ${email} essaye de renvoyer un mail de confirmation d'inscription en étant vérifié`, '','authentification.js', '/resend-registration-mail', constants.POST_HTTP)
                return sendUnauthorized(res, 'Veuillez votre compte est déjà vérifié, veuillez vous connecter')
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
            errorLogger("Échec de l'authentification : e-mail non trouvé", '','authentification.js', '/resend-registration-mail', constants.POST_HTTP)
            return sendError(res, "Échec de l'authentification : e-mail non trouvé")
        }
    }
    catch (e) {
        return sendInternalServerError(res, `Erreur lors du renvoie de mail à l'utilisateur ${id}`)
    }
}

module.exports.forgot_password_post = async (req, res) => {
    const { email } = req.body;

    if (isUndefinedOrEmpty(email)) {
        errorLogger(`Le champ "email" doit être renseigné`, '','authentification.js', '/forgot-password', constants.POST_HTTP)
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
            errorLogger("Échec de l'authentification : e-mail non trouvé", '','authentification.js', '/forgot-password', constants.POST_HTTP)
            return sendError(res, "Échec de l'authentification : e-mail non trouvé")
        }
    }
    catch (e) {
        return sendInternalServerError(res, `Erreur lors de l'envoie du mail pour obtenir la réinitialisation du mot de passe ${email}`)
    }
}

module.exports.forget_password_reset_post = async (req, res) => {
    const token = req.query['token'];
    const { password, passwordConfirm } = req.body;

    if (isUndefinedOrEmpty(password) || isUndefinedOrEmpty(passwordConfirm)) {
        errorLogger(`Les champs "password" et "passwordConfirm" doivent être renseignés`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
        return sendBadRequest(res, "Les données envoyées sont incorrectes")
    }

    if(isUndefinedOrEmpty(token)) {
        errorLogger(`Le paramètre de requête est incorrect ou manquant (?token=): ${token}`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
        return sendBadRequest(res, `Le paramètre de requête est incorrect (?token=): ${token}`)
    }

    const infosUser = verifyJWT(token)
    if(infosUser === null){
        warnLogger(`Ce token n'est pas valide: ${token}`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
        return sendBadRequest(res, `Le token n'est plus  valide: ${token}`)
    }
    const { id, statut, type } = infosUser

    if(type === constants.FORGOT_PASSWORD) {
        const client = getClientsCollection();
        try {
            if(password !== passwordConfirm) {
                errorLogger(`Les mots de passe ne correspondent pas`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
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
                errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut})`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
                return sendFailure(res, 'Echec de la mise à jour du mot de passe')
            }
            return sendSuccessWithNoContent(res)
        }
        catch (e) {
            errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut}): ${e}`, '','authentification.js', '/forgot-password-reset', constants.PUT_HTTP)
            return sendInternalServerError(res, `Echec lors de la mise à jour du mot de passe de l'utilisateur ${id} (${statut})`)
        }
    }
    return sendError(res, `Token incorrect`)
}