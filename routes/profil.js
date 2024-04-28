const express = require('express');
const { Router } = require('express');
const router = Router();
const { getClientsCollection } = require('../db/database');
router.use(express.json());
const {requiredAuth} = require("../middleware/authMiddleware");
const {decodeJWT} = require("../utils/auth.utils");
const {errorLogger, warnLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {auth} = require("../config/firebase");
const {uploadSingle, uploadMultiple, ERROR_MESSAGES} = require("../middleware/multer");
const UUID  = require("uuid-v4")
const {sendInternalServerError, sendError, sendBadRequest, sendSuccessfullyCreated, sendUnauthrorized, sendSuccess,
	sendFailure, sendSuccessWithNoContent
} = require("../utils/error_message.utils");
const bcrypt = require("bcrypt");
const {checkIsNumber, convertToNumber, isUndefinedOrEmpty} = require("../utils/methods.utils");
const {constants} = require("../constants/constants");
const format = require("pg-format");
const saltRounds = 10;

// PROFESSIONAL PROFILE

router.get('/profil/professionnel/:id',requiredAuth, async (req, res) => {

	const { id } = decodeJWT(req.cookies.jwt)
	if (!id) {
		warnLogger(`Authentification requise`, 'profil.js [GET] /profil/professionnel/:id')
		return sendError(res, 'Authentification requise')
	}
	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM professionals WHERE professional_id = $1',
			values: [id],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			warnLogger(`Profil professionnel non trouvé ${id}`, 'profil.js [GET] /profil/professionnel/:id')
			return sendError(res, 'Profil professionnel non trouvé')
		}

		const { password, creation_date, ...professionalProfile } =
			result.rows[0];
		sendSuccess(res, professionalProfile)
	} catch (e) {
		errorLogger(`Erreur lors de la récupération du profil professionnel: ${JSON.stringify(e.stack)}`, 'profil.js [GET] /profil/professionnel/:id')
		sendInternalServerError(res, 'Erreur serveur' )
	}
});

// CLIENT PROFILE

router.get('/profil/client/:id', requiredAuth, async (req, res) => {
	/**
	 * en principe si on a passé le middleware "requiredAuth"
	 * on est forcément authentifié et donc le cookie "JWT" existe
 	 */
	let idReq  = req.params['id'];
	let { id } = decodeJWT(req.cookies.jwt)

	if (!checkIsNumber(idReq)) {
		return sendBadRequest(res, "l'id doit etre un entier")
	}

	if(convertToNumber(idReq) !== id) {
		return sendUnauthrorized(res, 'Permission non autorisé')
	}

	if (!id) {
        warnLogger(`Authentification requise`, 'profil.js [GET] /profil/client/:id' )
		return sendError(res, 'Authentification requise')
	}

	try {
		const client = getClientsCollection();
		const query = {
			text: 'SELECT * FROM users WHERE users_id = $1',
			values: [id],
		};

		const result = await client.query(query);

		if (result.rows.length === 0) {
			warnLogger(`Profil client non trouvé ${id}`, 'profil.js [GET] /profil/client/:id')
			return sendError(res, 'Profil client non trouvé' )
		}

		const { password, creation_date, ...clientProfile } = result.rows[0];
		res.json(clientProfile);
	} catch (e) {
		errorLogger(`Erreur lors de la récupération du profil client: ${JSON.stringify(e.stack)}`, 'profil.js [GET] /profil/client/:id')
		sendInternalServerError(res, 'Erreur serveur' )
	}
});

router.put('/profil/:id/change-password', requiredAuth, async (req, res) => {
	let idReq  = req.params['id'];
	let { id, statut } = decodeJWT(req.cookies.jwt)

	if (!checkIsNumber(idReq)) {
		warnLogger(`L'utilisateur ${id} a appelé la route avec le paramètre de requete suivant: ${idReq}`, 'profil.js [PUT] /profil/:id/change-password')
		return sendBadRequest(res, "l'id doit etre un entier")
	}

	if(convertToNumber(idReq) !== id) {
		warnLogger(`L'utilisateur ${id} a tenté de modifier le mot de passe de l'utilisateur ${idReq}`, 'profil.js [PUT] /profil/:id/change-password')
		return sendUnauthrorized(res, 'Permission non autorisé')
	}
	/**
	 * le front se chargera de vérifier que l'ancien mot de passe et le nouveau sont bien différents
	 * afin d'eviter les traitement inutiles dans le back
	 */
	const {previousPassword, newPassword} = req.body
	if(previousPassword === undefined || newPassword === undefined) {
		logLogger("Erreur dans les données du body de la requête, l'un des 2 mots de passe n'est pas renseigné", "profil.js [PUT] /profil/:id/change-password")
		return sendBadRequest(res, 'Erreur dans les données du body')
	}

	const client = getClientsCollection();
	let getUserQuery
	if(statut === constants.STATUT_PROFESSIONNEL) {
		getUserQuery = await client.query(
			'SELECT * FROM professionals WHERE professional_id = $1',
			[id]
		);
	}
	else {
		getUserQuery = await client.query(
			'SELECT * FROM users WHERE users_id = $1',
			[id]
		);
	}

	if (getUserQuery.rows.length === 1) {
		const hashedPassword = getUserQuery.rows[0].password;

		//Compare the password supplied with the hashed password
		const match = await bcrypt.compare(previousPassword, hashedPassword);

		if (match){
			const hash = await bcrypt.hash(newPassword, saltRounds);
			let updatePasswordResult
			if(statut === constants.STATUT_PROFESSIONNEL) {
				updatePasswordResult = await client.query(
					'UPDATE professionals SET password = $1 WHERE professional_id = $2',
					[ hash, id]
				);
			}
			else {
				updatePasswordResult = await client.query(
					'UPDATE users SET password = $1 WHERE users_id = $2',
					[ hash, id]
				);
			}

			if(updatePasswordResult.rowCount === 0){
				errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${getUserQuery.rows[0].email}`, "profil.js [PUT] /profil/:id/change-password")
				sendFailure(res, 'Echec de la mise à jour du mot de passe')
			}
			sendSuccessWithNoContent(res)
		}
		else{
			errorLogger(`L'ancien mot de passe fourni ne correspond pas à celui enregistré en base de l'utilisateur ${getUserQuery.rows[0].email}`, "profil.js [PUT] /profil/:id/change-password")
			sendBadRequest(res,"L'ancien mot de passe fourni ne correspond pas à celui enregistré en base")
		}
	}

})

router.put('/profil/:id/update-profil-picture', requiredAuth, uploadSingle, async (req, res) => {
	let { id, statut } = decodeJWT(req.cookies.jwt)
	const file = req.file
	const uuid = UUID();
	let imageUrl = ""
	const dateActuelle = new Date()
	if (!id) {
		return sendError(res, 'Authentification requise')
	}
	if (!file) {
		sendBadRequest(res, 'Aucun fichier upload')
	}

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
		imageUrl = `${process.env.DOWNLOAD_PATH}/${encodeURIComponent(`images/profile-picture/${dateActuelle.getTime()} - ${file.originalname}`)}?alt=media&token=${uuid}`

		const blob = bucket.file(`images/profile-picture/${dateActuelle.getTime()} - ${file.originalname}`)
		const blobStream = blob.createWriteStream({
			metadata: metadata,
			gzip: true
		})

		blobStream.on("error", err => {
			errorLogger(`erreur lors de l'upload de l'image ${imageUrl} de l'utilisateur ${id}`, 'profil.js [POST] /profil/:id/update-profil-picture')
			errorLogger(err, 'profil.js [POST] /profil/:id/update-profil-picture')
		})

		blobStream.on("finish", () => {
			logLogger(`upload de l'image ${imageUrl} de l'utilisateur ${id} a bien été effectuée`, 'profil.js [POST] /profil/:id/update-profil-picture')
		})

		blobStream.end(req.file.buffer)

		const client = getClientsCollection();
		let queryUpdateProfilPicture
		if(statut === constants.STATUT_CLIENT) {
			queryUpdateProfilPicture = {
				text: 'UPDATE users SET profile_picture = $1 WHERE users_id = $2',
				values: [imageUrl, id],
			};
		}
		else {
			queryUpdateProfilPicture = {
				text: 'UPDATE professionals SET profile_picture = $1 WHERE professional_id = $2',
				values: [imageUrl, id],
			};
		}

		const resultUpdateProfilPicture = await client.query(queryUpdateProfilPicture);

		if (resultUpdateProfilPicture.rowCount === 0) {
			errorLogger("Erreur lors de la mise à jour de la photo de profil de l'utilisateur", 'profil.js [PUT] /profil/:id/update-profil-picture')
			return sendError(res, "Erreur lors de la mise à jour de la photo de profil de l'utilisateur")
		}

		if(statut === constants.STATUT_CLIENT) {
			const queryGetUser = {
				text: 'SELECT * FROM users WHERE users_id = $1',
				values: [id],
			};

			const resultGetUser = await client.query(queryGetUser);


			const { password, creation_date, ...clientProfile} = resultGetUser.rows[0];
			return sendSuccessfullyCreated(res, clientProfile )
		}
		const queryGetUser = {
			text: 'SELECT * FROM professionals WHERE professional_id = $1',
			values: [id],
		};

		const resultGetUser = await client.query(queryGetUser);
		const { password, creation_date, ...proProfile} = resultGetUser.rows[0];
		return sendSuccessfullyCreated(res, proProfile )

	} catch (e) {
		errorLogger('Erreur lors de la récupération du profil:' + e.stack, ' profil.js [PUT] /profil/:id/update-profile-picture')
		sendInternalServerError(res, 'Erreur serveur' )
	}
})


router.post('/profil/:idPro/upload-service-picture/:serviceId',requiredAuth, async (req, res) => {
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
		const files = req.files

		const { id } = decodeJWT(req.cookies.jwt)
		const { idPro, serviceId } = req.params;

		if (files.length === 0) {
			sendBadRequest(res, 'Aucun fichier upload')
		}

		if (!checkIsNumber(idPro) || !checkIsNumber(serviceId) ) {
			warnLogger(`L'utilisateur ${id} a appelé la route avec le paramètre de requete suivant: idPro:${idPro} et serviceId: ${serviceId}`, 'profil.js [PUT] /profil/:idPro/upload-service-picture/:serviceId')
			return sendBadRequest(res, "le 'idPro' et le 'serviceId' de la requête doivent etre des entiers")
		}

		if(convertToNumber(idPro) !== id) {
			warnLogger(`L'utilisateur ${id} a tenté d'upload des images en se faisant passer pour l'utilisateur: ${idPro}`, 'profil.js [PUT] /profil/:idPro/upload-service-picture/:serviceId')
			return sendUnauthrorized(res, 'Permission non autorisé')
		}


		try {
			let tableauEchecs = []
			let tableauURL = []
			for(let file of files){
				const uuid = UUID();
				let dateActuelle = new Date()

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
				let imageUrl = `${process.env.DOWNLOAD_PATH}/${encodeURIComponent(`images/service-images/${dateActuelle.getTime()} - ${file.originalname}`)}?alt=media&token=${uuid}`
				tableauURL.push(imageUrl)
				const blob = bucket.file(`images/service-images/${dateActuelle.getTime()} - ${file.originalname}`)
				const blobStream = blob.createWriteStream({
					metadata: metadata,
					gzip: true
				})

				blobStream.on("error", err => {
					errorLogger(`erreur lors de l'upload de l'image ${imageUrl} de l'utilisateur ${id}`, 'profil.js [POST] /profil/:id/upload-service-picture/:serviceId')
					tableauEchecs.push(imageUrl)
					errorLogger(err, 'profil.js [POST] /profil/:id/upload-service-picture/:serviceId')
				})

				blobStream.on("finish", () => {
					logLogger(`upload de l'image ${imageUrl} de l'utilisateur ${id} a bien été effectuée`, 'profil.js [POST] /profil/:id/upload-service-picture/:serviceId')
				})

				blobStream.end(file.buffer)

			}
			const client = getClientsCollection();

			let dataToInsertString = []
			// TODO: a tester
			if(tableauEchecs.length > 0){
				let images_upload =  tableauURL.filter((url) => tableauEchecs.includes(url) === false)
				dataToInsertString = images_upload.map((url) => [idPro, serviceId, url])
			}
			else {
				dataToInsertString = tableauURL.map((url) => [2, 2, url])
			}

			try {
				// TODO: rajouter la sauvegarde des images dans la nouvelle table
				const insertImagesQuery = format('INSERT INTO images_services_professionals (pro_id, service_id, image_url) VALUES %L', dataToInsertString)


				const insertImageResult = await client.query(insertImagesQuery)
				if(insertImageResult.rowCount === 0 ) {
					errorLogger("Erreur lors de l'enregistrement des images en base" + e.stack, 'profil.js [PUT] /profil/:id/upload-service-picture/:serviceId')
					return sendFailure(res, "Erreur lors de l'enregistrement des images en base" )
				}
				verboseLogger(`Les images du pro ${idPro} ont bien été sauvegarder en base pour le service: ${serviceId} (${dataToInsertString.length} images upload)`, 'profil.js [PUT] /profil/:id/upload-service-picture/:serviceId')
				return sendSuccessfullyCreated(res, `L'upload des images pour le service ${serviceId} a bien fonctionné`)
			}
			catch (e) {
				errorLogger("Erreur lors de l'enregistrement des images en base" + e.stack, 'profil.js [PUT] /profil/:id/upload-service-picture/:serviceId')
				return sendFailure(res, "Erreur lors de l'enregistrement des images en base" )
			}

		} catch (e) {
			errorLogger("Erreur lors de l'upload des images" + e.stack, 'profil.js [PUT] /profil/:id/upload-service-picture/:serviceId')
			return sendInternalServerError(res, 'Erreur serveur' )
		}
	})

})


module.exports = router;
