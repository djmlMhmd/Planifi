const express = require('express');
const { Router } = require('express');
const router = Router();
const session = require('express-session');
router.use(express.json());
const path = require('path');

router.post(
	'/upload-profile-image',
	upload.single('profileImage'),
	async (req, res) => {
		const professionalID = req.session.professionalID;

		const uploadedFileName = `${professionalID}${path.extname(
			req.file.originalname
		)}`;

		try {
			const updateQuery = `
      UPDATE professionals
      SET profile_image = $1
      WHERE professional_id = $2
    `;

			await client.query(updateQuery, [uploadedFileName, professionalID]);

			res.redirect(`/profil/professionnel/${professionalID}`);
		} catch (error) {
			console.error(
				'Erreur lors de la mise à jour de la base de données :',
				error
			);
		}
	}
);

module.exports = router;
