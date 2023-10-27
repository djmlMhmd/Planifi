const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const router = Router();
const { getClientsCollection } = require('../db/database');

router.use(express.json());

router.post('/reservation', async (req, res) => {
	const {
		professional_id,
		start_time,
		end_time,
		users_id,
		service_id,
		availability_id,
	} = req.body;

	const startDateTime = moment(start_time, 'HH:mm:ss');
	const day_of_week = startDateTime.day();

	// Check if the time slot is already booked
	const client = getClientsCollection();

	// Check if the time is in default_availability
	const default_availability = await client.query(
		'SELECT * FROM default_availability WHERE professional_id = $1 AND day_of_week = $2 AND start_time <= $3 AND end_time >= $3',
		[professional_id, day_of_week, start_time]
	);
	// The time is in default_availability, mark it as unavailable

	if (default_availability.rows.length > 0) {
		await client.query(
			'UPDATE default_availability SET is_available = false WHERE professional_id = $1 AND day_of_week = $2 AND start_time <= $3 AND end_time >= $3',
			[professional_id, day_of_week, start_time]
		);
	} else {
		// Check if the time is in availability
		const availability = await client.query(
			'SELECT * FROM availability WHERE professional_id = $1 AND start_time <= $2 AND end_time >= $2',
			[professional_id, start_time]
		);
		if (availability.rows.length === 0) {
			return res
				.status(400)
				.json({ message: 'Disponibilité non valide' });
		}
	}
	// users_id verification
	const user = await client.query('SELECT * FROM users WHERE users_id = $1', [
		users_id,
	]);
	if (user.rows.length === 0) {
		return res.status(400).json({ message: 'Utilisateur non valide' });
	}
	//service_id verification
	const service = await client.query(
		'SELECT * FROM services WHERE service_id = $1',
		[service_id]
	);
	if (service.rows.length === 0) {
		return res.status(400).json({ message: 'Service non valide' });
	}

	// availability verification
	const availability = await client.query(
		'SELECT * FROM availability WHERE professional_id = $1 AND start_time <= $2 AND end_time >= $2',
		[professional_id, start_time]
	);
	if (availability.rows.length === 0) {
		return res.status(400).json({ message: 'Disponibilité non valide' });
	}

	// Vérification end_time
	if (end_time <= start_time) {
		return res.status(400).json({ message: 'Heure de fin non valide' });
	}

	const existingReservation = await client.query(
		'SELECT * FROM reservations WHERE professional_id = $1 AND start_time = $2 AND end_time = $3 AND service_id = $4 AND availability_id = $5',
		[professional_id, start_time, end_time, service_id, availability_id]
	);
	if (existingReservation.rows.length > 0) {
		return res.status(400).json({ message: 'Plage horaire déjà réservée' });
	}

	// Making a reservation
	await client.query(
		'INSERT INTO reservations (professional_id, start_time, end_time, users_id, service_id, availability_id) VALUES ($1, $2, $3, $4, $5, $6)',
		[
			professional_id,
			start_time,
			end_time,
			users_id,
			service_id,
			availability_id,
		]
	);

	return res.status(201).json({ message: 'Réservation créée avec succès' });
});

router.get('/reservations/:professional_id', async (req, res) => {
	const professionalId = req.params.professional_id;

	try {
		const client = getClientsCollection();
		const query = {
			text: `
                SELECT
                    reservations.*,
                    services.service_name,
                    CONCAT(users."firstName", ' ', users."lastName") AS user_name,
                    CONCAT(professionals."firstName", ' ', professionals."lastName") AS professional_name
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

		const reservations = result.rows.map((reservation) => ({
			title: reservation.user_name + ' - ' + reservation.service_name,
			start: moment(reservation.start_time, 'HH:mm:ss').format(
				'YYYY-MM-DDTHH:mm:ss'
			),
			end: moment(reservation.end_time, 'HH:mm:ss').format(
				'YYYY-MM-DDTHH:mm:ss'
			),
			extendedProps: {
				reservation: {
					service_id: reservation.service_name,
					professional_name: reservation.professional_name,
				},
			},
		}));

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

module.exports = router;
