const {decodeJWT} = require("../utils/auth.utils");
const {isUndefinedOrEmpty, isANumber} = require("../utils/methods.utils");
const {errorLogger, warnLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {sendBadRequest, sendSuccessfullyCreated, sendFailure,
    sendSuccessWithNoContent,
    sendSuccess,
    sendInternalServerError, sendUnauthorized
} = require("../utils/error_message.utils");
const moment = require("moment/moment");
const {getClientsCollection} = require("../db/database");
const {sendConfirmationRendezVousClient, sendRendezVousPrisPro, sendRendezVousAnnuleClient, sendRendezVousAnnulePro} = require("../mail/send-email");

function getDurationInMinutes(duration) {
    if (typeof duration === 'number') {
        return duration;
    }

    if (typeof duration === 'string') {
        const durationParts = duration.split(':');

        if (durationParts.length >= 2) {
            const hours = Number(durationParts[0]) || 0;
            const minutes = Number(durationParts[1]) || 0;
            return hours * 60 + minutes;
        }

        return Number(duration) || 0;
    }

    if (duration && typeof duration === 'object') {
        const hours = Number(duration.hours) || 0;
        const minutes = Number(duration.minutes) || 0;
        return hours * 60 + minutes;
    }

    return 0;
}


module.exports.reservation_post = async (req, res) => {
    const { professional_id, service_id } = req.body;
    const { id } = decodeJWT(req.cookies.jwt)
    const users_id = req.body.users_id || id;

    if (isUndefinedOrEmpty(professional_id) || isUndefinedOrEmpty(service_id)) {
        errorLogger(`Les champs "professional_id", "users_id" et "service_id" doivent être renseignés`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res, "Les données envoyées sont incorrectes")
    }

    if (!isANumber(professional_id) || !isANumber(users_id) || !isANumber(service_id) ) {
        warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: professional_id:${professional_id}, users_id: ${users_id} et service_id: ${service_id}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res, "le 'professional_id', 'users_id' et 'service_id' de la requête doivent etre des entiers")
    }

    const start_time = req.body.start_time;
    const selectedDate = req.body.day_of_week;
    const day_of_week = moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
    const client = getClientsCollection();

    // Récupère la durée du service depuis la table des services
    // Vérifie si le créneau horaire est déjà réservé
    const existingReservation = await client.query(
        `SELECT * FROM reservations
         WHERE professional_id = $1
           AND start_time = $2
           AND service_id = $3
           AND day_of_week = $4
           AND status = 'confirmed'`,
        [professional_id, start_time, service_id, day_of_week]
    );

    if (existingReservation.rows.length > 0) {
        errorLogger(`Plage horaire déjà réservée: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res,  'Plage horaire déjà réservée' )
    }

    // Récupére la durée du service depuis la table des services
    const service = await client.query(
        'SELECT duration FROM services WHERE service_id = $1',
        [service_id]
    );

    if (service.rows.length === 0) {
        warnLogger(`Service non valide: ${service_id}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res,  'Service non valide')
    }

    const durationInMinutes = getDurationInMinutes(service.rows[0].duration); // On convertit la durée du service en minutes pour garder un calcul simple.

    if (durationInMinutes <= 0) {
        warnLogger(`Durée non valide pour le service: ${service_id}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res, 'Durée de service non valide')
    }

    const startTime = moment(start_time, 'HH:mm');
    const endTime = startTime
        .clone()
        .add(durationInMinutes, 'minutes')
        .format('HH:mm:ss');

    // Vérifie si le temps de début est valide
    if (
        startTime.isBefore(moment('08:00', 'HH:mm')) ||
        startTime.isAfter(moment('21:00', 'HH:mm'))
    ) {
        warnLogger(`Heure de début non valide: ${service_id}, heure: ${start_time}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res,  'Heure de début non valide')
    }

    // Vérifie si le créneau horaire chevauche une réservation existante
    const overlapCheckQuery = `
        SELECT * FROM reservations
        WHERE professional_id = $1 AND day_of_week = $2
        AND status = 'confirmed'
        AND NOT (start_time >= $4 OR end_time <= $3);
    `;

    const overlapCheckResult = await client.query(overlapCheckQuery, [
        professional_id,
        day_of_week,
        startTime.format('HH:mm:ss'),
        endTime,
    ]);

    if (overlapCheckResult.rows.length > 0) {
        errorLogger(`Plage horaire déjà réservée: ${service_id}, heure: ${start_time}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendBadRequest(res,  'Plage horaire déjà réservée')
    }

    // Faire la réservation
    await client.query(
        `INSERT INTO reservations
            (professional_id, start_time, end_time, users_id, service_id, day_of_week, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')`,
        [
            professional_id,
            start_time,
            endTime,
            users_id,
            service_id,
            day_of_week,
        ]
    );

    logLogger(`Réservation créée avec succès: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}, user: ${users_id}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
    sendSuccessfullyCreated(res, 'Réservation créée avec succès' )
    try{
        const clientResultQuery = await client.query('select * from users where users_id = $1', [users_id])
        const proResultQuery = await client.query('select * from users where users_id = $1', [professional_id])
        const serviceResultQuery = await client.query('select * from services where service_id = $1', [service_id])
        if(clientResultQuery.rowCount > 0 && proResultQuery.rowCount > 0 && serviceResultQuery.rowCount > 0) {
            const {email: emailClient, firstName: prenom_client, lastName: nom_client  } = clientResultQuery.rows[0]
            const {email: emailPro, firstName: prenom_pro, lastName: nom_pro  } = proResultQuery.rows[0]


            const nom_service = serviceResultQuery.rows[0].service_name

            const rdvInfosClient = {
                nom_pro: `${nom_pro.toUpperCase()} ${prenom_pro}`,
                service_nom: nom_service,
                date: day_of_week,
                heure: start_time,
            }

            const rdvInfosPro = {
                nom_client: `${nom_client.toUpperCase()} ${prenom_client}`,
                service_nom: nom_service,
                date: day_of_week,
                heure: start_time,
            }
            await sendConfirmationRendezVousClient(emailClient, prenom_client, rdvInfosClient)
            await sendRendezVousPrisPro(emailPro, prenom_pro, rdvInfosPro)
        }
    }
    catch (e) {
        errorLogger(`Erreur lors de la reservation avec les infos: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}, user: ${users_id}`, '','reservationController.js' ,'/reservation', constants.POST_HTTP)
        return sendFailure(res, 'Erreur lors de la reservation' )
    }
}

module.exports.reservation_pro_get = async (req, res) => {

    const { id } = decodeJWT(req.cookies.jwt)
    try {
        const client = getClientsCollection();
        //
        const query = {
            text: `
                SELECT
                    reservations.*,
                    services.service_name,
                    services.duration AS service_duration, -- Ajoutez cette ligne pour récupérer la durée du service
                    CONCAT(users."firstName", ' ', users."lastName") AS user_name,
                    CONCAT(pro."firstName", ' ', pro."lastName") AS professional_name,
                    reservations.day_of_week
                FROM
                    reservations
                JOIN
                    services ON reservations.service_id = services.service_id
                JOIN
                    users ON reservations.users_id = users.users_id
                JOIN
                    users as pro ON reservations.professional_id = pro.users_id
                WHERE
                    reservations.professional_id = $1
            `,
            values: [id],
        };

        const result = await client.query(query);

        if (result.rows.length === 0) {
            warnLogger(`Aucune réservation trouvée pour le pro: ${id}`, '','reservationController.js', '/reservations', constants.GET_HTTP)
            return sendSuccessWithNoContent(res, 'Aucune réservation trouvée')
        }
        const reservations = result.rows.map((reservation) => {
            const serviceDuration = moment.duration(
                reservation.service_duration
            );
            const durationString = `${serviceDuration.hours()}h${serviceDuration.minutes()}m`;
            const start = moment(
                reservation.day_of_week + 'T' + reservation.start_time,
                'DD-MM-YYYYTHH:mm:ss'
            ).format('YYYY-MM-DDTHH:mm:ss');
            const end = moment(start)
                .add(reservation.service_duration, 'minutes')
                .format('YYYY-MM-DDTHH:mm:ss');

            return {
                title: reservation.user_name,
                start: start,
                end: end,
                extendedProps: {
                    reservation: {
                        service_id: reservation.service_name,
                        professional_name: reservation.professional_name,
                        service_duration: durationString,
                        status: reservation.status || 'confirmed',
                    },
                },
            };
        });
        verboseLogger(`Reservations  trouvées: ${JSON.stringify(reservations)}`, '','reservationController.js', '/reservations', constants.GET_HTTP)
        return sendSuccess(res, reservations)
    } catch (e) {
        errorLogger(`Erreur lors de la récupération des réservations : ${e.stack}`, '','reservationController.js', '/reservations', constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message )
    }
}

module.exports.reservation_client_get =  async (req, res) => {
    const { id } = decodeJWT(req.cookies.jwt)

    try {
        const client = getClientsCollection();
        const query = {
            text: `
                SELECT
                    reservations.reservation_id,
                    reservations.day_of_week,
                    reservations.start_time,
                    reservations.end_time,
                    reservations.status,
                    services.service_name,
                    CONCAT(pro."firstName", ' ', pro."lastName") AS professional_name,
                    pro_account.company_name
                FROM
                    reservations
                JOIN
                    services ON reservations.service_id = services.service_id
                JOIN
                    users as pro ON reservations.professional_id = pro.users_id
                LEFT JOIN
                    pro_account ON pro_account.user_id = pro.users_id
                WHERE
                    reservations.users_id = $1
                ORDER BY
                    TO_DATE(reservations.day_of_week, 'DD-MM-YYYY') DESC,
                    reservations.start_time DESC
            `,
            values: [id],
        };

        const result = await client.query(query);

        if (result.rows.length > 0) {
            const reservations = result.rows.map((reservation) => {
                const normalizedDate = moment(reservation.day_of_week, 'DD-MM-YYYY').format('YYYY-MM-DD');
                const startTime = String(reservation.start_time).slice(0, 5);
                const endTime = String(reservation.end_time).slice(0, 5);

                return {
                reservation_id: reservation.reservation_id,
                title: reservation.company_name || reservation.professional_name,
                company_name: reservation.company_name || reservation.professional_name,
                professional_name: reservation.professional_name,
                service_name: reservation.service_name,
                status: reservation.status || 'confirmed',
                day_of_week: reservation.day_of_week,
                start_time: startTime,
                end_time: endTime,
                    // Je garde les champs historiques pour les composants déjà branchés.
                    start: `${moment(reservation.day_of_week, 'DD-MM-YYYY').format('DD/MM/YY')} ${startTime} - ${endTime}`,
                    date_label: moment(reservation.day_of_week, 'DD-MM-YYYY').format('DD/MM/YY'),
                    time_label: `${startTime} - ${endTime}`,
                    // Ces deux champs servent au vrai calendrier frontend.
                    start_at: `${normalizedDate}T${startTime}:00`,
                    end_at: `${normalizedDate}T${endTime}:00`,
                };
            });
            verboseLogger(`Reservations client ${id} trouvées`,'' ,'reservationController.js' ,'/reservations/client', constants.GET_HTTP)
            return sendSuccess(res, reservations)
        } else {
            verboseLogger(`Aucune réservation trouvée ${id}`,'' ,'reservationController.js' ,'/reservations/client', constants.GET_HTTP)
            return sendSuccessWithNoContent(res, 'Aucune réservation trouvée')
        }
    } catch (e) {
        errorLogger(`Erreur lors de la récupération des réservations du client ${id}: ${JSON.stringify(e.message)}`,'' ,'reservationController.js' ,'/reservations/client', constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message)
    }
}

module.exports.reservation_byHour_get = async (req, res) => {
    try {
        const { selectedDate, professionalId } = req.query;
        let query = `
            SELECT start_time, end_time
            FROM reservations
            WHERE day_of_week = $1
              AND status = 'confirmed'
        `;
        const queryValues = [selectedDate];

        if (professionalId) {
            if (!isANumber(professionalId)) {
                return sendBadRequest(res, "le professionalId doit etre un entier");
            }

            query += ' AND professional_id = $2';
            queryValues.push(professionalId);
        }

        const client = getClientsCollection();
        const result = await client.query(query, queryValues);
        // Je renvoie les plages complètes pour que le front puisse bloquer tous les créneaux qui se chevauchent.
        const reservedHours = result.rows.map((row) => ({
            start_time: String(row.start_time).slice(0, 5),
            end_time: String(row.end_time).slice(0, 5),
        }));
        verboseLogger(`Récupération des heures réservées sur la date: ${JSON.stringify(selectedDate)}, professionalId: ${JSON.stringify(professionalId)}`, '','reservationController.js', '/reservedHours', constants.GET_HTTP)
        return sendSuccess(res, reservedHours)
    } catch (error) {
        errorLogger(`Erreur lors de la récupération des heures réservées: ${JSON.stringify(error)}`, '','reservationController.js', '/reservedHours', constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des heures réservées')
    }
}

module.exports.reservation_delete = async (req, res) => {
    const {reservationId} = req.params;
    try {

        if (!isANumber(reservationId) ) {
            return sendBadRequest(res, "le reservationId doit etre un entier")
        }
        const { id, statut } = decodeJWT(req.cookies.jwt)

        logLogger(`Reservation ID: ${reservationId}`, '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
        // Récupérez le serviceId en interrogeant la base de données à partir de l'ID de réservation.
        const client = getClientsCollection();
        const queryForServiceId = `
			SELECT service_id, users_id, professional_id, day_of_week, start_time, status FROM reservations 
			WHERE reservation_id = $1;
		`;

        const service = await client.query(queryForServiceId, [reservationId]);
        if (service.rowCount === 0) {
            warnLogger(`Réservation introuvable.:${reservationId}`, '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
            return sendSuccessWithNoContent(res, 'Réservation introuvable.')
        }

        const { service_id: serviceId, users_id: userId, professional_id: proId, day_of_week, start_time, status } = service.rows[0];

        if (status && status !== 'confirmed') {
            return sendSuccessWithNoContent(res, 'Réservation déjà annulée.')
        }

        const isClientOwner = userId === id;
        const isProfessionalOwner = proId === id && statut === 'professionnel';

        if (!isClientOwner && !isProfessionalOwner) {
            errorLogger(`Vous n'êtes pas autorisé à supprimer cette réservation:${reservationId}, service id: ${serviceId}, client id:${id}`, '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
            return sendUnauthorized(res, "Vous n'êtes pas autorisé à supprimer cette réservation.")
        }

        const nextStatus = isProfessionalOwner ? 'cancelled_by_pro' : 'cancelled_by_client';
        const clientResultQuery = await client.query('select * from users where users_id = $1', [userId])
        const proResultQuery = await client.query('select * from users where users_id = $1', [proId])
        const serviceResultQuery = await client.query('select * from services where service_id = $1', [serviceId])

        // Ici je garde la réservation en base pour conserver l'historique d'annulation.
        const result = await client.query(
            `UPDATE reservations
             SET status = $1
             WHERE reservation_id = $2`,
            [nextStatus, reservationId]
        );

        if (result.rowCount === 1) {
            logLogger(`La réservation a été supprimée avec succès:${reservationId}, service id: ${serviceId}, client id:${id}`, '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)

            try{
                if(clientResultQuery.rowCount > 0 && proResultQuery.rowCount > 0 && serviceResultQuery.rowCount > 0) {
                    //TODO: créer une fonction pour le code dupliqué
                    const {email: emailClient, firstName: prenom_client, lastName: nom_client  } = clientResultQuery.rows[0]
                    const {email: emailPro, firstName: prenom_pro, lastName: nom_pro  } = proResultQuery.rows[0]

                    const nom_service = serviceResultQuery.rows[0].service_name

                    const rdvInfosClient = {
                        nom_pro: `${nom_pro.toUpperCase()} ${prenom_pro}`,
                        service_nom: nom_service,
                        date: day_of_week,
                        heure: start_time,
                    }

                    const rdvInfosPro = {
                        nom_client: `${nom_client.toUpperCase()} ${prenom_client}`,
                        service_nom: nom_service,
                        date: day_of_week,
                        heure: start_time,
                    }
                    sendSuccessWithNoContent(res)
                    await sendRendezVousAnnuleClient(emailClient, prenom_client, rdvInfosClient)
                    await sendRendezVousAnnulePro(emailPro, prenom_pro, rdvInfosPro)
                }
            }
            catch (e) {
                errorLogger(`Erreur lors de la reservation avec les infos: pro: ${proId}, heure début: ${start_time}, service id: ${serviceId}, jour de la semaine: ${day_of_week}, user: ${userId}`, '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
                return sendFailure(res, 'Erreur lors de la suppresion de la reservation' )
            }
            return
        }

        return sendFailure(res, "Impossible d'annuler cette réservation.")
    } catch (error) {
        errorLogger(`Erreur lors de la suppression de la réservation:` + JSON.stringify(error), '','reservationController.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la suppression de la réservation : ' + error.message)
    }
}
