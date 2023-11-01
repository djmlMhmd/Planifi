const express = require('express');
const { Router } = require('express');
const router = Router();
const userValidation = require('../validation/validation');
const { getClientsCollection } = require('../db/database');

router.use(express.json());

// SERVICE CREATE

router.post('/service/create', async (req, res) => {
	const { service_name, service_description, service_price, duration } =
		req.body;
	console.log('Données reçues du formulaire :', req.body);
	const durationText = duration;
	const professional_id = req.session.professionalID;

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
		return res.status(200).json({ message: 'Service créer' });
	} catch (e) {
		console.error('Erreur lors la création du service :', e.stack);
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
		return res.json(services.rows);
	} catch (e) {
		console.error(
			'Erreur lors la récupération de la liste des services:',
			e.stack
		);
		res.status(500).json(
			'Erreur lors la création de la liste des services :' + e.message
		);
	}
});

// Nouvelle route pour afficher les services d'une entreprise spécifique
router.get('/services/:professionalId', async (req, res) => {
	try {
		const client = getClientsCollection();
		const professionalId = req.params.professionalId;
		console.log('ID du professionnel:', professionalId);
		const services = await client.query(
			`SELECT services.service_id, services.service_name, services.service_description, services.service_price, services.duration, 
            professionals.email, professionals.phone, professionals.company_name, professionals.company_address 
            FROM services 
            INNER JOIN professionals 
            ON services.professional_id = professionals.professional_id
            WHERE professionals.professional_id = $1`,
			[professionalId]
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
		return res.json(professionals.rows);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération des professionnels :',
			e.stack
		);
		res.status(500).json(
			'Erreur lors de la récupération des professionnels :' + e.message
		);
	}
});

module.exports = router;
