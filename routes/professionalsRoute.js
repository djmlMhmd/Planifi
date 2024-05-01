const express = require('express');
const { Router } = require('express');
const router = Router();
router.use(express.json());

const {requiredAuth} = require("../middleware/authMiddleware");

const professionalController = require('../controllers/professionalController')

// Route pour obtenir la liste des professionnels avec leurs ID
router.get('/professionals', requiredAuth, professionalController.professionals_get);

module.exports = router;