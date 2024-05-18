const {getClientsCollection} = require("../db/database");
const {warnLogger, logLogger, errorLogger, verboseLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {sendBadRequest, sendSuccessfullyCreated, sendInternalServerError, sendSuccess} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");


module.exports.availability_post =  async (req, res) => {
    const { pro_id, day_of_week, start_time, end_time } = req.body;

    try {
        const client = getClientsCollection();

        // check if professional existing
        const checkProfessionalQuery =
            'SELECT * FROM users WHERE users_id = $1';
        const professionalResult = await client.query(checkProfessionalQuery, [
            pro_id,
        ]);

        if (professionalResult.rows.length === 0) {
            warnLogger(`L'utilisateur avec cet ID n'existe pas":${pro_id}`, '','availability.js' , '/availability', constants.POST_HTTP)
            return sendBadRequest(res, "L'utilisateur avec cet ID n'existe pas")
        }

        if (professionalResult.rows[0].est_pro === false) {
            warnLogger(`L'utilisateur avec cet ID ${pro_id} n'est pas un professionnel`, '','availability.js' , '/availability', constants.POST_HTTP)
            return sendBadRequest(res, `L'utilisateur avec cet ID ${pro_id} n'est pas un professionnel`)
        }

        // professional existing add availability
        const existingAvailability = await client.query(
            'SELECT * FROM availability WHERE professional_id = $1 AND day_of_week = $2 AND start_time = $3 AND end_time = $4',
            [pro_id, day_of_week, start_time, end_time]
        );

        if (existingAvailability.rows.length > 0) {
            warnLogger(`Cette disponibilité existe déjà: pro:${pro_id}, jour de la semaine:${day_of_week}, temps du début:${start_time}, temps de fin:${end_time}`, '','availability.js' , '/availability', constants.POST_HTTP)
            return sendBadRequest(res, 'Cette disponibilité existe déjà')
        }

        const result = await client.query(
            `INSERT INTO availability (professional_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
            [pro_id, day_of_week, start_time, end_time]
        );
        logLogger(`Disponibilité créée avec succès": ${JSON.stringify(result.rows[0])}`, '','availability.js' , '/availability', constants.POST_HTTP)
        return sendSuccessfullyCreated(res, 'Disponibilité créée avec succès' )
    } catch (e) {
        errorLogger("Erreur lors de la création de la disponibilité :'" + JSON.stringify(e.stack), '','availability.js' , '/availability', constants.POST_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la création de la disponibilité : ' + e.message)
    }
}

module.exports.availability_get =  async (req, res) => {
    const { pro_id, dayOfWeek } = req.params;
    try {
        const client = getClientsCollection();

        if (!isANumber(pro_id) ) {
            return sendBadRequest(res, "le pro_id doit etre un entier")
        }

        // Récupére les heures disponibles pour le professionnel et le jour de la semaine
        const availability = await client.query(
            'SELECT start_time FROM default_availability WHERE professional_id = $1 AND day_of_week = $2 AND is_available = TRUE',
            [pro_id, dayOfWeek]
        );

        const availableHours = availability.rows.map((row) => row.start_time);
        verboseLogger(`Récuperation des disponibilités pour le profesionnel": ${pro_id}, pour le jour de la semaine ${dayOfWeek}`,'', 'availability.js',`/availability/${pro_id}/${dayOfWeek}`, constants.GET_HTTP)
        return sendSuccess(res, availableHours);
    } catch (error) {
        errorLogger("Erreur lors de la récupération des disponibilités" + JSON.stringify(error),'', 'availability.js',`/availability/${pro_id}/${dayOfWeek}`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des disponibilités')
    }
}