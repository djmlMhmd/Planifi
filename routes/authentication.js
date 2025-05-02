const express = require('express');
const { Router } = require('express');

const router = Router();
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');
router.use(express.json());

const {
	registrationLimiter,
	authLimiter,
	sendMailResetPasswordLimiter,
	sendMailConfirmRegistrationLimiter,
} = require('../utils/auth.utils');
const { requiredAuth } = require('../middleware/authMiddleware');
const authentificationController = require('../controllers/authentificationController');

/**
 * Authentification user déjà log
 */
router.get('/auth', requiredAuth, authentificationController.auth_get);

// REGISTRATIONS
router.post(
	'/inscription/utilisateur',
	registrationLimiter,
	//verifyRecaptcha,
	authentificationController.register_user_post
);

// Inscription pour les professionnels
router.post(
	'/inscription/professionnel',
	//verifyRecaptcha,
	authentificationController.register_user_post
);

// Complétion du profil utilisateur (client ou pro)
router.post(
	'/complete-profile',
	requiredAuth,
	authentificationController.complete_profile_post
);

// CONNEXION
router.post(
	'/connexion',
	authLimiter,
	authentificationController.connexion_post
);

router.get(
	'/confirm-registration',
	authentificationController.confirm_registration_get
);

router.post(
	'/resend-registration-mail',
	sendMailConfirmRegistrationLimiter,
	authentificationController.resend_mail_register_post
);

router.post(
	'/forgot-password',
	sendMailResetPasswordLimiter,
	authentificationController.forgot_password_post
);

router.put(
	'/forgot-password-reset',
	authentificationController.forget_password_reset_post
);

module.exports = router;
