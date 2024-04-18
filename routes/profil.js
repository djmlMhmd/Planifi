const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
router.use(express.json());
const {auth} = require("../config/firebase");
const {uploadSingle} = require("../middleware/multer");
const UUID  = require("uuid-v4")


// PROFESSIONAL PROFILE

router.get('/profil/professionnel/:id', async (req, res) => {
	const professionnelId = req.session.professionalID;

	if (!professionnelId) {
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
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

// CLIENT PROFILE

router.get('/profil/client/:id', async (req, res) => {
	// Retrieves the client ID from the session or cookie
	const clientID = req.session.clientID;

	if (!clientID) {
		return res.status(401).json({ message: 'Authentification requise' });
	}
	req.session.clientID = clientID;

	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [clientID],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
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
		res.status(500).json({ message: 'Erreur serveur' });
	}
});

router.put('/profil/:id/update-profil-picture', uploadSingle, async (req, res) => {
	// Retrieves the client ID from the session or cookie
	const clientID = req.session.clientID;
	const file = req.file
	const uuid = UUID();
	let downLoadPath = "https://firebasestorage.googleapis.com/v0/b/planifi-1f28d.appspot.com/o/";
	let imageUrl = ""
	if (!clientID) {
		return res.status(401).json({ message: 'Authentification requise' });
	}
	if (!file) {
		return res.status(400).json({ message: 'Aucun fichier upload' });
	}
	req.session.clientID = clientID;

	try {
		//TODO: rajouter un chemin spécifique pour la sauvegarde dans firebase
		// mise en ligne de la photo de profil de l'utilisateur
		let bucket = auth.storage().bucket();
		const metadata = {
			metadata: {
				firebaseStorageDownloadTokens: uuid,
			},
			contentType: req.file.mimetype,
			cacheControl: "public, max-age=31536000",
		}

		const blob = bucket.file(`images/profile-picture/${file.originalname}`)
		const blobStream = blob.createWriteStream({
			metadata: metadata,
			gzip: true
		})

		blobStream.on("error", err => {
			console.log(err)
			return res.status(500).json({ error: "Impossible d'upload la photo"})
			//return
		})

		blobStream.on("finish", () => {
			//const imageUrl = `https://storage/googleapis.com/${bucket.name}/${blob.name}`
			imageUrl = downLoadPath +
				encodeURIComponent(file.originalname) +
				"?alt=media&token=" +
				uuid;
			return res.status(201).json({imageUrl})

		})
		blobStream.end(req.file.buffer)

		console.log(imageUrl)

		// ajouter la sauvegarde dans la base de données pour l'utilisateur concerné
		return
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [clientID],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ message: 'Profil non trouvé' });
		}

		const { password, creation_date, ...clientProfile } = result.rows[0];
		res.json(clientProfile);
	} catch (e) {
		console.error(
			'Erreur lors de la récupération du profil:',
			e.stack
		);
		res.status(500).json({ message: 'Erreur serveur' });
	}
})

module.exports = router;
