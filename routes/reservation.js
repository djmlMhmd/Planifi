const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const { getClientsCollection } = require('../db/database');

const router = Router();
router.use(express.json());

router.post('/reservation', async (req, res) => {
	const { professional_id, users_id, service_id } = req.body;

	const start_time = req.body.start_time;
	const selectedDate = req.body.day_of_week; // Assurez-vous que le champ dans le formulaire correspond à "selected_date"

	const day_of_week = moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'); // Convertir en nom de jour

	const client = getClientsCollection();

	// Récupérer la durée du service depuis la table des services
	const service = await client.query(
		'SELECT duration FROM services WHERE service_id = $1',
		[service_id]
	);

	if (service.rows.length === 0) {
		return res.status(400).json({ message: 'Service non valide' });
	}

	const duration = service.rows[0].duration; // Durée du service enregistrée dans la table

	// Calculer l'heure de fin en utilisant une simple chaîne de caractères
	const startDateTime = start_time;
	const end_time = moment(start_time, 'HH:mm')
		.clone()
		.add(duration)
		.format('HH:mm:ss');

	// Vérifier si le temps de début est valide
	if (
		moment(start_time, 'HH:mm').isBefore('08:00', 'HH:mm') ||
		moment(start_time, 'HH:mm').isAfter('21:00', 'HH:mm')
	) {
		return res.status(400).json({ message: 'Heure de début non valide' });
	}

	// Vérifier si le créneau horaire est déjà réservé
	const existingReservation = await client.query(
		'SELECT * FROM reservations WHERE professional_id = $1 AND start_time = $2 AND service_id = $3 AND day_of_week = $4',
		[professional_id, start_time, service_id, day_of_week]
	);

	if (existingReservation.rows.length > 0) {
		return res.status(400).json({ message: 'Plage horaire déjà réservée' });
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

	return res.status(201).json({ message: 'Réservation créée avec succès' });
});

router.get('/reservations', async (req, res) => {
	const professionalId = req.session.professionalID;

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
			values: [professionalId],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
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
		console.log('start:', reservations);

		res.json(reservations);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des réservations :',
			e.stack
		);
		res.status(500).json(
			'Erreur lors de la récupération des réservations : ' + e.message
		);
	}
});

router.get('/reservations/client', async (req, res) => {
	const clientID = req.session.clientID;

	if (!clientID) {
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
			values: [clientID],
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

			res.json(reservations);
		} else {
			res.json({ message: 'Aucune réservation trouvée' });
		}
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des réservations du client:',
			e.stack
		);
		res.status(500).json(
			'Erreur lors de la récupération des réservations : ' + e.message
		);
	}
});

router.get('/reservedHours', async (req, res) => {
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

		res.json(reservedHours);
	} catch (error) {
		console.error(
			'Erreur lors de la récupération des heures réservées',
			error
		);
		res.status(500).json({
			error: 'Erreur lors de la récupération des heures réservées',
		});
	}
});

module.exports = router;
