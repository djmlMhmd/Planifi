const uploadFile = async (file) => {
	const fileRef = storageRef.child('profile-images/' + file.originalname);

	try {
		const snapshot = await fileRef.put(file.buffer);
		console.log('Fichier téléchargé avec succès !', snapshot.ref.fullPath);

		// Récupérez l'URL de téléchargement du fichier
		const downloadURL = await snapshot.ref.getDownloadURL();
		console.log('URL de téléchargement :', downloadURL);
	} catch (error) {
		console.error('Erreur lors du téléchargement du fichier :', error);
	}
};
