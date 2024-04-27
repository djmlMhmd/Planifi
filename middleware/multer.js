const multer = require("multer")
const {extname} = require("node:path");

const uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10000000, files: 12}, /* bytes */
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

const ERROR_MESSAGES = {
    LIMIT_PART_COUNT: 'Too many parts',
    LIMIT_FILE_SIZE: 'File too large',
    LIMIT_FILE_COUNT: 'Too many files',
    LIMIT_FIELD_KEY: 'Field name too long',
    LIMIT_FIELD_VALUE: 'Field value too long',
    LIMIT_FIELD_COUNT: 'Too many fields',
    LIMIT_UNEXPECTED_FILE: 'Unexpected field',
    MISSING_FIELD_NAME: 'Field name missing'
}

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
    uploadMultiple,
    uploadSingle,
    ERROR_MESSAGES
}