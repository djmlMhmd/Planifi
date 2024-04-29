const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const { getClientsCollection } = require('../db/database');
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {warnLogger, errorLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendBadRequest, sendSuccessfullyCreated, sendSuccessWithNoContent,
	sendSuccess, sendFailure
} = require("../utils/error_message.utils");
const {isUndefinedOrEmpty, isANumber} = require("../utils/methods.utils");
const {sendConfirmationRendezVousClient, sendRendezVousPrisPro} = require("../mail/send-email");
const router = Router();
router.use(express.json());

router.post('/reservation', requiredAuth, async (req, res) => {
	const { professional_id, users_id, service_id } = req.body;
	const { id } = decodeJWT(req.cookies.jwt)

	if (isUndefinedOrEmpty(professional_id) || isUndefinedOrEmpty(users_id) || isUndefinedOrEmpty(service_id)) {
		errorLogger(`Les champs "professional_id", "users_id" et "service_id" doivent être renseignés`, 'reservation.js [POST] /reservation')
		return sendBadRequest(res, "Les données envoyées sont incorrectes")
	}

	if (!isANumber(professional_id) || !isANumber(users_id) || !isANumber(service_id) ) {
		warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: professional_id:${professional_id}, users_id: ${users_id} et service_id: ${service_id}`, 'reservation.js [POST] /reservation')
		return sendBadRequest(res, "le 'professional_id', 'users_id' et 'service_id' de la requête doivent etre des entiers")
	}

	const start_time = req.body.start_time;
	const selectedDate = req.body.day_of_week;
	const day_of_week = moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
	const client = getClientsCollection();

	// Récupère la durée du service depuis la table des services
	// Vérifie si le créneau horaire est déjà réservé
	const existingReservation = await client.query(
		'SELECT * FROM reservations WHERE professional_id = $1 AND start_time = $2 AND service_id = $3 AND day_of_week = $4',
		[professional_id, start_time, service_id, day_of_week]
	);

	if (existingReservation.rows.length > 0) {
		errorLogger(`Plage horaire déjà réservée: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}`, 'reservation.js [POST] /reservation')
		return sendBadRequest(res,  'Plage horaire déjà réservée' )
	}

	// Récupére la durée du service depuis la table des services
	const service = await client.query(
		'SELECT duration FROM services WHERE service_id = $1',
		[service_id]
	);

	if (service.rows.length === 0) {
		warnLogger(`Service non valide: ${service_id}`, 'reservation.js [POST] /reservation')
		return sendBadRequest(res,  'Service non valide')
	}

	const duration = service.rows[0].duration; // Durée du service enregistrée dans la table
	const startTime = moment(start_time, 'HH:mm');
	const endTime = startTime
		.clone()
		.add(duration, 'minutes')
		.format('HH:mm:ss');

	// Vérifie si le temps de début est valide
	if (
		startTime.isBefore(moment('08:00', 'HH:mm')) ||
		startTime.isAfter(moment('21:00', 'HH:mm'))
	) {
		warnLogger(`Heure de début non valide: ${service_id}, heure: ${start_time}`, 'reservation.js [POST] /reservation')
		return sendBadRequest(res,  'Heure de début non valide')
	}

	// Vérifie si le créneau horaire chevauche une réservation existante
	const overlapCheckQuery = `
        SELECT * FROM reservations
        WHERE professional_id = $1 AND day_of_week = $2
        AND NOT (start_time >= $4 OR end_time <= $3);
    `;

	const overlapCheckResult = await client.query(overlapCheckQuery, [
		professional_id,
		day_of_week,
		startTime.format('HH:mm:ss'),
		endTime,
	]);

	if (overlapCheckResult.rows.length > 0) {
		return res.status(400).json({
			message: 'Plage horaire déjà réservée.',
		});
	}

	// Faire la réservation
	await client.query(
		'INSERT INTO reservations (professional_id, start_time, end_time, users_id, service_id, day_of_week) VALUES ($1, $2, $3, $4, $5, $6)',
		[
			professional_id,
			start_time,
			endTime,
			users_id,
			service_id,
			day_of_week,
		]
	);

	//TODO : recuperer les mails du pro et du client
	try{
		const clientResultQuery = await client.query('select * from users where users_id = $1', [users_id])
		const proResultQuery = await client.query('select * from professionals where professional_id = $1', [professional_id])
		const serviceResultQuery = await client.query('select * from services where service_id = $1', [service_id])

		if(clientResultQuery.rowCount > 0 && proResultQuery.rowCount > 0 && serviceResultQuery.rowCount > 0) {
			const emailClient = clientResultQuery.rows[0].email
			const prenom_client = clientResultQuery.rows[0].firstName
			const nom_client = clientResultQuery.rows[0].lastName

			const emailPro = proResultQuery.rows[0].email
			const prenom_pro = proResultQuery.rows[0].firstName
			const nom_pro = proResultQuery.rows[0].lastName

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
		errorLogger(`Erreur lors de la reservation avec les infos: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}, user: ${users_id}`, 'reservation.js [POST] /reservation')
		return sendFailure(res, 'Erreur lors de la reservation' )
	}
    	logLogger(`Réservation créée avec succès: pro: ${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}, user: ${users_id}`, 'reservation.js [POST] /reservation')
    	return sendSuccessfullyCreated(res, 'Réservation créée avec succès' )


});

router.get('/reservations', requiredAuth, async (req, res) => {

    const { id } = decodeJWT(req.cookies.jwt)
    try {
		const client = getClientsCollection();
		const query = {
			text: `
                SELECT
                    reservations.*,
                    services.service_name,
                    services.duration AS service_duration, -- Ajoutez cette ligne pour récupérer la durée du service
                    CONCAT(users."firstName", ' ', users."lastName") AS user_name,
                    CONCAT(professionals."firstName", ' ', professionals."lastName") AS professional_name,
                    reservations.day_of_week
                FROM
                    reservations
                JOIN
                    services ON reservations.service_id = services.service_id
                JOIN
                    users ON reservations.users_id = users.users_id
                JOIN
                    professionals ON reservations.professional_id = professionals.professional_id
                WHERE
                    reservations.professional_id = $1
            `,
			values: [id],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			warnLogger(`Aucune réservation trouvée pour le pro: ${id}`, 'reservation.js [GET] /reservations')
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
					},
				},
			};
		});
		verboseLogger(`Reservations  trouvées: ${JSON.stringify(reservations)}`, 'reservation.js [GET] /reservations')
		return sendSuccess(res, reservations)
	} catch (e) {
		errorLogger(`Erreur lors de la récupération des réservations : ${e.stack}`, 'reservation.js [GET] /reservations')
		return sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message )
	}
});

router.get('/reservations/client', requiredAuth, async (req, res) => {
	const { id } = decodeJWT(req.cookies.jwt)

	try {
		const client = getClientsCollection();
		const query = {
			text: `
                SELECT
                    reservations.reservation_id,
                    reservations.start_time,
                    services.service_name,
                    CONCAT(professionals."firstName", ' ', professionals."lastName") AS professional_name
                FROM
                    reservations
                JOIN
                    services ON reservations.service_id = services.service_id
                JOIN
                    professionals ON reservations.professional_id = professionals.professional_id
                WHERE
                    reservations.users_id = $1
            `,
			values: [id],
		};

		const result = await client.query(query);

		if (result.rows.length > 0) {
			const reservations = result.rows.map((reservation) => ({
				reservation_id: reservation.reservation_id,
				title: reservation.professional_name,
				service_name: reservation.service_name,
				start: moment(reservation.start_time, 'HH:mm:ss').format(
					'DD/MM/YY HH:mm'
				),
			}));
			verboseLogger(`Reservations client ${id} trouvées`, 'reservation.js [GET] /reservations/client')
			return sendSuccess(res, reservations)
		} else {
			verboseLogger(`Aucune réservation trouvée ${id}`, 'reservation.js [GET] /reservations/client')
			return sendSuccessWithNoContent(res, 'Aucune réservation trouvée')
		}
	} catch (e) {
		errorLogger(`Erreur lors de la récupération des réservations du client ${id}: ${JSON.stringify(e.message)}`, 'reservation.js [GET] /reservations/client')
		return sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message)
	}
});

router.get('/reservedHours', requiredAuth, async (req, res) => {
	try {
		const {selectedDate} = req.query;
		const query = `
            SELECT start_time
            FROM reservations
            WHERE day_of_week = $1
        `;

		const client = getClientsCollection();
		const result = await client.query(query, [selectedDate]);
		const reservedHours = result.rows.map((row) => row.start_time);
		verboseLogger(`Récupération des heures réservées sur la date: ${JSON.stringify(selectedDate)}`, 'reservation.js [GET] /reservedHours')
		return sendSuccess(res, reservedHours)
	} catch (error) {
		errorLogger(`Erreur lors de la récupération des heures réservées: ${JSON.stringify(error)}`, 'reservation.js [GET] /reservedHours')
		return sendInternalServerError(res, 'Erreur lors de la récupération des heures réservées')
	}
});

module.exports = router;
