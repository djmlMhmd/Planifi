document.addEventListener('DOMContentLoaded', () => {
	console.log('je me lance');
	const form = document.querySelector('#registration-form');
	const user_type = document.querySelector('#user_type');
	const professionalFields = document.querySelectorAll('.professional-field');

	// Fonction pour gérer l'affichage conditionnel des champs professionnels
	function toggleProfessionalFields() {
		if (user_type.value === 'professional') {
			professionalFields.forEach(
				(field) => (field.style.display = 'block')
			);
		} else {
			professionalFields.forEach(
				(field) => (field.style.display = 'none')
			);
		}
	}

	// Gérer l'affichage initial
	toggleProfessionalFields();

	// Gérer l'affichage des champs en fonction du choix de l'utilisateur
	user_type.addEventListener('change', toggleProfessionalFields);

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		// Créez un objet FormData à partir du formulaire
		const formData = new FormData(form);

		// Créez un objet pour stocker les données du formulaire
		const formDataObject = {};
		formData.forEach((value, key) => {
			formDataObject[key] = value;
		});

		// Supprimez les champs inutiles en fonction du type d'utilisateur sélectionné
		if (user_type.value === 'client') {
			delete formDataObject.company_name;
			delete formDataObject.company_address;
		}

		try {
			// Effectuez une requête POST vers votre endpoint d'inscription
			const response = await fetch('/inscription', {
				method: 'POST',
				body: JSON.stringify(formDataObject),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const result = await response.json();
				console.log('Inscription réussie:', result);
				// Redirigez l'utilisateur ou affichez un message de confirmation
			} else {
				const errorData = await response.json();
				console.error("Erreur lors de l'inscription:", errorData);
				// Affichez un message d'erreur à l'utilisateur ou effectuez d'autres actions en cas d'erreur
			}
		} catch (error) {
			console.error('Erreur lors de la requête API:', error);
			// Gérez l'erreur de requête, par exemple, affichez un message d'erreur
		}
	});
});
