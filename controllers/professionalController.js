const {getClientsCollection} = require("../db/database");
const {verboseLogger, errorLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {sendSuccess, sendInternalServerError} = require("../utils/error_message.utils");

module.exports.professionals_get = async (req, res) => {
    try {
        const client = getClientsCollection();
        const professionals = await client.query(
            'SELECT professional_id, company_name FROM professionals'
        );
        verboseLogger(`Récuperation de la liste des pro`, '','reservation.js', `/professionals`, constants.GET_HTTP)
        return sendSuccess(res, professionals.rows);
    } catch (e) {
        errorLogger(`Erreur lors de la récupération des professionnels: ${e.stack}`, '','reservation.js', `professionals`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des professionnels :' + e.message)
    }
}