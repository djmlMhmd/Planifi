const profileImage = document.getElementById('profile-image');
const fileInput = document.getElementById('file-input');

// Ajoutez un gestionnaire d'événements pour le clic sur la photo de profil
profileImage.addEventListener('click', () => {
	// Déclenchez le clic sur l'élément d'entrée de type fichier
	fileInput.click();
});

// Ajoutez un gestionnaire d'événements pour le changement de fichier
fileInput.addEventListener('change', (event) => {
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		// Mettez à jour la source de l'image avec le nouveau fichier
		const reader = new FileReader();
		reader.onload = (e) => {
			profileImage.src = e.target.result;
		};
		reader.readAsDataURL(selectedFile);
	}
});
