const express = require('express');
const { Router } = require('express');
const router = Router();
const userValidation = require('../validation/validation');
const { getClientsCollection } = require('../db/database');

router.use(express.json());

// SERVICE CREATE

router.post('/service/create', async (req, res) => {
	const {
		service_name,
		service_description,
		service_price,
		duration,
		professional_id,
	} = req.body;

	const durationText = duration;

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

		return res.status(201).json({ message: 'Service créer' });
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

module.exports = router;
