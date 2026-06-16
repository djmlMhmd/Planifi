const express = require('express');
const path = require('path');
const {requiredAuth} = require("../middleware/authMiddleware");
const router = express.Router();
const reactIndexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');

function sendReactShell(_req, res) {
	res.sendFile(reactIndexPath);
}

function redirectToReactPath(targetPath) {
	return (req, res) => {
		const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
		res.redirect(`${targetPath}${search}`);
	};
}

router.get('/', sendReactShell);
router.get('/inscription/', sendReactShell);
router.get('/connexion/', sendReactShell);

router.get('/services', requiredAuth, sendReactShell);
router.get('/navigation', requiredAuth, sendReactShell);
router.get('/app/reservation', requiredAuth, sendReactShell);
router.get('/app/calendar', requiredAuth, sendReactShell);
router.get('/app/profil', requiredAuth, sendReactShell);
router.get('/app/profil/professionnel', requiredAuth, sendReactShell);

router.get('/disponibilite/', requiredAuth, redirectToReactPath('/app/calendar'));

router.get('/availability.html', requiredAuth, redirectToReactPath('/app/calendar'));
router.get('/navigation.html', requiredAuth, redirectToReactPath('/navigation'));
router.get('/services.html', requiredAuth, redirectToReactPath('/services'));
router.get('/reservations.html', requiredAuth, redirectToReactPath('/app/reservation'));
router.get('/profil-client.html', requiredAuth, redirectToReactPath('/app/profil'));
router.get('/profil-pro.html', requiredAuth, redirectToReactPath('/app/profil/professionnel'));

router.get('/test', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'test', 'test.html'));
});

module.exports = router;
