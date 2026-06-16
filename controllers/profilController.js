const {decodeJWT} = require("../utils/auth.utils");
const {warnLogger, errorLogger, logLogger, verboseLogger} = require("../config/winston/winston.config");
const {constants} = require("../constants/constants");
const {sendError, sendSuccess, sendInternalServerError, sendBadRequest, sendUnauthorized,
    sendFailure,
    sendSuccessWithNoContent, sendSuccessfullyCreated, sendNonAcceptable
} = require("../utils/error_message.utils");
const {getClientsCollection} = require("../db/database");
const {isANumber, convertToNumber, isUndefined} = require("../utils/methods.utils");
const bcrypt = require("bcrypt");
const UUID = require("uuid-v4");
const {uploadMultiple, ERROR_MESSAGES} = require("../middleware/multer");
const format = require("pg-format");
const fs = require("node:fs/promises");
const path = require("node:path");
const saltRounds = 10;
const uploadsRoot = path.join(__dirname, "..", "public", "uploads");

function getUploadDirectory(folderName) {
    return path.join(uploadsRoot, folderName);
}

function sanitizeFileName(fileName) {
    // Je garde un nom simple et stable pour éviter les espaces et caractères spéciaux.
    return path
        .basename(fileName)
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/-+/g, "-");
}

function getSafeExtension(file) {
    const originalExtension = path.extname(file.originalname || "").toLowerCase();

    if (originalExtension) {
        return originalExtension;
    }

    if (file.mimetype === "image/png") return ".png";
    if (file.mimetype === "image/gif") return ".gif";
    return ".jpg";
}

async function saveImageOnDisk(file, folderName) {
    const targetDirectory = getUploadDirectory(folderName);
    const baseName = sanitizeFileName(path.basename(file.originalname || "image", path.extname(file.originalname || "")));
    const extension = getSafeExtension(file);
    const fileName = `${Date.now()}-${UUID()}-${baseName || "image"}${extension}`;
    const relativePath = path.posix.join("/uploads", folderName, fileName);
    const absolutePath = path.join(targetDirectory, fileName);

    await fs.mkdir(targetDirectory, { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);

    return {
        imageUrl: relativePath,
        imagePath: relativePath,
    };
}

async function deleteLocalImageIfExists(storedPath) {
    if (!storedPath) {
        return;
    }

    // J'ignore les anciennes URLs Firebase éventuelles pour éviter une erreur inutile.
    if (!storedPath.startsWith("/uploads/") && !storedPath.startsWith("uploads/")) {
        return;
    }

    const normalizedRelativePath = storedPath.replace(/^\/+/, "");
    const absolutePath = path.join(__dirname, "..", "public", normalizedRelativePath);

    try {
        await fs.unlink(absolutePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}

module.exports.profil_pro_get = async (req, res) => {

    const { id } = decodeJWT(req.cookies.jwt)
    if (!id) {
        warnLogger(`Authentification requise`, '','profilController.js',`/profil/professionnel/${id}`, constants.GET_HTTP)
        return sendError(res, 'Authentification requise')
    }
    try {
        const client = getClientsCollection();
        const query = {
            text: 'SELECT * FROM users inner join public.pro_account pa on users.users_id = pa.user_id WHERE users_id = $1',
            values: [id],
        };

        const result = await client.query(query);

        if (result.rows.length === 0) {
            warnLogger(`Profil professionnel non trouvé ${id}`, '','profilController.js',`/profil/professionnel/${id}`, constants.GET_HTTP)
            return sendError(res, 'Profil professionnel non trouvé')
        }

        const { password, creation_date, user_id, professional_id, ...professionalProfile } =
            result.rows[0];
        return sendSuccess(res, professionalProfile)
    } catch (e) {
        errorLogger(`Erreur lors de la récupération du profil professionnel: ${JSON.stringify(e.stack)}`, '','profilController.js',`/profil/professionnel/${id}`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur serveur' )
    }
}

module.exports.profil_client_get =  async (req, res) => {
    /**
     * en principe si on a passé le middleware "requiredAuth"
     * on est forcément authentifié et donc le cookie "JWT" existe
     */
    let { id } = decodeJWT(req.cookies.jwt)

    if (!id) {
        warnLogger(`Authentification requise ${id}`, '','profilController.js', `/profil`, constants.GET_HTTP)
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
            warnLogger(`Profil  non trouvé ${id}`, '','profilController.js', `/profil`, constants.GET_HTTP)
            return sendError(res, 'Profil non trouvé' )
        }

        const { password, creation_date, ...clientProfile } = result.rows[0];
        return sendSuccess(res, clientProfile)
    } catch (e) {
        errorLogger(`Erreur lors de la récupération du profil client: ${JSON.stringify(e.stack)}`, '','profilController.js', `/profil`, constants.GET_HTTP)
        return sendInternalServerError(res, 'Erreur serveur' )
    }
}

module.exports.profil_change_password_put = async (req, res) => {
    let idReq  = req.params['id'];
    let { id } = decodeJWT(req.cookies.jwt)

    if (!isANumber(idReq)) {
        warnLogger(`L'utilisateur ${id} a appelé la route avec le paramètre de requete suivant: ${idReq}`, '','profilController.js', `/profil/${id}/change-password`, constants.PUT_HTTP)
        return sendBadRequest(res, "l'id doit etre un entier")
    }

    if(convertToNumber(idReq) !== id) {
        warnLogger(`L'utilisateur ${id} a tenté de modifier le mot de passe de l'utilisateur ${idReq}`, '','profilController.js', `/profil/${id}/change-password`, constants.PUT_HTTP)
        return sendUnauthorized(res, 'Permission non autorisé')
    }
    /**
     * le front se chargera de vérifier que l'ancien mot de passe et le nouveau sont bien différents
     * afin d'eviter les traitement inutiles dans le back
     */
    const {previousPassword, newPassword} = req.body
    if(isUndefined(previousPassword) || isUndefined(newPassword)) {
        logLogger("Erreur dans les données du body de la requête, l'un des 2 mots de passe n'est pas renseigné", '','profilController.js', `/profil/${id}/change-password`, constants.PUT_HTTP)
        return sendBadRequest(res, 'Erreur dans les données du body')
    }

    const client = getClientsCollection();
    let getUserQuery = await client.query(
        'SELECT * FROM users WHERE users_id = $1',
        [id]
    );

    if (getUserQuery.rows.length === 1) {
        const hashedPassword = getUserQuery.rows[0].password;

        //Compare the password supplied with the hashed password
        const match = await bcrypt.compare(previousPassword, hashedPassword);

        if (match){
            const hash = await bcrypt.hash(newPassword, saltRounds);
            let updatePasswordResult = await client.query(
                'UPDATE users SET password = $1 WHERE users_id = $2',
                [ hash, id]
            );

            if(updatePasswordResult.rowCount === 0){
                errorLogger(`Echec lors de la mise à jour du mot de passe de l'utilisateur ${getUserQuery.rows[0].email}`, '','profilController.js', `/profil/${id}/change-password`, constants.PUT_HTTP)
                return sendFailure(res, 'Echec de la mise à jour du mot de passe')
            }
            return sendSuccessWithNoContent(res)
        }
        else{
            errorLogger(`L'ancien mot de passe fourni ne correspond pas à celui enregistré en base de l'utilisateur ${getUserQuery.rows[0].email}`, '','profilController.js', `/profil/${id}/change-password`, constants.PUT_HTTP)
            return sendBadRequest(res,"L'ancien mot de passe fourni ne correspond pas à celui enregistré en base")
        }
    }

}

module.exports.update_profile_picture_put = async (req, res) => {
    let { id } = decodeJWT(req.cookies.jwt)
    const file = req.file

    if (!file) {
        return sendBadRequest(res, 'Aucun fichier upload')
    }

    try {
        const { imageUrl, imagePath } = await saveImageOnDisk(file, "profile-picture");
        logLogger(`upload local de l'image ${imageUrl} de l'utilisateur ${id} effectué`, '','profilController.js', `/profil/${id}/update-profil-picture`, constants.PUT_HTTP)

        const client = getClientsCollection();
        let queryUpdateProfilPicture

        /** suppression de l'ancienne image en base */
        let queryUserInfo = await client.query('SELECT profile_picture_path from users where users_id = $1', [id]);
        const {profile_picture_path}  = queryUserInfo.rows[0]
        try {
            if(profile_picture_path !== null){
                await deleteLocalImageIfExists(profile_picture_path);
                logLogger(`l'ancienne image ${profile_picture_path} de l'utilisateur ${id} (client) a bien été supprimée`, '','profilController.js', `/profil/${id}/update-profil-picture`, constants.PUT_HTTP)
            }
        }
        catch (e) {
            errorLogger(`Erreur lors de la suppression de l'ancienne photo de profil de l'utilisateur ${id}: ${e}`, '','profilController.js', `/profil/${id}/update-profil-picture`, constants.PUT_HTTP)
        }

        queryUpdateProfilPicture = {
            text: 'UPDATE users SET profile_picture = $1, profile_picture_path = $3 WHERE users_id = $2',
            values: [imageUrl, id, imagePath],
        };


        const resultUpdateProfilPicture = await client.query(queryUpdateProfilPicture);

        if (resultUpdateProfilPicture.rowCount === 0) {
            errorLogger("Erreur lors de la mise à jour de la photo de profil de l'utilisateur", '','profilController.js', `/profil/${id}/update-profil-picture`, constants.PUT_HTTP)
            return sendError(res, "Erreur lors de la mise à jour de la photo de profil de l'utilisateur")
        }


        const queryGetUser = {
            text: 'SELECT * FROM users WHERE users_id = $1',
            values: [id],
        };

        const resultGetUser = await client.query(queryGetUser);

        const { password, creation_date, ...clientProfile} = resultGetUser.rows[0];
        return sendSuccessfullyCreated(res, clientProfile )

    } catch (e) {
        errorLogger('Erreur lors de la récupération du profil:' + e.stack, '','profilController.js', `/profil/${id}/update-profil-picture`, constants.PUT_HTTP)
        return sendInternalServerError(res, "Impossible d'enregistrer la photo de profil." )
    }
}

module.exports.upload_images_service_post =  async (req, res) => {
    /**
     * doc: https://github.com/expressjs/multer/blob/master/lib/multer-error.js
     */
    uploadMultiple(req, res, async function (err) {
        if(err){
            switch(err.message) {
                case ERROR_MESSAGES.LIMIT_FILE_SIZE:
                    return sendNonAcceptable(res, 'certains fichiers sont trop volumineux') // TODO: preciser la taille max des fichiers

                case ERROR_MESSAGES.LIMIT_FILE_COUNT:
                    return sendNonAcceptable(res, 'Vous avez upload trop de fichiers en même temps, la limite est de 12') //TODO: modifier cette valeur dynamiquement
            }
        }
        const files = req.files

        const { id } = decodeJWT(req.cookies.jwt)
        const { idPro, serviceId } = req.params;

        if ( files === undefined ||files.length === 0) {
            return sendBadRequest(res, 'Aucun fichier upload')
        }

        if (!isANumber(idPro) || !isANumber(serviceId) ) {
            warnLogger(`L'utilisateur ${id} a appelé la route avec le paramètre de requete suivant: idPro:${idPro} et serviceId: ${serviceId}`, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
            return sendBadRequest(res, "le 'idPro' et le 'serviceId' de la requête doivent etre des entiers")
        }

        if(convertToNumber(idPro) !== id) {
            warnLogger(`L'utilisateur ${id} a tenté d'upload des images en se faisant passer pour l'utilisateur: ${idPro}`, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
            return sendUnauthorized(res, 'Permission non autorisé')
        }


        try {
            let tableauEchecs = []
            let tableauURL = []
            for(let file of files){
                try {
                    const { imageUrl, imagePath } = await saveImageOnDisk(file, "service-images");
                    tableauURL.push([imageUrl, imagePath]);
                    logLogger(`upload local de l'image ${imageUrl} de l'utilisateur ${id} effectué`, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                } catch (error) {
                    const fallbackName = sanitizeFileName(file.originalname || "image");
                    const imageUrl = `/uploads/service-images/${fallbackName}`;
                    tableauEchecs.push(imageUrl)
                    errorLogger(`erreur lors de l'upload local de l'image ${imageUrl} de l'utilisateur ${id}`, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                    errorLogger(error, '','profilController.js',`/profil/${id}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                }
            }
            const client = getClientsCollection();

            let dataToInsertString

            if(tableauEchecs.length > 0){
                let images_upload =  tableauURL.filter((tab) => tableauEchecs.includes(tab[0]) === false)
                dataToInsertString = images_upload.map((tab) => [idPro, serviceId, tab[0], tab[1]])
            }
            else {
                dataToInsertString = tableauURL.map((tab) => [idPro, serviceId, tab[0], tab[1]])
            }

            if (dataToInsertString.length === 0) {
                errorLogger("Aucune image n'a pu être sauvegardée sur le disque", '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                return sendFailure(res, "Aucune image n'a pu être enregistrée")
            }

            try {
                const insertImagesQuery = format('INSERT INTO images_services_professionals (pro_id, service_id, image_url, picture_path) VALUES %L', dataToInsertString)
                const insertImageResult = await client.query(insertImagesQuery)

                if(insertImageResult.rowCount === 0 ) {
                    errorLogger("Erreur lors de l'enregistrement des images en base", '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                    return sendFailure(res, "Erreur lors de l'enregistrement des images en base" )
                }
                verboseLogger(`Les images du pro ${idPro} ont bien été sauvegarder en base pour le service: ${serviceId} (${dataToInsertString.length} images upload)`, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                return sendSuccessfullyCreated(res, `L'upload des images pour le service ${serviceId} a bien fonctionné`)
            }
            catch (e) {
                errorLogger("Erreur lors de l'enregistrement des images en base" + e.stack, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
                return sendFailure(res, "Erreur lors de l'enregistrement des images en base" )
            }

        } catch (e) {
            errorLogger("Erreur lors de l'upload des images" + e.stack, '','profilController.js', `/profil/${idPro}/upload-service-picture/${serviceId}`, constants.POST_HTTP)
            return sendInternalServerError(res, 'Erreur serveur' )
        }
    })

}

module.exports.image_service_delete =  async (req, res) => {
    const { id } = decodeJWT(req.cookies.jwt)
    const { imageId } = req.params;
    
    if (!isANumber(imageId) ) {
        warnLogger(`L'utilisateur ${id} a appelé la route avec le paramètre de requete suivant: imageId:${imageId}`, '','profilController.js', `/profil/service-picture/${imageId}`, constants.DELETE_HTTP)
        return sendBadRequest(res, "le 'idPro' et le 'serviceId' de la requête doivent etre des entiers")
    }

    //TODO: ajouter une vérification

    const client = getClientsCollection();
    /** suppression de l'ancienne image en base */
    let queryImageInfo = await client.query('SELECT * from images_services_professionals where image_id = $1 and pro_id = $2', [imageId, id]);
    if(queryImageInfo.rowCount > 0 ) {
        const {picture_path} = queryImageInfo.rows[0]
        try {
            if (picture_path !== null) {
                await deleteLocalImageIfExists(picture_path);
            }

            /* suppression dans la table */
            await client.query('DELETE from images_services_professionals where image_id = $1 and pro_id = $2', [imageId, id]);
            logLogger(`l'image ${picture_path} de l'utilisateur ${id} (pro) a bien été supprimée`, '','profilController.js', `/profil/service-picture/${imageId}`, constants.DELETE_HTTP)
            return sendSuccess(res, "l'image a bien été supprimée")
        } catch (e) {
            errorLogger(`Erreur lors de la suppression de la photo ${picture_path} (${imageId}) du service de l'utilisateur ${id} (pro)`,  '','profilController.js', `/profil/service-picture/${imageId}`, constants.DELETE_HTTP)
            return sendError(res, `Erreur lors de la suppression de la photo ${picture_path} (${imageId}) du service de l'utilisateur ${id} (pro)`)
        }
    }
    else {
        errorLogger(`l'image (${imageId}) n'appartient pas à l'utilisateur ${id} (pro)`, '','profilController.js', `/profil/service-picture/${imageId}`, constants.DELETE_HTTP)
        return sendBadRequest(res, `l'image (${imageId}) n'appartient pas à l'utilisateur ${id} (pro)`)
    }


    // else {
    //     warnLogger(`L'utilisateur ${id} a tenté de supprimer l'image ${imageId}`, '','profilController.js', `/profil/service-picture/${imageId}`, constants.DELETE_HTTP)
    //     return sendUnauthorized(res, 'Permission non autorisé')
    // }
    
}

module.exports.update_preferences_put = async (req, res) => {
    const { id, statut } = decodeJWT(req.cookies.jwt)

    //TODO: demander à Djamal plus de précisions
    return res.status(201).end()
}
