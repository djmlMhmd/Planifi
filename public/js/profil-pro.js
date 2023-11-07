document.addEventListener('DOMContentLoaded', () => {
	fetch('/profil/professionnel/${professionalID}')
		.then((response) => {
			if (!response.ok) {
				throw new Error('La requête a échoué');
			}
			return response.json();
		})
		.then((data) => {
			const professionalProfileDiv = document.getElementById(
				'professional-profile'
			);
			professionalProfileDiv.innerHTML = `
			                 <h2>Nom de l'entreprise : ${data.company_name}</h2>
			                 <p>Nom du professionnel : ${data.firstName} ${data.lastName}</p>
			                 <p>Email : ${data.email}</p>
			                 <p>Téléphone : ${data.phone}</p>
			                 <p>Adresse de l'entreprise : ${data.company_address}</p>
			             `;
		})
		.catch((error) => {
			console.error(
				'Erreur lors de la récupération du profil professionnel:',
				error
			);
		});
	document.getElementById('logout-button').addEventListener('click', () => {
		fetch('/deconnexion/client', { method: 'POST' })
			.then((response) => {
				if (response.ok) {
					// Redirect the user to the login page after logging out
					window.location.href = '/connexion';
				} else {
					console.error('Échec de la déconnexion');
				}
			})
			.catch((error) => {
				console.error('Erreur lors de la déconnexion:', error);
			});
	});

	const calendarButton = document.getElementById('calendar-button');

	calendarButton.addEventListener('click', () => {
		// Redirects the user to the "availability.html" page
		window.location.href = '/availability.html';
	});

	const servicesHeading = document.getElementById('services-heading');
	const professionalServices = document.getElementById(
		'professional-services'
	);
	servicesHeading.addEventListener('click', () => {
		if (professionalServices.style.display === 'none') {
			professionalServices.style.display = 'block';
		} else {
			professionalServices.style.display = 'none';
		}
	});

	// Retrieve and display the professional's services
	const professionalServicesDiv = document.getElementById(
		'professional-services'
	);

	// function to retrieve and display the professional's services
	function fetchAndDisplayServices() {
		const urlParams = new URLSearchParams(window.location.search);
		const professionalId = urlParams.get('professionalId');

		fetch(`/services/${professionalId}`, { method: 'GET' })
			.then((response) => {
				if (!response.ok) {
					throw new Error('La requête a échoué');
				}
				return response.json();
			})
			.then((data) => {
				// Delete existing content before adding services
				professionalServicesDiv.innerHTML = '';

				// Browse and display services
				data.forEach((service) => {
					const serviceElement = document.createElement('div');
					serviceElement.innerHTML = `
                        <h3>${service.service_name}</h3>
                        <p>${service.service_description}</p>
                        <p>Prix: ${service.service_price} EUR</p>
                        <p>Durée: ${service.duration.hours} heures</p>
                        <button class="delete-service-button" data-service-id="${service.service_id}">Supprimer</button>
					

                    `;

					professionalServicesDiv.appendChild(serviceElement);
				});
			})
			.catch((error) => {
				console.error(
					'Erreur lors de la récupération des services :',
					error
				);
			});
	}

	// Call the function to retrieve and display services when the page is initialised
	fetchAndDisplayServices();

	// Add an event handler to delete a service
	professionalServicesDiv.addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-service-button')) {
			const serviceID = event.target.getAttribute('data-service-id');
			if (serviceID) {
				// Send a request to delete the service based on serviceID
				fetch(`/services/delete/${serviceID}`, {
					method: 'DELETE',
				})
					.then((response) => {
						if (response.ok) {
							// Service successfully deleted, update display
							fetchAndDisplayServices();
						} else {
							console.error('Échec de la suppression du service');
						}
					})
					.catch((error) => {
						console.error(
							'Erreur lors de la suppression du service :',
							error
						);
					});
			}
		}
		if (event.target.classList.contains('edit-service-button')) {
			// Obtenir l'ID du service à éditer
			const serviceID = event.target.getAttribute('data-service-id');
			if (serviceID) {
				// Appeler une fonction pour éditer le service
				editService(serviceID);
			}
		}
	});
});
