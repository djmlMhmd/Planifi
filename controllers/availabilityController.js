const {getClientsCollection} = require("../db/database");
const {warnLogger, logLogger, errorLogger, verboseLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {sendBadRequest, sendSuccessfullyCreated, sendInternalServerError, sendSuccess} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");

function timeToMinutes(timeValue) {
    // Je passe les heures en minutes pour comparer et découper les plages plus facilement.
    const [hours, minutes] = String(timeValue).slice(0, 5).split(':');
    return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

function minutesToTime(totalMinutes) {
    // Je retransforme en HH:mm pour garder un format simple côté front.
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
}


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
    const { professionalId, dayOfWeek } = req.params;
    try {
        const client = getClientsCollection();

        if (!isANumber(professionalId) ) {
            return sendBadRequest(res, "le professionalId doit etre un entier")
        }

        // On récupère les plages horaires du professionnel pour le jour demandé.
        const availability = await client.query(
            `SELECT start_time, end_time
             FROM availability
             WHERE professional_id = $1 AND day_of_week = $2
             ORDER BY start_time ASC`,
            [professionalId, dayOfWeek]
        );

        const slotSet = new Set();

        availability.rows.forEach((row) => {
            const startMinutes = timeToMinutes(row.start_time);
            const endMinutes = timeToMinutes(row.end_time);

            // On découpe la plage en créneaux de 30 minutes pour l'affichage côté réservation.
            for (let cursor = startMinutes; cursor <= endMinutes; cursor += 30) {
                slotSet.add(minutesToTime(cursor));
            }
        });

        // Je renvoie à la fois les slots découpés et les vraies plages d'origine.
        const availableHours = Array.from(slotSet).sort();
        const availabilityRanges = availability.rows.map((row) => ({
            start_time: String(row.start_time).slice(0, 5),
            end_time: String(row.end_time).slice(0, 5),
        }));
        verboseLogger(`Récuperation des disponibilités pour le profesionnel": ${professionalId}, pour le jour de la semaine ${dayOfWeek}`,'', 'availability.js',`/availability/${professionalId}/${dayOfWeek}`, constants.GET_HTTP)
        return sendSuccess(res, {
            slots: availableHours,
            ranges: availabilityRanges,
        });
    } catch (error) {
        errorLogger("Erreur lors de la récupération des disponibilités" + JSON.stringify(error),'', 'availability.js',`/availability/${professionalId}/${dayOfWeek}`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des disponibilités')
    }
}
