const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
const availabilityValidation = require('../validation/validation');

router.use(express.json());

// APPOINTMENT SYSTEM

// Route to define availability times

router.post('/availability', async (req, res) => {
	const { professional_id, day_of_week, start_time, end_time } = req.body;

	try {
		const client = getClientsCollection();

		// check if professsional existing
		const checkProfessionalQuery =
			'SELECT * FROM professionals WHERE professional_id = $1';
		const professionalResult = await client.query(checkProfessionalQuery, [
			professional_id,
		]);

		if (professionalResult.rows.length === 0) {
			return res
				.status(400)
				.json({ message: "Le professionnel avec cet ID n'existe pas" });
		}

		// professinal existing add availability
		const existingAvailability = await client.query(
			'SELECT * FROM availability WHERE professional_id = $1 AND day_of_week = $2 AND start_time = $3 AND end_time = $4',
			[professional_id, day_of_week, start_time, end_time]
		);

		if (existingAvailability.rows.length > 0) {
			return res
				.status(400)
				.json({ message: 'Cette disponibilité existe déjà' });
		}

		const result = await client.query(
			`INSERT INTO availability (professional_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
			[professional_id, day_of_week, start_time, end_time]
		);

		return res
			.status(201)
			.json({ message: 'Disponibilité créée avec succès' });
	} catch (e) {
		console.error(
			'Erreur lors de la création de la disponibilité :',
			e.stack
		);
		res.status(500).json(
			'Erreur lors de la création de la disponibilité : ' + e.message
		);
	}
});

// Route to display the availability of a professional

// Route pour obtenir les disponibilités d'un professionnel
router.get('/availability/:professionalId/:dayOfWeek', async (req, res) => {
	try {
		const client = getClientsCollection();
		const { professionalId, dayOfWeek } = req.params;

		// Récupére les heures disponibles pour le professionnel et le jour de la semaine
		const availability = await client.query(
			'SELECT start_time FROM default_availability WHERE professional_id = $1 AND day_of_week = $2 AND is_available = TRUE',
			[professionalId, dayOfWeek]
		);

		const availableHours = availability.rows.map((row) => row.start_time);
		res.json(availableHours);
	} catch (error) {
		console.error(
			'Erreur lors de la récupération des disponibilités',
			error
		);
		res.status(500).json({
			error: 'Erreur lors de la récupération des disponibilités',
		});
	}
});

module.exports = router;
