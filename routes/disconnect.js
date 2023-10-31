const session = require('express-session');
const express = require('express');
const { Router } = require('express');
const router = Router();

router.use(express.json());

router.post('/deconnexion/client', (req, res) => {
	// delete the client session to disconnect the client
	req.session.destroy((err) => {
		if (err) {
			console.error('Erreur lors de la déconnexion :', err);
			return res
				.status(500)
				.json({ message: 'Erreur serveur lors de la déconnexion' });
		}
		res.status(200).json({ message: 'Déconnexion réussie' });
	});
});

module.exports = router;
