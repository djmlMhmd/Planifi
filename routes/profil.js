const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
router.use(express.json());
const path = require('path');
const {errorLogger, warnLogger} = require("../config/winston/winston.config");
const {auth} = require("../config/firebase");
const {uploadSingle} = require("../middleware/multer");
const UUID  = require("uuid-v4")


// PROFESSIONAL PROFILE

router.get('/profil/professionnel/:id', async (req, res) => {
	const professionnelId = req.cookies.professionalID;

	if (!professionnelId) {
		warnLogger(`Authentification requise`, 'profil.js [GET] /profil/professionnel/:id')
		return res.status(401).json({ message: 'Authentification requise' });
	}
	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM professionals WHERE professional_id = $1',
			values: [professionnelId],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			warnLogger(`Profil professionnel non trouvé ${professionnelId}`, 'profil.js [GET] /profil/professionnel/:id')
			return res
				.status(404)
				.json({ message: 'Profil professionnel non trouvé' });
		}

		//const professionnel = result.rows[0];
		const { password, creation_date, ...professionalProfile } =
			result.rows[0];
		res.json(professionalProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil professionnel:',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération du profil professionnel: ${JSON.stringify(e.stack)}`, 'profil.js [GET] /profil/professionnel/:id')
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

// CLIENT PROFILE

router.get('/profil/client/:id', async (req, res) => {
	// Retrieves the client ID from the session or cookie
	const clientID = req.cookies.clientID;

	if (!clientID) {
		warnLogger(`Authentification requise`, 'profil.js [GET] /profil/professionnel/:id')
		return res.status(401).json({ message: 'Authentification requise' });
	}
	//req.cookies.clientID = clientID;

	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [clientID],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			warnLogger(`Profil professionnel non trouvé ${professionnelId}`, 'profil.js [GET] /profil/professionnel/:id')
			return res
				.status(404)
				.json({ message: 'Profil client non trouvé' });
		}

		const { password, creation_date, ...clientProfile } = result.rows[0];
		res.json(clientProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil client:',
			e.stack
		);
		errorLogger(`Erreur lors de la récupération du profil client: ${JSON.stringify(e.stack)}`, 'profil.js [GET] /profil/professionnel/:id')
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

router.put('/profil/:id/update-profil-picture', uploadSingle, async (req, res) => {
	// Retrieves the client ID from the session or cookie
	const userID = req.cookies.clientID;
	const file = req.file
	const uuid = UUID();
	let downLoadPath = "https://firebasestorage.googleapis.com/v0/b/planifi-1f28d.appspot.com/o";
	let imageUrl = ""
	const dateActuelle = new Date()
	if (!userID) {
		return res.status(401).json({ message: 'Authentification requise' });
	}
	if (!file) {
		return res.status(400).json({ message: 'Aucun fichier upload' });
	}
	//req.session.clientID = userID;

	try {
		// mise en ligne de la photo de profil de l'utilisateur
		let bucket = auth.storage().bucket();
		const metadata = {
			metadata: {
				firebaseStorageDownloadTokens: uuid,
			},
			contentType: req.file.mimetype,
			cacheControl: "public, max-age=31536000",
		}
		/**
		 * on utilise "dateActuelle.getTime()" dans la construction du nom de l'image
		 * afin que si 2 utilisateurs upload des images ayant le même nom
		 * cela n'écrase pas l'image de l'autre
		 * .getTime() => renvoie le temps actuelle en millisecondes donc est unique
		 */
		imageUrl = `${downLoadPath}/${encodeURIComponent(`images/profile-picture/${dateActuelle.getTime()} - ${file.originalname}`)}?alt=media&token=${uuid}`

		const blob = bucket.file(`images/profile-picture/${dateActuelle.getTime()} - ${file.originalname}`)
		const blobStream = blob.createWriteStream({
			metadata: metadata,
			gzip: true
		})

		blobStream.on("error", err => {
			console.log(`erreur lors de l'upload de l'image ${imageUrl} de l'utilisateur ${userID}`)
			console.log(err)
		})

		blobStream.on("finish", () => {
			console.log(`upload de l'image ${imageUrl} de l'utilisateur ${userID} a bien été effectuée`)
		})

		blobStream.end(req.file.buffer)

		const client = getClientsCollection();
		const queryUpdateProfilPicture = {
			text: 'UPDATE users SET profile_picture = $1 WHERE users_id = $2',
			values: [imageUrl, userID],
		};

		const resultUpdateProfilPicture = await client.query(queryUpdateProfilPicture);

		if (resultUpdateProfilPicture.rowCount === 0) {
			return res
				.status(404)
				.json({ message: "Erreur lors de la mise à jour de la photo de profil de l'utilisateur"});
		}

		const queryGetUser = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [userID],
		};

		const resultGetUser = await client.query(queryGetUser);

		if (resultGetUser.rows.length === 0) {
			return res
				.status(404)
				.json({ message: 'Profil client non trouvé' });
		}

		const { password, creation_date, ...clientProfile } = resultGetUser.rows[0];
		 res.status(201).json(clientProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil:',
			e.stack
		);
		res.status(500).json({ message: 'Erreur serveur' });
	}
})

module.exports = router;
