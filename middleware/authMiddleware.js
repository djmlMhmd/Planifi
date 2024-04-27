const jwt = require('jsonwebtoken')
const {errorLogger} = require("../config/winston/winston.config");
const {sendUnauthrorized} = require("../utils/error_message.utils");

/**
 * Middleware qui va sécuriser les routes et obliger les utilisateurs
 * faisant des requetes sur les routes utilisant le middleware
 * à être connectés
 * @param req objet requete HTTP
 * @param res objet réponse HTTP
 * @param next callball qui permet de passer au middleware suivant
 */
const requiredAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // verification si le JWT token existe et est correct
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>{
            if(err){
                errorLogger(err.message, 'requiredAuth')
                sendUnauthrorized(res, 'Authentification requise')
            }
            else{
                next()
            }
        })
    }
    else{
        sendUnauthrorized(res, 'Authentification requise')
    }
}



module.exports = { requiredAuth }