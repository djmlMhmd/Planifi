const express = require('express');
const { Router } = require('express');
const router = Router();
router.use(express.json());

const {requiredAuth} = require("../middleware/authMiddleware");
const {uploadSingle} = require("../middleware/multer");
const profilController = require('../controllers/profilController')

// PROFESSIONAL PROFILE

router.get('/profil/professionnel/',requiredAuth, profilController.profil_pro_get);

// CLIENT PROFILE

router.get('/profil', requiredAuth, profilController.profil_client_get);

router.put('/profil/:id/change-password', requiredAuth, profilController.profil_change_password_put)

router.put('/profil/update-profil-picture', requiredAuth, uploadSingle, profilController.update_profile_picture_put)


router.post('/profil/:idPro/upload-service-picture/:serviceId',requiredAuth, profilController.upload_images_service_post)
router.delete('/profil/service-picture/:imageId', requiredAuth, profilController.image_service_delete)



module.exports = router;
