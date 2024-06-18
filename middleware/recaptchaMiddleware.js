const fetch = require('node-fetch');

const verifyRecaptcha = (req, res, next) => {
	const token = req.body['g-recaptcha-response'];
	const secretKey = '6LeYmvspAAAAAGZYw_zEo9cZXMLHmKHFBpCCpo6T';
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

	fetch(url, { method: 'POST' })
		.then((response) => response.json())
		.then((google_response) => {
			if (google_response.success) {
				console.log('CAPTCHA vérifié avec succès!');
				next(); // Passe au middleware suivant ou à la fonction de route si le CAPTCHA est réussi
			} else {
				res.status(400).send('Échec de la vérification CAPTCHA!');
			}
		})
		.catch((error) => {
			console.error('Erreur dans la vérification CAPTCHA!', error);
			res.status(500).send(
				'Erreur serveur lors de la vérification CAPTCHA.'
			);
		});
};

module.exports = { verifyRecaptcha };
