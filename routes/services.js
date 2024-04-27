const express = require('express');
const { Router } = require('express');
const router = Router();
const userValidation = require('../validation/validation');
const { getClientsCollection } = require('../db/database');
const {verboseLogger, errorLogger, warnLogger, logLogger} = require("../config/winston/winston.config");

router.use(express.json());

// SERVICE CREATE

router.post('/service/create', async (req, res) => {
	const { service_name, service_description, service_price, duration } =
		req.body;
	console.log('Données reçues du formulaire :', req.body);
	const durationText = duration;
	const professional_id = req.cookies.professionalID;
	//console.log('id pro:', professional_id);
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
				professional_id,
			]
		);
		console.log('Service créé avec succès.');
		verboseLogger(`Service créé avec succès: nom: ${service_name}, description: ${service_description}, prix ${service_price}, durée: ${duration}`, 'services.js [POST] /service/create')
		return res.status(200).json({ message: 'Service créer' });
	} catch (e) {
		console.error('Erreur lors la création du service :', e.stack);
		errorLogger(`Erreur lors la création du service : ${ e.stack}`, 'services.js [POST] /service/create')
		res.status(500).json(
			'Erreur lors la création du service :' + e.message
		);
	}
});

// SHOW SERVICE

router.get('/service', async (req, res) => {
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
		return res.json(services.rows);
	} catch (e) {
		console.error(
			'Erreur lors la récupération de la liste des services:',
			e.stack
		);
		errorLogger(`Erreur lors la récupération de la liste des services:` + e.stack, 'services.js [GET] /service')
		res.status(500).json(
			'Erreur lors la création de la liste des services :' + e.message
		);
	}
});

// route afficher service clients
router.get('/liste-services/:professionalId', async (req, res) => {
	try {
		const client = getClientsCollection();
		const professionalId = req.params.professionalId;
		console.log('id pro:', professionalId);

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
		return res.json(services.rows);
	} catch (e) {
		console.error('Erreur lors de la récupération des services :', e.stack);
		errorLogger(`Erreur lors de la récupération des services pro id: ${professionalId} : ` + e.stack, 'services.js [GET] /liste-services/:professionalId')
		res.status(500).json(
			'Erreur lors de la récupération des services :' + e.message
		);
	}
});

// Nouvelle route pour afficher les services d'une entreprise spécifique
router.get('/services/:professionalId', async (req, res) => {
	try {
		const client = getClientsCollection();
		const professionalID = req.cookies.professionalID;
		console.log('id pro:', professionalID);

		const services = await client.query(
			`SELECT services.service_id, services.service_name, services.service_description, services.service_price, services.duration, 
            professionals.email, professionals.phone, professionals.company_name, professionals.company_address 
            FROM services 
            INNER JOIN professionals 
            ON services.professional_id = professionals.professional_id
            WHERE professionals.professional_id = $1`,
			[professionalID]
		);

		return res.json(services.rows);
	} catch (e) {
		console.error('Erreur lors de la récupération des services :', e.stack);
		res.status(500).json(
			'Erreur lors de la récupération des services :' + e.message
		);
	}
});

// Route pour obtenir la liste des professionnels avec leurs ID
router.get('/professionals', async (req, res) => {
	try {
		const client = getClientsCollection();
		const professionals = await client.query(
			'SELECT professional_id, company_name FROM professionals'
		);
		verboseLogger(`Récuperation de la liste des pro`, 'services.js [GET] /professionals')
		return res.json(professionals.rows);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des professionnels :',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération des professionnels: ${e.stack}`, 'services.js [GET] /professionals')
		res.status(500).json(
			'Erreur lors de la récupération des professionnels :' + e.message
		);
	}
});

//récupérer les infos du services en fonction de l'ID du service

router.get('/reservation/:serviceId', async (req, res) => {
	try {
		const client = getClientsCollection();
		const serviceId = req.params.serviceId;

		const service = await client.query(
			`SELECT service_name, service_description, service_price, duration
       FROM services
       WHERE service_id = $1`,
			[serviceId]
		);

		if (service.rows.length === 0) {
			warnLogger(`Service non trouvé: ${serviceId}`, 'services.js [GET] /reservation/:serviceId')
			return res.status(404).json({ message: 'Service non trouvé' });
		}

		const serviceInfo = service.rows[0];
		res.cookie('selectedServiceID', serviceId, { maxAge: 3600000 });
		logLogger(`Récupération des infos du service: ${serviceId}`, 'services.js [GET] /reservation/:serviceId')
		res.json(serviceInfo);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des informations du service :',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération des informations du service: ${serviceId}: ${e.stack}`, 'services.js [GET] /reservation/:serviceId')
		res.status(500).json(
			'Erreur lors de la récupération des informations du service : ' +
				e.message
		);
	}
});

router.get('/search-services', async (req, res) => {
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
		return res.json(services.rows);
	} catch (e) {
		console.error('Erreur lors de la recherche de services :', e.stack);
		verboseLogger(`Erreur lors de la recherche de services :: ${e.stack}`, 'services.js [GET] /search-services')
		res.status(500).json(
			'Erreur lors de la recherche de services : ' + e.message
		);
	}
});

module.exports = router;
