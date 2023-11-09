document.addEventListener('DOMContentLoaded', function () {
	const clientId = getCookie('clientID');
	const urlParams = new URLSearchParams(window.location.search);
	const professionalId = urlParams.get('professionalId');
	const serviceId = parseInt(urlParams.get('serviceId'), 10);

	console.log('id:', clientId);
	console.log('id pro', professionalId);
	console.log('id service:', serviceId);

	const dateInput = document.getElementById('date');
	const showHoursButton = document.getElementById('show-hours-button');
	const hoursTable = document.getElementById('hours-table');
	const reserveButton = document.getElementById('reserve-button');
	const messageDiv = document.getElementById('message');
	let selectedTime = ''; // Stockez l'heure sélectionnée

	/*fetch(`/service/${serviceId}`, { method: 'GET' })
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
		});*/

	showHoursButton.addEventListener('click', function () {
		hoursTable.innerHTML = ''; // Efface le tableau précédent

		// Effectuez la requête pour récupérer les heures réservées ici
		fetch('/reservedHours', { method: 'GET' })
			.then((response) => response.json())
			.then((reservedHours) => {
				const heuresReservees = reservedHours;

				// Créez un tableau d'heures de 08h à 21h
				const availableHours = [];
				for (let hour = 8; hour <= 21; hour++) {
					availableHours.push(
						`${hour.toString().padStart(2, '0')}:00`
					);
				}

				// Créez un tableau pour afficher les heures
				const table = document.createElement('table');
				const tbody = document.createElement('tbody');

				availableHours.forEach((hour) => {
					const button = document.createElement('button');
					button.textContent = hour;
					button.addEventListener('click', function () {
						selectedTime = hour; // Stockez l'heure sélectionnée
					});

					const row = document.createElement('tr');
					const cell = document.createElement('td');
					cell.appendChild(button);
					row.appendChild(cell);
					tbody.appendChild(row);

					// Vérifiez si l'heure est déjà réservée
					if (heuresReservees.includes(hour)) {
						button.disabled = true; // Désactive le bouton
					}
				});
				table.appendChild(tbody);
				hoursTable.appendChild(table);
			});
	});

	// clic sur le bouton "Réserver"
	reserveButton.addEventListener('click', function () {
		const selectedDate = moment(dateInput.value).format('DD-MM-YYYY');

		const dayOfWeek = moment(selectedDate, 'DD-MM-YYYY').format(
			'DD-MM-YYYY'
		);
		// Utilisez selectedTime et dayOfWeek dans votre réservationData.
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
					messageDiv.textContent =
						'Réservation effectuée avec succès';
				}
			})
			.catch((error) => {
				messageDiv.textContent =
					'Erreur lors de la réservation : ' + error.message;
			});
	});
});
