const express = require('express');
const { Router } = require('express');
const { getClientsCollection } = require('../db/database');
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {warnLogger, logLogger, errorLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendUnauthorized, sendSuccessWithNoContent, sendBadRequest, sendSuccess, sendFailure} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");
const {sendRendezVousAnnuleClient, sendRendezVousAnnulePro} = require("../mail/send-email");
const {constants} = require("../constants/constants");

const router = Router();
router.use(express.json());

// Côté serveur
// SUPPRIMER RÉSERVATION
router.delete('/supprimer-reservation/:reservationId', requiredAuth, async (req, res) => {
	const {reservationId} = req.params;
	try {

		if (!isANumber(reservationId) ) {
			return sendBadRequest(res, "le reservationId doit etre un entier")
		}
		const { id } = decodeJWT(req.cookies.jwt)

		logLogger(`Reservation ID: ${reservationId}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
		// Récupérez le serviceId en interrogeant la base de données à partir de l'ID de réservation.
		const client = getClientsCollection();
		const queryForServiceId = `
			SELECT service_id, users_id, professional_id, day_of_week, start_time FROM reservations 
			WHERE reservation_id = $1;
		`;

		const service = await client.query(queryForServiceId, [reservationId]);
		if (service.rowCount === 0) {
			warnLogger(`Réservation introuvable.:${reservationId}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
			return sendSuccessWithNoContent(res, 'Réservation introuvable.')
		}

		const { service_id: serviceId, users_id: userId, professional_id: proId, day_of_week, start_time } = service.rows[0];
		if (userId !== id) {
            errorLogger(`Vous n'êtes pas autorisé à supprimer cette réservation:${reservationId}, service id: ${serviceId}, client id:${id}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
            return sendUnauthorized(res, "Vous n'êtes pas autorisé à supprimer cette réservation.")
		}

		const clientResultQuery = await client.query('select * from users where users_id = $1', [userId])
		const proResultQuery = await client.query('select * from professionals where professional_id = $1', [proId])
		const serviceResultQuery = await client.query('select * from services where service_id = $1', [serviceId])

		// Continuer avec la suppression si le serviceId correspond
		const queryForDelete = `DELETE FROM reservations 
			WHERE reservation_id = $1 AND service_id = $2 AND users_id = $3;
		`;

		const result = await client.query(queryForDelete, [
			reservationId,
			serviceId,
            id,
		]);

		if (result.rowCount === 1) {
			logLogger(`La réservation a été supprimée avec succès:${reservationId}, service id: ${serviceId}, client id:${id}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)

			//TODO : recuperer les mails du pro et du client
			try{
				if(clientResultQuery.rowCount > 0 && proResultQuery.rowCount > 0 && serviceResultQuery.rowCount > 0) {
					const emailClient = clientResultQuery.rows[0].email
					const prenom_client = clientResultQuery.rows[0].firstName
					const nom_client = clientResultQuery.rows[0].lastName

					const emailPro = proResultQuery.rows[0].email
					const prenom_pro = proResultQuery.rows[0].firstName
					const nom_pro = proResultQuery.rows[0].lastName

					const nom_service = serviceResultQuery.rows[0].service_name

					const rdvInfosClient = {
						nom_pro: `${nom_pro.toUpperCase()} ${prenom_pro}`,
						service_nom: nom_service,
						date: day_of_week,
						heure: start_time,
					}

					const rdvInfosPro = {
						nom_client: `${nom_client.toUpperCase()} ${prenom_client}`,
						service_nom: nom_service,
						date: day_of_week,
						heure: start_time,
					}
					sendSuccessWithNoContent(res)
					await sendRendezVousAnnuleClient(emailClient, prenom_client, rdvInfosClient)
					await sendRendezVousAnnulePro(emailPro, prenom_pro, rdvInfosPro)
				}
			}
			catch (e) {
				errorLogger(`Erreur lors de la reservation avec les infos: pro: ${proId}, heure début: ${start_time}, service id: ${serviceId}, jour de la semaine: ${day_of_week}, user: ${userId}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
				return sendFailure(res, 'Erreur lors de la suppresion de la reservation' )
			}
			return
		}

		errorLogger(`Vous n'êtes pas autorisé à supprimer cette réservation:${reservationId}, service id: ${serviceId}, client id:${id}`, '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
		return sendUnauthorized(res, "Vous n'êtes pas autorisé à supprimer cette réservation.")
	} catch (error) {
		errorLogger(`Erreur lors de la suppression de la réservation:` + JSON.stringify(error), '','delete.js',  `/supprimer-reservation/${reservationId}`, constants.DELETE_HTTP)
		return sendInternalServerError(res, 'Erreur lors de la suppression de la réservation : ' + error.message)
	}
});

// SUPPRIMER SERVICE
router.delete('/services/delete/:serviceId', requiredAuth, async (req, res) => {
	const serviceId = req.params.serviceId;
	try {

		if (!isANumber(serviceId) ) {
			return sendBadRequest(res, "le serviceId doit etre un entier")
		}

		const { id, statut } = decodeJWT(req.cookies.jwt)

		const client = getClientsCollection();

		// Requête pour obtenir le professional_id du service avec l'ID donné
		const serviceQuery = await client.query(
			'SELECT professional_id FROM services WHERE service_id = $1',
			[serviceId]
		);

		const service = serviceQuery.rows[0];

		if (!service) {
			warnLogger(`Service non trouvé: ${JSON.stringify(service)}`, '','delete.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
			return sendBadRequest(res, 'Service non trouvé')
		}

		// Vérifiez si le professional_id du service correspond à professionalId de la session
		if (service.professional_id !== id && statut !== constants.STATUT_PROFESSIONNEL) {
            warnLogger(`Vous n'êtes pas autorisé à supprimer ce service personne voulant supprimer: ${id} (${statut}), personne pouvant supprimer: ${service.professional_id}`, '','delete.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
			return sendUnauthorized(res, "Vous n'êtes pas autorisé à supprimer ce service")
		}

		// Requête pour le nombre de réservations en cours sur le service
		const reservationQuery = await client.query(
			'SELECT count(*) FROM reservations WHERE service_id = $1',
			[serviceId]
		);
		const nbReservationsEnCours = reservationQuery.rows[0].count
		// s'il y a des réservations en cours sur ce service, on renvoie une Failure en disant qu'il y a des réservations encore en cours dessus
		if( nbReservationsEnCours > 0 ){
			warnLogger(`L'utilisateur ${id} (${statut}) tente de supprimer le service ${serviceId} alors qu'il y a ${nbReservationsEnCours > 1 ? `${nbReservationsEnCours} réservations encore en cours`: `${nbReservationsEnCours} réservation encore en cours`}`, '','delete.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
			return sendFailure(res, `Vous ne pouvez pas supprimer un service ayant des réservations en cours (${nbReservationsEnCours})`)
		}

		// Supprimez le service s'il appartient au professionnel
		await client.query('DELETE FROM services WHERE service_id = $1', [
			serviceId,
		]);
		logLogger(`Service supprimé avec succès : ${serviceId}` , '','delete.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
		return sendSuccess(res, 'Service supprimé avec succès' )
	} catch (e) {
		errorLogger(`Erreur lors de la suppression du service :` + e.stack, '','delete.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
		return sendInternalServerError(res, 'Erreur lors de la suppression du service :' + e.message)
	}
});

module.exports = router;
