const jwt = require("jsonwebtoken");
const {errorLogger, logLogger} = require("../config/winston/winston.config");
const limiter = require("express-rate-limit");
const {sendTooManyRequest} = require("./error_message.utils");

/**
 * Durée d'expiration du token JWT
 *
 *
 * @type {number}
 */
const EXPIRES_IN = 5 * 24 * 60 * 60; // 5 JOURS

/**
 * Durée d'expiration du token JWT pour l'inscription
 *
 * @type {number}
 */
const REGISTRATION_EXPIRES_IN = 10 * 60; // 10 min

/**
 * correspond à la durée de vie du cookie ici on est sur 3 jours
 * 5 => nombres de jours
 * 24 => 24h
 * 60 => 60 minutes
 * 60 => 60 secondes
 * 1000 => 1s (millisecondses)
 *
 * la durée de vie d'un cookie se transmet en millisecondes
 */
const JWT_COOKIE_EXPIRES_IN = 5 * 24 * 60 * 60 * 1000;


/**
 * Crée un token avec l'id et le statut de l'utilisateur
 *
 * @param id id de l'utilisateur
 * @param statut peut prendre les valeurs "client" ou "professionnel"
 * @param type type de token (confirmation d'inscription, renouvellement de mdp etc etc)
 * @param duration durée d'expiration du token
 * @returns {string} le JWT crée
 */
const createToken = (id, statut = '', type = '', duration = EXPIRES_IN) =>{
    return jwt.sign({ id, statut, type }, process.env.JWT_SECRET, {
        expiresIn: duration
    })
}

/**
 * retourne les données contenues dans le token
 * @param token JWT
 * @returns {JwtPayload | string}
 */
const decodeJWT = (token) => {
    if(token !== undefined && token.length > 0){
        return jwt.decode(token)
    }
}

/**
 * Verifie que le token JWT est correcte et non expiré
 *
 * @param token token JWT a verifier
 */
const verifyJWT = (token) => {
    if(!token) {
        errorLogger('Token non présent', 'verifyJWT')
        return null
    }
    let userInfos = null
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            errorLogger(`Ce token n'est pas valide: ${token}`, 'verifyJWT')
            return
        }
        userInfos = decodedToken
    })
    return userInfos
}

/**
 * limite le nombre de tentatives de connexion pour une IP pour une durée donnée
 *
 * ici on limite à l'utilisateur par tranche de 1H 5 inscription max
 *
 * @type {RateLimitRequestHandler}
 */
const registrationLimiter = limiter({
    windowMs: 60 * 60 * 1000, // 1H
    max: 10,
    handler: (req, res) =>{
        logLogger(JSON.stringify(req.rateLimit), 'registrationLimiter')
        const dateReset = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = dateReset.toLocaleTimeString()
        return sendTooManyRequest(res, `Trop de comptes ont été crée à cette adresse IP, veuillez reesayer après ${req.rateLimit.resetTime}`)
    },
    requestWasSuccessful: (request, response) => response.statusCode < 400,
    skipSuccessfulRequests: true
})

const authLimiter = limiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    handler: (req, res) =>{
        logLogger(JSON.stringify(req.rateLimit), 'authLimiter')
        const dateReset = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = dateReset.toLocaleTimeString()
        return sendTooManyRequest(res, `Trop de tentatives de connexion ont été faites à cette adresse IP, veuillez reesayer après ${req.rateLimit.resetTime}`)
    },
    requestWasSuccessful: (request, response) => response.statusCode < 400,
    skipSuccessfulRequests: true
});

const sendMailResetPasswordLimiter = limiter({
    windowMs: 60 * 60 * 1000, // 1H
    max: 5,
    handler: (req, res) =>{
        logLogger(JSON.stringify(req.rateLimit), 'sendMailResetPasswordLimiter')
        const dateReset = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = dateReset.toLocaleTimeString()
        return sendTooManyRequest(res, `Trop de tentatives de demande de réinitialisation de mot de passe ont été faites à cette adresse IP, veuillez reesayer après ${req.rateLimit.resetTime}`)
    },
    requestWasSuccessful: (request, response) => response.statusCode < 400,
    skipSuccessfulRequests: false
})

const sendMailConfirmRegistrationLimiter = limiter({
    windowMs: 60 * 60 * 1000, // 1H
    max: 5,
    handler: (req, res) =>{
        logLogger(JSON.stringify(req.rateLimit), 'sendMailConfirmRegistrationLimiter')
        const dateReset = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = dateReset.toLocaleTimeString()
        return sendTooManyRequest(res, `Trop de tentatives de demande d'envoi de mails de confirmation ont été faites à cette adresse IP, veuillez reesayer après ${req.rateLimit.resetTime}`)
    },
    requestWasSuccessful: (request, response) => response.statusCode < 400,
    skipSuccessfulRequests: false
})

module.exports = {
    createToken,
    decodeJWT,
    verifyJWT,
    EXPIRES_IN,
    REGISTRATION_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN,
    registrationLimiter,
    authLimiter,
    sendMailResetPasswordLimiter,
    sendMailConfirmRegistrationLimiter
}
