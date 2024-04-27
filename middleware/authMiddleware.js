const jwt = require('jsonwebtoken')

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
                console.log(err.message)
                res.redirect('/');
            }
            else{
                next()
            }
        })
    }
    else{
        res.redirect('/');
    }
}



module.exports = { requiredAuth }