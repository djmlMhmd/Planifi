const express = require('express');
const { Router } = require('express');

const router = Router();
router.use(express.json());

const {requiredAuth} = require("../middleware/authMiddleware");
const availabilityController = require('../controllers/availabilityController')
// APPOINTMENT SYSTEM

// Route to define availability times
router.post('/availability', requiredAuth, availabilityController.availability_post);

// Route pour obtenir les disponibilités d'un professionnel
router.get('/availability/:professionalId/:dayOfWeek', requiredAuth, availabilityController.availability_get);

module.exports = router;
