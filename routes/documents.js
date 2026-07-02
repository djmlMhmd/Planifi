const express = require('express');
const { Router } = require('express');
const documentsController = require('../controllers/documentsController');
const { requiredAuth } = require('../middleware/authMiddleware');

const router = Router();
router.use(express.json());

// Je sépare bien l'API de la page React /documents pour éviter tout conflit de route.
router.get('/documents/data', requiredAuth, documentsController.documents_get);

module.exports = router;
