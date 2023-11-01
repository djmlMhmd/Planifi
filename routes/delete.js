const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const { getClientsCollection } = require('../db/database');

const router = Router();
router.use(express.json());

router.delete('/supprimerReservation', async (req, res) => {
	try {
		const clientID = req.session.clientID;
		console.log('client id :', clientID);
		const client = getClientsCollection();

		console.log('réservation id :', reservationId);

		const query = {
			text: 'SELECT * FROM reservations WHERE reservation_id = $1 AND users_id = $2',
			values: [reservationId, clientID],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			return res
				.status(403)
				.json(
					"Vous n'êtes pas autorisé à supprimer cette réservation."
				);
		}
		const deleteQuery = {
			text: 'DELETE FROM reservations WHERE reservation_id = $1 AND users_id = $2',
			values: [reservationId, clientID],
		};

		await client.query(deleteQuery);

		res.status(204).end();
	} catch (error) {
		console.error(
			'Erreur lors de la suppression de la réservation:',
			error
		);
		res.status(500).json(
			'Erreur lors de la suppression de la réservation : ' + error.message
		);
	}
});

module.exports = router;
