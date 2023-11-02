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

router.delete('/services/delete/:serviceId', async (req, res) => {
	try {
		const serviceId = req.params.serviceId;
		const professionalId = req.session.professionalID;

		const client = getClientsCollection();

		// Requête pour obtenir le professional_id du service avec l'ID donné
		const serviceQuery = await client.query(
			'SELECT professional_id FROM services WHERE service_id = $1',
			[serviceId]
		);

		const service = serviceQuery.rows[0];

		if (!service) {
			return res.status(404).json({ message: 'Service non trouvé' });
		}

		// Vérifiez si le professional_id du service correspond à professionalId de la session
		if (service.professional_id !== professionalId) {
			return res.status(403).json({
				message: "Vous n'êtes pas autorisé à supprimer ce service",
			});
		}

		// Supprimez le service s'il appartient au professionnel
		await client.query('DELETE FROM services WHERE service_id = $1', [
			serviceId,
		]);

		return res.json({ message: 'Service supprimé avec succès' });
	} catch (e) {
		console.error('Erreur lors de la suppression du service :', e.stack);
		res.status(500).json(
			'Erreur lors de la suppression du service :' + e.message
		);
	}
});

module.exports = router;
