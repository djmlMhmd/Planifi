const jwt = require("jsonwebtoken");
const {errorLogger} = require("../config/winston/winston.config");

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
const createToken = (id, statut, type = '', duration = EXPIRES_IN) =>{
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

module.exports = {
    createToken,
    decodeJWT,
    verifyJWT,
    EXPIRES_IN,
    REGISTRATION_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN
}
