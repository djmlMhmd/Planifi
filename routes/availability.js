const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
const {errorLogger, warnLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {requiredAuth} = require("../middleware/authMiddleware");
const {sendInternalServerError, sendBadRequest, sendSuccessfullyCreated, sendSuccess} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");
const {constants} = require("../constants/constants");

router.use(express.json());

// APPOINTMENT SYSTEM

// Route to define availability times

router.post('/availability', requiredAuth, async (req, res) => {
	const { professional_id, day_of_week, start_time, end_time } = req.body;

	try {
		const client = getClientsCollection();

		// check if professional existing
		const checkProfessionalQuery =
			'SELECT * FROM professionals WHERE professional_id = $1';
		const professionalResult = await client.query(checkProfessionalQuery, [
			professional_id,
		]);

		if (professionalResult.rows.length === 0) {
			warnLogger(`Le professionnel avec cet ID n'existe pas":${professional_id}`, '','availability.js' , '/availability', constants.POST_HTTP)
			return sendBadRequest(res, "Le professionnel avec cet ID n'existe pas")
		}

		// professional existing add availability
		const existingAvailability = await client.query(
			'SELECT * FROM availability WHERE professional_id = $1 AND day_of_week = $2 AND start_time = $3 AND end_time = $4',
			[professional_id, day_of_week, start_time, end_time]
		);

		if (existingAvailability.rows.length > 0) {
			warnLogger(`Cette disponibilité existe déjà: pro:${professional_id}, jour de la semaine:${day_of_week}, temps du début:${start_time}, temps de fin:${end_time}`, '','availability.js' , '/availability', constants.POST_HTTP)
			return sendBadRequest(res, 'Cette disponibilité existe déjà')
		}

		const result = await client.query(
			`INSERT INTO availability (professional_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
			[professional_id, day_of_week, start_time, end_time]
		);
		logLogger(`Disponibilité créée avec succès": ${JSON.stringify(result.rows[0])}`, '','availability.js' , '/availability', constants.POST_HTTP)
		return sendSuccessfullyCreated(res, 'Disponibilité créée avec succès' )
	} catch (e) {
		errorLogger("Erreur lors de la création de la disponibilité :'" + JSON.stringify(e.stack), '','availability.js' , '/availability', constants.POST_HTTP)
		return sendInternalServerError(res, 'Erreur lors de la création de la disponibilité : ' + e.message)
	}
});

// Route pour obtenir les disponibilités d'un professionnel
router.get('/availability/:professionalId/:dayOfWeek', requiredAuth, async (req, res) => {
	const { professionalId, dayOfWeek } = req.params;
	try {
		const client = getClientsCollection();

		if (!isANumber(professionalId) ) {
			return sendBadRequest(res, "le professionalId doit etre un entier")
		}

		// Récupére les heures disponibles pour le professionnel et le jour de la semaine
		const availability = await client.query(
			'SELECT start_time FROM default_availability WHERE professional_id = $1 AND day_of_week = $2 AND is_available = TRUE',
			[professionalId, dayOfWeek]
		);

		const availableHours = availability.rows.map((row) => row.start_time);
		verboseLogger(`Récuperation des disponibilités pour le profesionnel": ${professionalId}, pour le jour de la semaine ${dayOfWeek}`,'', 'availability.js',`/availability/${professionalId}/${dayOfWeek}`, constants.GET_HTTP)
		return sendSuccess(res, availableHours);
	} catch (error) {
		errorLogger("Erreur lors de la récupération des disponibilités" + JSON.stringify(error),'', 'availability.js',`/availability/${professionalId}/${dayOfWeek}`, constants.GET_HTTP)
		return sendInternalServerError(res, 'Erreur lors de la récupération des disponibilités')
	}
});

module.exports = router;
