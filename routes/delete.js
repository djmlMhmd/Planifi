const express = require('express');
const { Router } = require('express');
const { getClientsCollection } = require('../db/database');
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {warnLogger, logLogger, errorLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendUnauthrorized, sendNoContent} = require("../utils/error_message.utils");

const router = Router();
router.use(express.json());

// Côté serveur
router.delete('/supprimer-reservation/:reservationId', requiredAuth, async (req, res) => {
	try {
		const clientID = req.cookies.clientID;
		const reservationId = req.params.reservationId;

		logLogger(`Reservation ID: ${req.params.reservationId}`, 'delete.js [DELETE] /supprimer-reservation/:reservationId')
		// Récupérez le serviceId en interrogeant la base de données à partir de l'ID de réservation.
		const client = getClientsCollection();
		const queryForServiceId = {
			text: 'SELECT service_id FROM reservations WHERE reservation_id = $1',
			values: [reservationId],
		};

		const service = await client.query(queryForServiceId);
		if (service.rowCount === 0) {
			warnLogger(`Réservation introuvable.:${reservationId}`, 'delete.js [DELETE] /supprimer-reservation/:reservationId')
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
			logLogger(`La réservation a été supprimée avec succès:${reservationId}, service id: ${serviceId}, client id:${clientID}`, 'delete.js [DELETE] /supprimer-reservation/:reservationId')
			sendNoContent(res)
		} else {
			errorLogger(`Vous n'êtes pas autorisé à supprimer cette réservation:${reservationId}, service id: ${serviceId}, client id:${clientID}`, 'delete.js [DELETE] /supprimer-reservation/:reservationId')
			sendUnauthrorized(res, "Vous n'êtes pas autorisé à supprimer cette réservation.")
		}
	} catch (error) {
		errorLogger(`Erreur lors de la suppression de la réservation:` + JSON.stringify(error), 'delete.js [DELETE] /supprimer-reservation/:reservationId')
		sendInternalServerError(res, 'Erreur lors de la suppression de la réservation : ' + error.message)
	}
});

router.delete('/services/delete/:serviceId', requiredAuth, async (req, res) => {
	try {
		const serviceId = req.params.serviceId;
		const professionalId = req.cookies.professionalID;

		const { id } = decodeJWT(req.cookies.jwt)

		const client = getClientsCollection();

		// Requête pour obtenir le professional_id du service avec l'ID donné
		const serviceQuery = await client.query(
			'SELECT professional_id FROM services WHERE service_id = $1',
			[serviceId]
		);

		const service = serviceQuery.rows[0];

		if (!service) {
			warnLogger(`Service non trouvé: ${JSON.stringify(service)}`, 'delete.js [DELETE] /services/delete/:serviceId')
			return res.status(404).json({ message: 'Service non trouvé' });
		}

		// Vérifiez si le professional_id du service correspond à professionalId de la session
		if (service.professional_id !== id) {
            warnLogger(`Vous n'êtes pas autorisé à supprimer ce service: personne voulant supprimer: ${professionalId}, personne pouvant supprimer: ${service.professional_id}`, 'delete.js [DELETE] /services/delete/:serviceId')
			sendUnauthrorized(res, "Vous n'êtes pas autorisé à supprimer ce service")
		}

		// Supprimez le service s'il appartient au professionnel
		await client.query('DELETE FROM services WHERE service_id = $1', [
			serviceId,
		]);
		logLogger(`Service supprimé avec succès : ${serviceId}` , 'delete.js [DELETE] /services/delete/:serviceId')
		return res.json({ message: 'Service supprimé avec succès' });
	} catch (e) {
		errorLogger(`Erreur lors de la suppression du service :` + e.stack, 'delete.js [DELETE] /services/delete/:serviceId')
		sendInternalServerError(res, 'Erreur lors de la suppression du service :' + e.message)
	}
});

module.exports = router;
