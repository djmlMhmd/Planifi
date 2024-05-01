const express = require('express');
const { Router } = require('express');

const router = Router();
router.use(express.json());

const {requiredAuth} = require("../middleware/authMiddleware");
const reservationController = require('../controllers/reservationController')


router.post('/reservation', requiredAuth, reservationController.reservation_post);

/**
 * route pour obtenir toutes les réservations enregistrées en base d'un pro
 */
router.get('/reservation', requiredAuth, reservationController.reservation_pro_get);

router.get('/reservation/client', requiredAuth, reservationController.reservation_client_get);

router.get('/reservation/reservedHours', requiredAuth, reservationController.reservation_byHour_get);

// SUPPRIMER RÉSERVATION
router.delete('/reservation/:reservationId', requiredAuth, reservationController.reservation_delete);

module.exports = router;
