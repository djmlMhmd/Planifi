/**
 * Case for CRUD success
 *
 * @param res objet résultat de la requete
 * @param message message
 * @param status status de la requete
 */
const sendSuccess = (res, message, status = 200) => {
    res.status(status).json({
        code: status,
        message,
        error: false
    })
}

/**
 * Case for created success
 *
 * @param res objet résultat de la requete
 * @param message message
 * @param status status de la requete
 */
const sendSuccessfullyCreated = (res, message, status = 201) => {
    res.status(status).json({
        code: status,
        message,
        error: false
    })
}

/**
 * Case for no content success
 *
 * @param res objet résultat de la requete
 * @param message message
 * @param status status de la requete
 */
const sendSuccessWithNoContent = (res, message = '', status = 204) => {
    res.status(status).json({
        code: status,
        message,
        error: false
    })
}

/**
 * Case for bad request
 *
 * @param res objet résultat de la requete
 * @param error message
 * @param status status de la requete
 */
const sendBadRequest = (res, error, status = 400) => {
    res.status(status).json({
        code: status,
        message: error,
        error: true
    })
}

/**
 * Case for token/credentials invalid
 *
 * @param res objet résultat de la requete
 * @param error message
 * @param status status de la requete
 */
const sendError = (res, error, status = 401) => {
    res.status(status).json({
        code: status,
        message: error,
        error: true
    })
}

/**
 * Case for if user can't access this api, because role not allowed
 *
 * @param res objet résultat de la requete
 * @param message message
 * @param status status de la requete
 */
const sendUnauthrorized = (res, message, status = 403) => {
    res.status(status).json({
        code: status,
        message,
        error: true
    })
}

/**
 * Case for update,created,deleted failed
 *
 * @param res objet résultat de la requete
 * @param error message
 * @param status status de la requete
 */
const sendFailure = (res, error, status = 412) => {
    res.status(status).json({
        code: status,
        message: error,
        error: true
    })
}

/**
 * Case for if your server is crash or database error etc
 *
 * @param res objet résultat de la requete
 * @param message message
 * @param status status de la requete
 */
const sendInternalServerError = (res, message, status = 500) => {
    res.status(status).json({
        code: status,
        message,
        error: true
    })
}

module.exports = {
    sendSuccess,
    sendSuccessfullyCreated,
    sendError,
    sendUnauthrorized,
    sendFailure,
    sendInternalServerError,
    sendBadRequest,
    sendSuccessWithNoContent
}