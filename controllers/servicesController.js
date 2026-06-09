const {verboseLogger, errorLogger, warnLogger, logLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {decodeJWT} = require("../utils/auth.utils");
const {getClientsCollection} = require("../db/database");
const {sendSuccess, sendFailure, sendInternalServerError, sendBadRequest, sendUnauthorized} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");


module.exports.service_create_post =  async (req, res) => {
    const { service_name, service_description, service_price, duration } =
        req.body;
    verboseLogger(`Données reçues du formulaire :${req.body}`, '','servicesController.js', '/service/create', constants.POST_HTTP);
    const durationText = duration;

    const { id } = decodeJWT(req.cookies.jwt)
    try {
        const client = getClientsCollection();
        await client.query(
            `INSERT INTO services (service_name, service_description, service_price, duration, professional_id)
			VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [
                service_name,
                service_description,
                service_price,
                durationText,
                id,
            ]
        );
        verboseLogger(`Service créé avec succès: nom: ${service_name}, description: ${service_description}, prix ${service_price}, durée: ${duration}`, '','servicesController.js', '/service/create', constants.POST_HTTP);
        return sendSuccess(res, 'Service créer')
    } catch (e) {
        errorLogger(`Erreur lors la création du service : ${ e.stack}`, '','servicesController.js', '/service/create', constants.POST_HTTP);
        return sendFailure(res, 'Erreur lors la création du service :' + e.message)
    }
}

module.exports.service_update_put = async (req, res) => {
    const { serviceId } = req.params;
    const { service_name, service_description, service_price, duration } = req.body;

    if (!isANumber(serviceId)) {
        return sendBadRequest(res, "le 'serviceId' de la requête doit etre un entier");
    }

    const { id } = decodeJWT(req.cookies.jwt);

    try {
        const client = getClientsCollection();
        const serviceOwnerQuery = await client.query(
            'SELECT professional_id FROM services WHERE service_id = $1',
            [serviceId]
        );

        const service = serviceOwnerQuery.rows[0];

        if (!service) {
            return sendBadRequest(res, 'Service non trouvé');
        }

        if (service.professional_id !== id) {
            return sendUnauthorized(res, "Vous n'êtes pas autorisé à modifier ce service");
        }

        const updateResult = await client.query(
            `UPDATE services
             SET service_name = $1,
                 service_description = $2,
                 service_price = $3,
                 duration = $4
             WHERE service_id = $5
             RETURNING *`,
            [service_name, service_description, service_price, duration, serviceId]
        );

        return sendSuccess(res, updateResult.rows[0]);
    } catch (e) {
        errorLogger(`Erreur lors de la modification du service : ${ e.stack}`, '','servicesController.js', `/service/${serviceId}`, constants.PUT_HTTP);
        return sendFailure(res, 'Erreur lors de la modification du service :' + e.message);
    }
}

module.exports.service_all_get =  async (req, res) => {
    try {
        const client = getClientsCollection();
        const services = await client.query(
            `SELECT services.service_id, services.service_name,services.service_description,services.service_price, services.duration,
                    pro.users_id AS professional_id, pro.email, pro.phone, pa.company_name, pa.company_address 
            FROM services 
            INNER JOIN users as pro 
            ON services.professional_id = pro.users_id
            JOIN public.pro_account pa on pro.users_id = pa.user_id;`
        );
        verboseLogger(`Recuperation de l'ensemble des services`, '','servicesController.js', '/service', constants.GET_HTTP);
        return sendSuccess(res, services.rows)
    } catch (e) {
        errorLogger(`Erreur lors la récupération de la liste des services:` + e.stack, '','servicesController.js', '/service', constants.GET_HTTP);
        return sendInternalServerError(res, 'Erreur lors la création de la liste des services :' + e.message)
    }
}

module.exports.service_byId_get = async (req, res) => {
    const {serviceId} = req.params;
    const { id } = decodeJWT(req.cookies.jwt)

    if (!isANumber(serviceId)  ) {
        warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: serviceId:${serviceId}`, '','servicesController.js', `/service/${serviceId}`, constants.GET_HTTP)
        return sendBadRequest(res, "le 'serviceId' de la requête doit etre un entier")
    }

    try {
        const client = getClientsCollection();
        const service = await client.query(
            `SELECT service_name, service_description, service_price, duration
       FROM services
       WHERE service_id = $1`,
            [serviceId]
        );

        if (service.rows.length === 0) {
            warnLogger(`Service non trouvé: ${serviceId}`, '','servicesController.js', `/service/${serviceId}`, constants.GET_HTTP)
            return sendBadRequest(res, 'Service non trouvé' )
        }

        const serviceInfo = service.rows[0];
        res.cookie('selectedServiceID', serviceId, { maxAge: 3600000 });
        logLogger(`Récupération des infos du service: ${serviceId}`, '','servicesController.js', `/service/${serviceId}`, constants.GET_HTTP)
        return sendSuccess(res, serviceInfo)
    } catch (e) {
        errorLogger(`Erreur lors de la récupération des informations du service: ${serviceId}: ${e.stack}`, '','servicesController.js', `/service/${serviceId}`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des informations du service : ' + e.message)
    }
}


module.exports.service_liste_pro_get = async (req, res) => {
    const { professionalId } = req.params;
    const { id } = decodeJWT(req.cookies.jwt)

    if (!isANumber(professionalId)  ) {
        warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: professionalId:${professionalId}`, '','servicesController.js', `/service/${professionalId}/liste`, constants.GET_HTTP)
        return sendBadRequest(res, "le 'professionalId' de la requête doit etre un entier")
    }

    try {
        const client = getClientsCollection();
        verboseLogger(`id pro:${professionalId}`, '','servicesController.js', `/service/${professionalId}/liste`, constants.GET_HTTP)

        const services = await client.query(
            `SELECT services.service_id,
                    services.service_name,
                    services.service_description,
                    services.service_price,
                    services.duration,
                    pro.email,
                    pro.phone,
                    pa.company_name,
                    pa.company_address,
                    COUNT(reservations.reservation_id) AS reservations_a_venir
             FROM services
                      INNER JOIN users as pro
                                 ON services.professional_id = pro.users_id
                      LEFT JOIN reservations
                                 ON services.service_id = reservations.service_id
                                 AND TO_TIMESTAMP(reservations.day_of_week || ' ' || reservations.start_time, 'DD-MM-YYYY HH24:MI:SS') >= CURRENT_TIMESTAMP
                     join public.pro_account pa on pro.users_id = pa.user_id
             WHERE pro.users_id = $1
             group by services.service_id,
                      services.service_name,
                      services.service_description,
                      services.service_price,
                      services.duration,
                      pro.email,
                      pro.phone,
                      pa.company_name,
                      pa.company_address
            `,
            [professionalId]
        );
        verboseLogger(`Récuperation de la liste des servives du pro: ${professionalId}`, '','servicesController.js', `/service/${professionalId}/liste`, constants.GET_HTTP)
        return sendSuccess(res, services.rows)
    } catch (e) {
        errorLogger(`Erreur lors de la récupération des services pro id: ${professionalId} : ` + e.stack, '','servicesController.js', `/service/${professionalId}/liste`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la récupération des services :' + e.message)
    }
}

module.exports.search_service_get =  async (req, res) => {
    try {
        const searchTerm = req.query.q; // q est le paramètre de recherche dans l'URL
        const client = getClientsCollection();

        const services = await client.query(
            `SELECT services.service_id, services.service_name, services.service_description, services.service_price, services.duration,
                    pro.email, pro.phone, pa.company_name, pa.company_address 
            FROM services 
            INNER JOIN users pro
            ON services.professional_id = pro.users_id
            join public.pro_account pa on pro.users_id = pa.user_id
            WHERE LOWER(services.service_name) ILIKE $1`,
            [`%${searchTerm.toLowerCase()}%`]
        );
        verboseLogger(`Récuperation des services ayant un nom ressemblant à : ${searchTerm.toLowerCase()}`, '','servicesController.js', `/search-services`, constants.GET_HTTP)
    } catch (e) {
        verboseLogger(`Erreur lors de la recherche de services :: ${e.stack}`, '','servicesController.js', `/search-services`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la recherche de services : ' + e.message)
    }
}

module.exports.service_delete = async (req, res) => {
    const serviceId = req.params.serviceId;
    try {

        if (!isANumber(serviceId) ) {
            return sendBadRequest(res, "le serviceId doit etre un entier")
        }

        const { id } = decodeJWT(req.cookies.jwt)

        const client = getClientsCollection();

        // Requête pour obtenir le professional_id du service avec l'ID donné
        const serviceQuery = await client.query(
            'SELECT professional_id FROM services WHERE service_id = $1',
            [serviceId]
        );

        const service = serviceQuery.rows[0];

        if (!service) {
            warnLogger(`Service non trouvé: ${JSON.stringify(service)}`, '','servicesController.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
            return sendBadRequest(res, 'Service non trouvé')
        }

        // Vérifiez si le professional_id du service correspond à professionalId de la session
        if (service.professional_id !== id) {
            warnLogger(`Vous n'êtes pas autorisé à supprimer ce service personne voulant supprimer: ${id}, personne pouvant supprimer: ${service.professional_id}`, '','servicesController.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
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
            warnLogger(`L'utilisateur ${id} tente de supprimer le service ${serviceId} alors qu'il y a ${nbReservationsEnCours > 1 ? `${nbReservationsEnCours} réservations encore en cours`: `${nbReservationsEnCours} réservation encore en cours`}`, '','servicesController.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
            return sendFailure(res, `Vous ne pouvez pas supprimer un service ayant des réservations en cours (${nbReservationsEnCours})`)
        }

        // Supprimez le service s'il appartient au professionnel
        await client.query('DELETE FROM services WHERE service_id = $1', [
            serviceId,
        ]);
        logLogger(`Service supprimé avec succès : ${serviceId}` , '','servicesController.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
        return sendSuccess(res, 'Service supprimé avec succès' )
    } catch (e) {
        errorLogger(`Erreur lors de la suppression du service :` + e.stack, '','servicesController.js', `/services/delete/${serviceId}`, constants.DELETE_HTTP)
        return sendInternalServerError(res, 'Erreur lors de la suppression du service :' + e.message)
    }
}
