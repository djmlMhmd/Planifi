const express = require('express');
const { Router } = require('express');
const {warnLogger, errorLogger} = require("../config/winston/winston.config");
const router = Router();

router.use(express.json());

router.post('/deconnexion/client', (req, res) => {
	res.cookie('clientID', '')
	res.cookie('professionalID', '')
	// delete the client session to disconnect the client
	req.session.destroy((err) => {
		if (err) {
			errorLogger(`Erreur lors de la déconnexion`, 'disconnect.js [POST] /deconnexion/client')
			console.error('Erreur lors de la déconnexion :', err);
			return res
				.status(500)
				.json({ message: 'Erreur serveur lors de la déconnexion' });
		}
		res.status(200).json({ message: 'Déconnexion réussie' });
	});
});

module.exports = router;
