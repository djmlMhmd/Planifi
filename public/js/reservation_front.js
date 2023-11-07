document.addEventListener('DOMContentLoaded', function () {
	const clientId = '<%= req.session.clientID %>';
	const urlParams = new URLSearchParams(window.location.search);
	const professionalId = urlParams.get('professionalId');
	const serviceId = urlParams.get('serviceId');
	console.log('id:', clientId);
	console.log('id pro', professionalId);
	console.log('id service:', serviceId);

	const dateInput = document.getElementById('date');
	const timeInput = document.getElementById('time');
	const reserveButton = document.getElementById('reserve-button');
	const messageDiv = document.getElementById('message');

	// clic sur le bouton "Réserver"
	reserveButton.addEventListener('click', function () {
		const selectedDate = dateInput.value;
		const selectedTime = timeInput.value;

		fetch(
			`/availability/${professionalId}/${moment(selectedDate).format(
				'dddd'
			)}`,
			{ method: 'GET' }
		)
			.then((response) => response.json())
			.then((availableHours) => {
				// Définir l'ID de disponibilité par défaut comme la première heure disponible.
				const defaultAvailabilityId =
					availableHours.length > 0 ? 1 : null;

				// Utilisez defaultAvailabilityId dans votre réservationData.
				const reservationData = {
					professional_id: professionalId,
					start_time: selectedTime,
					day_of_week: moment(selectedDate).format('dddd'), // Convertir la date en jour de la semaine
					users_id: clientId,
					service_id: serviceId,
					default_availability_id: defaultAvailabilityId,
				};

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
						messageDiv.textContent =
							'Réservation effectuée avec succès';
					})
					.catch((error) => {
						messageDiv.textContent =
							'Erreur lors de la réservation : ' + error.message;
					});
			})
			.catch((error) => {
				messageDiv.textContent =
					'Erreur lors de la récupération des disponibilités : ' +
					error.message;
			});
	});
});
