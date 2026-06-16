const express = require('express');
const { Router } = require('express');

const router = Router();
router.use(express.json());

const {requiredAuth} = require("../middleware/authMiddleware");
const serviceController = require('../controllers/servicesController')

// SERVICE CREATE

router.post('/service/create', requiredAuth, serviceController.service_create_post);
router.put('/service/:serviceId', requiredAuth, serviceController.service_update_put);

// route pour récupérer tout les services enregistré en base
router.get('/service', requiredAuth, serviceController.service_all_get);

// Les routes statiques doivent passer avant /service/:serviceId,
// sinon Express essaye de lire "search-services" comme un id.
router.get('/service/search-services', requiredAuth, serviceController.search_service_get);
router.get('/service/search-suggestions', requiredAuth, serviceController.search_suggestions_get);

// route pour récuperer la liste des services d'un professionnel donné
router.get('/service/:professionalId/liste', requiredAuth, serviceController.service_liste_pro_get);

// route récupérer les infos du services en fonction de l'ID du service
router.get('/service/:serviceId', requiredAuth, serviceController.service_byId_get);

// SUPPRIMER SERVICE
router.delete('/service/:serviceId', requiredAuth, serviceController.service_delete);


module.exports = router;
