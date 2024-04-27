const jwt = require("jsonwebtoken");

/**
 * Durée d'expiration du token JWT
 *
 * @type {number}
 */
const EXPIRES_IN = 3 * 24 * 60 * 60;

/**
 * Crée un token avec l'id et le statut de l'utilisateur
 *
 * @param id id de l'utilisateur
 * @param statut peut prendre les valeurs "client" ou "professionnel"
 * @returns {string} le JWT crée
 */
const createToken = (id, statut) =>{
    return jwt.sign({ id, statut }, process.env.JWT_SECRET, {
        expiresIn: EXPIRES_IN
    })
}

/**
 * retourne les données contenues dans le token
 * @param token JWT
 * @returns {JwtPayload | string}
 */
const decodeJWT = (token) => {
    if(token.length > 0){
        return jwt.decode(token)
    }
}

module.exports = { createToken, decodeJWT, EXPIRES_IN }
