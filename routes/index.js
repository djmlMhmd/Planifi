const express = require('express');
const path = require('path');
const router = express.Router();

// Définissez la route pour la page "À propos"
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});
router.get('/services', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'services.html'));
});

router.get('/disponibilite/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'availability.html'));
});

router.get('/inscription/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

router.get('/connexion/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/profil/:id', (req, res) => {
	// Checks whether it is a customer or a connected professional
	if (req.cookies.clientID) {
		'..',
			// If it's a customer, return the customer profile
			res.sendFile(
				path.join(__dirname, '..', 'views', 'profil-client.html')
			);
	} else if (req.cookies.professionalID) {
		// If it's a professional, return the professional's profile
		res.sendFile(path.join(__dirname, '..', 'views', 'profil-pro.html'));
	} else {
		// If no one is logged in, return an error message or redirect to the login page
		res.status(401).send('Authentification requise');
	}
});

router.get('/reservation', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'reservations.html'));
});

router.get('/navigation', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'navigation.html'));
});
router.get('/test', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'test', 'test.html'));
});

module.exports = router;
