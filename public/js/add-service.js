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

const addServiceButton = document.getElementById('add-service-button');
const professionalProfileDiv = document.getElementById('professional-profile');

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

      <br><label for "service_price">Prix:</label><br>
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
			service_price: serviceForm.querySelector('#service_price').value,
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
				console.error('Erreur lors de la création du service:', error);
			});
	});
});
