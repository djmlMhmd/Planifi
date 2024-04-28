const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {verboseLogger, errorLogger, warnLogger, logLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendFailure, sendSuccess, sendBadRequest} = require("../utils/error_message.utils");
const {isANumber} = require("../utils/methods.utils");

router.use(express.json());

// SERVICE CREATE

router.post('/service/create', requiredAuth, async (req, res) => {
	const { service_name, service_description, service_price, duration } =
		req.body;
	verboseLogger(`Données reçues du formulaire :${req.body}`, 'services.js [POST] /service/create');
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
		verboseLogger(`Service créé avec succès: nom: ${service_name}, description: ${service_description}, prix ${service_price}, durée: ${duration}`, 'services.js [POST] /service/create')
		return sendSuccess(res, 'Service créer')
	} catch (e) {
		errorLogger(`Erreur lors la création du service : ${ e.stack}`, 'services.js [POST] /service/create')
		return sendFailure(res, 'Erreur lors la création du service :' + e.message)
	}
});

// SHOW SERVICE

router.get('/service', requiredAuth, async (req, res) => {
	try {
		const client = getClientsCollection();
		const services = await client.query(
			`SELECT services.service_id, services.service_name,services.service_description,services.service_price, services.duration, 
            professionals.email, professionals.phone, professionals.company_name, professionals.company_address 
            FROM services 
            INNER JOIN professionals 
            ON services.professional_id = professionals.professional_id;`
		);
		verboseLogger(`Recuperation de l'ensemble des services`, 'services.js [GET] /service')
		return sendSuccess(res, services.rows)
	} catch (e) {
		errorLogger(`Erreur lors la récupération de la liste des services:` + e.stack, 'services.js [GET] /service')
		return sendInternalServerError(res, 'Erreur lors la création de la liste des services :' + e.message)
	}
});

// route afficher service clients
router.get('/liste-services/:professionalId', requiredAuth, async (req, res) => {
	const { professionalId } = req.params;
	const { id } = decodeJWT(req.cookies.jwt)

	if (!isANumber(professionalId)  ) {
		warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: professionalId:${professionalId}`, 'reservation.js [GET] /liste-services/:professionalId')
		return sendBadRequest(res, "le 'professionalId' de la requête doit etre un entier")
	}

	try {
		const client = getClientsCollection();
		verboseLogger(`id pro:${professionalId}`, 'services.js [GET} /liste-services/:professionalId');

		const services = await client.query(
			`SELECT services.service_id, services.service_name, services.service_description, services.service_price, services.duration, 
            professionals.email, professionals.phone, professionals.company_name, professionals.company_address 
            FROM services 
            INNER JOIN professionals 
            ON services.professional_id = professionals.professional_id
            WHERE professionals.professional_id = $1`,
			[professionalId]
		);
		verboseLogger(`Récuperation de la liste des servives du pro: ${professionalId}`, 'services.js [GET] /liste-services/:professionalId')
		return sendSuccess(res, services.rows)
	} catch (e) {
		errorLogger(`Erreur lors de la récupération des services pro id: ${professionalId} : ` + e.stack, 'services.js [GET] /liste-services/:professionalId')
		return sendInternalServerError(res, 'Erreur lors de la récupération des services :' + e.message)
	}
});

// Route pour obtenir la liste des professionnels avec leurs ID
router.get('/professionals', requiredAuth, async (req, res) => {
	try {
		const client = getClientsCollection();
		const professionals = await client.query(
			'SELECT professional_id, company_name FROM professionals'
		);
		verboseLogger(`Récuperation de la liste des pro`, 'services.js [GET] /professionals')
		return sendSuccess(res, professionals.rows);
	} catch (e) {
		errorLogger(`Erreur lors de la récupération des professionnels: ${e.stack}`, 'services.js [GET] /professionals')
		return sendInternalServerError(res, 'Erreur lors de la récupération des professionnels :' + e.message)
	}
});

//récupérer les infos du services en fonction de l'ID du service

router.get('/reservation/:serviceId', requiredAuth, async (req, res) => {
	const {serviceId} = req.params;
	const { id } = decodeJWT(req.cookies.jwt)

	if (!isANumber(serviceId)  ) {
		warnLogger(`L'utilisateur ${id} a appelé la route avec les paramètres de requete suivants: serviceId:${serviceId}`, 'reservation.js [GET] /reservation/:serviceId')
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
			warnLogger(`Service non trouvé: ${serviceId}`, 'services.js [GET] /reservation/:serviceId')
			return sendBadRequest(res, 'Service non trouvé' )
		}

		const serviceInfo = service.rows[0];
		res.cookie('selectedServiceID', serviceId, { maxAge: 3600000 });
		logLogger(`Récupération des infos du service: ${serviceId}`, 'services.js [GET] /reservation/:serviceId')
		return sendSuccess(res, serviceInfo)
	} catch (e) {
		errorLogger(`Erreur lors de la récupération des informations du service: ${serviceId}: ${e.stack}`, 'services.js [GET] /reservation/:serviceId')
		return sendInternalServerError(res, 'Erreur lors de la récupération des informations du service : ' + e.message)
	}
});

router.get('/search-services', requiredAuth, async (req, res) => {
	try {
		const searchTerm = req.query.q; // q est le paramètre de recherche dans l'URL
		const client = getClientsCollection();

		const services = await client.query(
			`SELECT services.service_id, services.service_name, services.service_description, services.service_price, services.duration, 
            professionals.email, professionals.phone, professionals.company_name, professionals.company_address 
            FROM services 
            INNER JOIN professionals 
            ON services.professional_id = professionals.professional_id
            WHERE LOWER(services.service_name) ILIKE $1`,
			[`%${searchTerm.toLowerCase()}%`]
		);
		verboseLogger(`Récuperation des services ayant un nom ressemblant à : ${searchTerm.toLowerCase()}`, 'services.js [GET] /search-services')
		return sendSuccess(res, services.rows)
	} catch (e) {
		verboseLogger(`Erreur lors de la recherche de services :: ${e.stack}`, 'services.js [GET] /search-services')
		return sendInternalServerError(res, 'Erreur lors de la recherche de services : ' + e.message)
	}
});

module.exports = router;
