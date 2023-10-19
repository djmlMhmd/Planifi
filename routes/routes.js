const express = require('express');
const { Router } = require('express');
const router = Router();
const User = require('../model/model');
const userValidation = require('../validation/validation');

const { getClientsCollection } = require('../db/database');
const { Collection } = require('mongoose');
const { object } = require('joi');

router.use(express.json());

router.post('/inscription', (req, res) => {
	// recover data
	const { body } = req;
	// validate the data
	const { error } = userValidation(body);
	if (error) {
		return res.status(400).json(error.details[0].message);
	}
	console.log(body);
	insertDocument(body);
	res.json(body);
});

function insertDocument(doc) {
	let collectionClient = getClientsCollection();

	collectionClient.findOne(doc, (err, client) => {
		if (err) throw err;
		console.log(client);
		if (!client) {
			collectionClient.insertOne(doc, function (err, res) {
				if (err) throw err;
				console.log('1 document inserted');
			});
		}

		// console.log(client);
	});
	// collectionClient.findOneAndUpdate();
}

router.get('/connexion', (req, res) => {
	res.send('connexion');
});

module.exports = router;
