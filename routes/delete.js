const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const { getClientsCollection } = require('../db/database');

const router = Router();
router.use(express.json());

// Côté serveur
router.delete('/supprimer-reservation/:reservationId', async (req, res) => {
	try {
		const clientID = req.session.clientID;
		const reservationId = req.params.reservationId;

		console.log('Client ID:', req.session.clientID);
		console.log('Reservation ID:', req.params.reservationId);

		// Récupérez le serviceId en interrogeant la base de données à partir de l'ID de réservation.
		const client = getClientsCollection();
		const queryForServiceId = {
			text: 'SELECT service_id FROM reservations WHERE reservation_id = $1',
			values: [reservationId],
		};

		const service = await client.query(queryForServiceId);
		if (service.rowCount === 0) {
			return res.status(404).json('Réservation introuvable.');
		}
		const serviceId = service.rows[0].service_id;

		// Continuez avec la suppression si le serviceId correspond
		const queryForDelete = {
			text: 'DELETE FROM reservations WHERE reservation_id = $1 AND service_id = $2 AND users_id = $3',
			values: [reservationId, serviceId, clientID],
		};

		const result = await client.query(queryForDelete);

		if (result.rowCount === 1) {
			res.status(204).end(); // La réservation a été supprimée avec succès
		} else {
			res.status(403).json(
				"Vous n'êtes pas autorisé à supprimer cette réservation."
			);
		}
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
