const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const { getClientsCollection } = require('../db/database');
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {warnLogger, errorLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendBadRequest, sendSuccessfullyCreated} = require("../utils/error_message.utils");

const router = Router();
router.use(express.json());

router.post('/reservation', requiredAuth, async (req, res) => {
	const { professional_id, users_id, service_id } = req.body;

	const start_time = req.body.start_time;
	const selectedDate = req.body.day_of_week;

	const day_of_week = moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');

	const client = getClientsCollection();

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
		sendBadRequest(res,  'Service non valide')
	}

	const duration = service.rows[0].duration; // Durée du service enregistrée dans la table

	// Calcule l'heure de fin en utilisant une simple chaîne de caractères
	const startDateTime = start_time;
	const end_time = moment(start_time, 'HH:mm')
		.clone()
		.add(duration)
		.format('HH:mm:ss');

	// Vérifie si le temps de début est valide
	if (
		moment(start_time, 'HH:mm').isBefore('08:00', 'HH:mm') ||
		moment(start_time, 'HH:mm').isAfter('21:00', 'HH:mm')
	) {
		warnLogger(`Heure de début non valide: ${service_id}, heure: ${start_time}`, 'reservation.js [POST] /reservation')
		sendBadRequest(res,  'Heure de début non valide')
	}

	// Marquer le créneau horaire comme non disponible
	await client.query(
		'UPDATE default_availability SET is_available = false WHERE professional_id = $1 AND day_of_week = $2 AND start_time <= $3 AND end_time >= $4',
		[professional_id, day_of_week, start_time, end_time]
	);

	// Faire la réservation
	await client.query(
		'INSERT INTO reservations (professional_id, start_time, users_id, service_id, day_of_week) VALUES ($1, $2, $3, $4, $5)',
		[professional_id, start_time, users_id, service_id, day_of_week]
	);
	logLogger(`Réservation créée avec succès: pro${professional_id}, heure début: ${start_time}, service id: ${service_id}, jour de la semaine: ${day_of_week}, user: ${users_id}`, 'reservation.js [POST] /reservation')
	return sendSuccessfullyCreated(res, 'Réservation créée avec succès' )
});

router.get('/reservations', requiredAuth, async (req, res) => {
	const professionalId = req.cookies.professionalID;

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
			warnLogger(`Aucune réservation trouvée: pro: ${professionalId}`, 'reservation.js [GET] /reservations')
			return res
				.status(404)
				.json({ message: 'Aucune réservation trouvée' });
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
		res.json(reservations);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des réservations :',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération des réservations : ${e.stack}`, 'reservation.js [GET] /reservations')
		sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message )
	}
});

router.get('/reservations/client', requiredAuth, async (req, res) => {
	const clientID = req.cookies.clientID;

	const { id } = decodeJWT(req.cookies.jwt)
	// c'est plus utile
	if (!id) {
        warnLogger('Authentification requise', 'reservation.js [GET] /reservations/client')
        return res.status(401).json({ message: 'Authentification requise' });
	}

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
			verboseLogger(`Reservations client ${clientID} trouvées`, 'reservation.js [GET] /reservations/client')
			res.json(reservations);
		} else {
			verboseLogger(`Aucune réservation trouvée ${clientID}`, 'reservation.js [GET] /reservations/client')
			res.json({ message: 'Aucune réservation trouvée' });
		}
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des réservations du client:',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération des réservations : ${JSON.stringify(e.message)}`, 'reservation.js [GET] /reservations/client')
		sendInternalServerError(res, 'Erreur lors de la récupération des réservations : ' + e.message)
	}
});

router.get('/reservedHours', requiredAuth, async (req, res) => {
	try {
		const selectedDate = req.query.selectedDate;
		const query = `
            SELECT start_time
            FROM reservations
            WHERE day_of_week = $1
        `;

		const client = getClientsCollection();
		const result = await client.query(query, [selectedDate]);
		const reservedHours = result.rows.map((row) => row.start_time);
		verboseLogger(`Récupération des heures réservées sur la date: ${JSON.stringify(selectedDate)}`, 'reservation.js [GET] /reservedHours')
		res.json(reservedHours);
	} catch (error) {
		console.error(
			'Erreur lors de la récupération des heures réservées',
			error
		);
		errorLogger(`Erreur lors de la récupération des heures réservées: ${JSON.stringify(error)}`, 'reservation.js [GET] /reservedHours')
		sendInternalServerError(res, 'Erreur lors de la récupération des heures réservées')
	}
});

module.exports = router;
