document.addEventListener('DOMContentLoaded', function () {
	const clientId = getCookie('clientID');
	const urlParams = new URLSearchParams(window.location.search);
	const professionalId = urlParams.get('professionalId');
	const serviceId = parseInt(urlParams.get('serviceId'), 10);
	setCookie('serviceId', serviceId, 7);

	console.log('id:', clientId);
	console.log('id pro', professionalId);
	console.log('id service:', serviceId);

	const dateInput = document.getElementById('date');
	const showHoursButton = document.getElementById('show-hours-button');
	const hoursTable = document.getElementById('hours-table');
	const reserveButton = document.getElementById('reserve-button');
	const messageDiv = document.getElementById('message');
	let selectedTime = ''; // Stocke l'heure sélectionnée

	fetch(`/reservation/${serviceId}`, { method: 'GET' })
		.then((response) => response.json())
		.then((service) => {
			const serviceInfoDiv = document.getElementById('service-info');
			serviceInfoDiv.innerHTML = `
                <strong>Service: </strong>${service.service_name}<br>
                <strong>Description: </strong>${service.service_description}<br>
                <strong>Prix: </strong>${service.service_price} €<br>
                <strong>Durée: </strong>${service.duration.hours} heures<br>
            `;
		})
		.catch((error) => {
			console.error(
				'Erreur lors de la récupération des informations du service :',
				error
			);
		});

	showHoursButton.addEventListener('click', function () {
		hoursTable.innerHTML = ''; // Efface le tableau précédent

		// Effectue la requête pour récupérer les heures réservées ici
		fetch('/reservedHours', { method: 'GET' })
			.then((response) => response.json())
			.then((reservedHours) => {
				const heuresReservees = reservedHours;

				// Crée un tableau d'heures de 08h à 21h
				const availableHours = [];
				for (let hour = 8; hour <= 21; hour++) {
					availableHours.push(
						`${hour.toString().padStart(2, '0')}:00`
					);
				}

				// Crée un tableau pour afficher les heures
				const table = document.createElement('table');
				const tbody = document.createElement('tbody');

				const row = document.createElement('tr');

				availableHours.forEach((hour) => {
					const button = document.createElement('button');
					button.textContent = hour;
					button.addEventListener('click', function () {
						// Désélectionne tous les boutons d'heure
						availableHours.forEach((h) => {
							const previousSelectedButton =
								document.querySelector('.selected-hour');
							if (previousSelectedButton) {
								previousSelectedButton.classList.remove(
									'selected-hour'
								);
							}
						});

						selectedTime = hour;
						button.classList.add('selected-hour'); // Ajoute la classe pour la sélection
					});

					const row = document.createElement('tr');
					const cell = document.createElement('td');

					cell.appendChild(button);
					row.appendChild(cell);
					tbody.appendChild(row);

					// Vérifie si l'heure est déjà réservée
					if (heuresReservees.includes(hour)) {
						button.disabled = true; // Désactive le bouton
					}
				});
				table.appendChild(tbody);
				hoursTable.appendChild(table);
			});
	});

	// Code pour afficher la fenêtre modale
	function showModal(message) {
		const modal = document.getElementById('myModal');
		const modalMessage = document.getElementById('modal-message');
		modalMessage.textContent = message;
		modal.style.display = 'block';
	}

	// Code pour fermer la fenêtre modale
	const closeModal = document.querySelector('.close-modal');
	closeModal.addEventListener('click', function () {
		const modal = document.getElementById('myModal');
		modal.style.display = 'none';
	});

	// Fermer la fenêtre modale en cliquant n'importe où sur l'écran
	const modal = document.getElementById('myModal');
	window.addEventListener('click', function (event) {
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	});

	// clic sur le bouton "Réserver"
	reserveButton.addEventListener('click', function () {
		const selectedDate = moment(dateInput.value).format('DD-MM-YYYY');
		if (!selectedTime) {
			messageDiv.textContent =
				'Veuillez sélectionner une heure avant de réserver.';
		} else {
			const dayOfWeek = moment(selectedDate, 'DD-MM-YYYY').format(
				'DD-MM-YYYY'
			);
			// Utilise selectedTime et dayOfWeek dans réservationData.
			const reservationData = {
				professional_id: professionalId,
				start_time: selectedTime,
				day_of_week: dayOfWeek,
				users_id: clientId,
				service_id: serviceId,
			};
			console.log('data:', reservationData);
			// Envoi d'une requête POST avec les données de la réservation
			fetch('/reservation', {
				method: 'POST',
				body: JSON.stringify(reservationData),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.message === 'Plage horaire déjà réservée') {
						messageDiv.textContent = 'Plage horaire déjà réservée';
					} else {
						const message = `Votre réservation le ${dayOfWeek} à ${selectedTime} a bien été enregistrée`;
						showModal(message);
					}
				})
				.catch((error) => {
					messageDiv.textContent =
						'Erreur lors de la réservation : ' + error.message;
				});
		}
	});
});
