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
	const addServiceButton = document.getElementById('add-service-button');
	const professionalProfileDiv = document.getElementById(
		'professional-profile'
	);

	const shouldDisplayModal = localStorage.getItem('displayModal');
	if (shouldDisplayModal) {
		displaySuccessModal();
		localStorage.removeItem('displayModal'); // Remove the indicator
	}

	addServiceButton.addEventListener('click', () => {
		// Crée un formulaire pour ajouter un service
		const serviceForm = document.createElement('form');
		serviceForm.innerHTML = `
            <h3>Ajouter un service</h3>
            <label for="service_name">Nom du service:</label><br>
            <input type="text" id="service_name" name="service_name" required>

           <br><label for="service_description">Description:</label><br>
            <textarea id="service_description" name="service_description" required></textarea>

          <br><label for="service_price">Prix:</label><br>
            <input type="number" id="service_price" name="service_price" required>

            <br><label for="duration">Durée:</label><br>
            <select id="duration" name="duration" required>
			<option value="1800">30 min</option>
    		<option value="3600">1 h 00</option>
    		<option value="5400">1 h 30</option>
    		<option value="7200">2 h 00</option>
			<option value="9000">2 h 30</option>
			<option value="10800">3 h 00</option>
			<option value="12600">3 h 30</option>
			<option value="14400">4 h 00</option>
			<option value="16200">4 h 30</option>
			<option value="18000">5 h 00</option>
			<option value="19800">5 h 30</option>
			<option value="21600">6 h 00</option>
			<option value="23400">6 h 30</option>
			<option value="25200">7 h 00</option>
			<option value="27000">7 h 30</option>
			<option value="28800">8 h 00</option>
			</select>

            <button type="submit">Créer</button>
        `;

		professionalProfileDiv.appendChild(serviceForm);

		serviceForm.addEventListener('submit', (event) => {
			event.preventDefault();
			const formData = {
				service_name: serviceForm.querySelector('#service_name').value,
				service_description: serviceForm.querySelector(
					'#service_description'
				).value,
				service_price:
					serviceForm.querySelector('#service_price').value,
				duration: parseInt(
					serviceForm.querySelector('#duration').value,
					10
				),
			};
			function closeForm() {
				const serviceForm = document.getElementById('service-form');
				if (serviceForm) {
					// Delete the DOM form
					serviceForm.remove();
				}
			}

			fetch('/service/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					if (response.ok) {
						localStorage.setItem('displayModal', 'true');
						location.reload();
						closeForm();
					} else {
						console.error('Échec de la création du service');
					}
				})
				.catch((error) => {
					console.error(
						'Erreur lors de la création du service:',
						error
					);
				});
		});
	});
});

const servicesHeading = document.getElementById('services-heading');
const professionalServices = document.getElementById('professional-services');
servicesHeading.addEventListener('click', () => {
	if (professionalServices.style.display === 'none') {
		professionalServices.style.display = 'block';
	} else {
		professionalServices.style.display = 'none';
	}
});

function displaySuccessModal() {
	const modalContainer = document.createElement('div');
	modalContainer.className = 'modal-container';
	modalContainer.innerHTML = `
        <div class="modal" id="success-modal">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Service créé avec succès!</h2>
            <p>Votre service a été ajouté avec succès.</p>
        </div>
    `;
	modalContainer
		.querySelector('.close')
		.addEventListener('click', (event) => {
			event.stopPropagation();
			closeModal();
		});
	document.body.appendChild(modalContainer);
}

// close the modal window
function closeModal() {
	const modalContainer = document.querySelector('.modal-container');
	if (modalContainer) {
		modalContainer.remove();
	}
}
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
