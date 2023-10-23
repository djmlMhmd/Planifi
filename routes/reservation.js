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
		'SELECT * FROM reservations WHERE professional_id = $1 AND start_time = $2 AND end_time = $3 AND users_id = $4 AND service_id = $5 AND availability_id = $6',
		[
			professional_id,
			start_time,
			end_time,
			users_id,
			service_id,
			availability_id,
		]
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

module.exports = router;
