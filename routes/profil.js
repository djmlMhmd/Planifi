const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
router.use(express.json());
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {errorLogger, warnLogger} = require("../config/winston/winston.config");
const {auth} = require("../config/firebase");
const {uploadSingle, uploadMultiple, ERROR_MESSAGES} = require("../middleware/multer");
const UUID  = require("uuid-v4")

// PROFESSIONAL PROFILE

router.get('/profil/professionnel/:id',requiredAuth, async (req, res) => {
	const professionnelId = req.cookies.professionalID;

	const { id } = decodeJWT(req.cookies.jwt)
	if (!id) {
		warnLogger(`Authentification requise`, 'profil.js [GET] /profil/professionnel/:id')
		return res.status(401).json({ message: 'Authentification requise' });
	}
	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM professionals WHERE professional_id = $1',
			values: [id],
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

router.get('/profil/client/:id', requiredAuth, async (req, res) => {
	/**
	 * en principe si on a passé le middleware "requiredAuth"
	 * on est forcément authentifié et donc le cookie "JWT" existe
 	 */
	const { id } = decodeJWT(req.cookies.jwt)

	if (!id) {
        warnLogger(`Authentification requise`, 'profil.js [GET] /profil/professionnel/:id')
		return res.status(401).json({ message: 'Authentification requise' });
	}
	//req.cookies.clientID = clientID;

	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [id],
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


router.put('/profil/:id/upload-service-picture/:serviceId', async (req, res) => {
	/**
	 * doc: https://github.com/expressjs/multer/blob/master/lib/multer-error.js
	 */
	uploadMultiple(req, res, async function (err) {
		if(err){
			switch(err.message) {
				case ERROR_MESSAGES.LIMIT_FILE_SIZE:
					return res.status(406 ).json({message: 'certains fichiers sont trop volumineux'}) // TODO: preciser la taille max des fichiers

				case ERROR_MESSAGES.LIMIT_FILE_COUNT:
					return res.status(406 ).json({message: 'Vous avez upload trop de fichiers en même temps, la limite est de 12'}) //TODO: modifier cette valeur dynamiquement

			}
		}

		let downLoadPath = "https://firebasestorage.googleapis.com/v0/b/planifi-1f28d.appspot.com/o";
		const files = req.files
		let imageUrl = ""
		const dateActuelle = new Date()

		const { id } = decodeJWT(req.cookies.jwt)
		if (!id) {
			return res.status(401).json({ message: 'Authentification requise' });
		}

		if (files.length === 0) {
			return res.status(400).json({ message: 'Aucun fichier upload' });
		}
		try {
			let tableauEchecs = []
			for(let file of files){
				const uuid = UUID();

				// mise en ligne des photos du pro
				let bucket = auth.storage().bucket();
				const metadata = {
					metadata: {
						firebaseStorageDownloadTokens: uuid,
					},
					contentType: file.mimetype,
					cacheControl: "public, max-age=31536000",
				}
				/**
				 * on utilise "dateActuelle.getTime()" dans la construction du nom de l'image
				 * afin que si 2 utilisateurs upload des images ayant le même nom
				 * cela n'écrase pas l'image de l'autre
				 * .getTime() => renvoie le temps actuelle en millisecondes donc est unique
				 */
				imageUrl = `${downLoadPath}/${encodeURIComponent(`images/service-images/${dateActuelle.getTime()} - ${file.originalname}`)}?alt=media&token=${uuid}`

				const blob = bucket.file(`images/service-images/${dateActuelle.getTime()} - ${file.originalname}`)
				const blobStream = blob.createWriteStream({
					metadata: metadata,
					gzip: true
				})

				blobStream.on("error", err => {
					console.log(`erreur lors de l'upload de l'image ${imageUrl} de l'utilisateur ${id}`)
					tableauEchecs.push(imageUrl)
					console.log(err)
				})

				blobStream.on("finish", () => {
					console.log(`upload de l'image ${imageUrl} de l'utilisateur ${id} a bien été effectuée`)
				})

				blobStream.end(file.buffer)

				const client = getClientsCollection();
				// TODO: rajouter la sauvegarde des images dans la nouvelle table
				// const queryUpdateProfilPicture = {
				// 	text: 'UPDATE users SET profile_picture = $1 WHERE users_id = $2',
				// 	values: [imageUrl, userID],
				// };
				//
				// const resultUpdateProfilPicture = await client.query(queryUpdateProfilPicture);

				// if (resultUpdateProfilPicture.rowCount === 0) {
				// 	return res
				// 		.status(404)
				// 		.json({ message: "Erreur lors de la mise à jour de la photo de profil de l'utilisateur"});
				// }
			}
			// const queryGetUser = {
			// 	text: 'SELECT * FROM users WHERE users_id = $1',
			// 	values: [id],
			// };
			//
			// const resultGetUser = await client.query(queryGetUser);
			//
			// if (resultGetUser.rows.length === 0) {
			// 	return res
			// 		.status(404)
			// 		.json({ message: 'Profil client non trouvé' });
			// }
			//
			// const { password, creation_date, ...clientProfile } = resultGetUser.rows[0];
			res.status(201).json();
		} catch (e) {
			console.error(
				'Erreur lors de la récupération du profil:',
				e.stack
			);
			res.status(500).json({ message: 'Erreur serveur' });
		}
	})
})


module.exports = router;
