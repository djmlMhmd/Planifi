const multer = require("multer")
const {extname} = require("node:path");

const uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10000000}, /* bytes */
    fileFilter: function(req, file, callback){
        checkFileType(file, callback)
    }
}).array("image", 12)

const uploadSingle = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10000000}, /* bytes */ //à revoir si on veut limiter la taille des fichiers à upload
    fileFilter: function(req, file, callback){
        checkFileType(file, callback)
    }
}).single("image")



function checkFileType(file, callback){
    // extensions autorisées
    const filesTypes = /jpeg|jpg|png|gif/;

    //Vérification des extensions
    const extName = filesTypes.test(extname(file.originalname).toLowerCase())

    // vérification du type => image/png ou image/jpeg etc etc
    const mimeType = filesTypes.test(file.mimetype)
    if(mimeType && extName){
        return callback(null, true)
    }
    callback("Erreur: seules les images sont acceptées !")
}

module.exports = {
    uploadMultiple, uploadSingle
}