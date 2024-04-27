const express = require('express');
const { Router } = require('express');
const { errorLogger} = require("../config/winston/winston.config");
const {sendInternalServerError, sendSuccess} = require("../utils/error_message.utils");
const router = Router();

router.use(express.json());

router.post('/deconnexion/client', (req, res) => {
	res.cookie('clientID', '')
	res.cookie('professionalID', '')
	// delete the client session to disconnect the client
	req.session.destroy((err) => {
		if (err) {
			errorLogger(`Erreur lors de la déconnexion`, 'disconnect.js [POST] /deconnexion/client')
			return sendInternalServerError(res, 'Erreur serveur lors de la déconnexion')
		}
		sendSuccess(res, 'Déconnexion réussie' )
	});
});

module.exports = router;
