document.addEventListener('DOMContentLoaded', () => {
	const clientProfileDiv = document.getElementById('client-profile');
	const reservationsListDiv = document.getElementById('reservations-list');
	const navigationLink = document.getElementById('navigation-link');
	loadClientReservations();

	const urlParams = new URLSearchParams(window.location.search);
	let clientID = urlParams.get('clientID');

	const initialClientID = clientID;

	fetch('/profil/client/' + initialClientID)
		.then((response) => {
			if (!response.ok) {
				throw new Error('La requête a échoué');
			}
			return response.json();
		})
		.then((data) => {
			clientID = initialClientID;
			clientProfileDiv.innerHTML = `
                    <h2>Nom : ${data.firstName} ${data.lastName}</h2>
                    <p>Email : ${data.email}</p>
                    <p>Téléphone : ${data.phone}</p>
                `;
		})
		.catch((error) => {
			console.error(
				'Erreur lors de la récupération du profil client:',
				error
			);
		});
	let data;

	function loadClientReservations() {
		fetch(`/reservations/client`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('La requête a échoué');
				}
				return response.json();
			})
			.then((reservationsData) => {
				console.log('Réservations récupérées : ', reservationsData);
				data = reservationsData; // Stockez les réservations dans la variable data

				if (data.length > 0) {
					const reservationsHTML = data
						.map(
							(reservation) => `
                    <p>Réservation : ${reservation.start} - ${reservation.title} (${reservation.service_name})
                    <span class="delete-icon" data-reservation-id="${reservation.reservation_id}">&#10006;</span></p>
                `
						) // Modification ici pour inclure data-reservation-id
						.join('');
					reservationsListDiv.innerHTML = reservationsHTML;
				} else {
					reservationsListDiv.innerHTML =
						'Aucune réservation trouvée';
				}
			})
			.catch((error) => {
				console.error(
					'Erreur lors de la récupération des réservations du professionnel :',
					error
				);
			});
	}

	reservationsListDiv.addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-icon')) {
			const reservationId = event.target.dataset.reservationId;
			console.log(
				'Tentative de suppression de la réservation avec ID : ',
				reservationId
			);
			if (
				reservationId &&
				confirm('Voulez-vous vraiment supprimer cette réservation ?')
			) {
				fetch(`/supprimer-reservation/${reservationId}`, {
					method: 'DELETE',
				})
					.then((response) => {
						if (response.status === 204) {
							alert(
								'La réservation a été supprimée avec succès.'
							);
							loadClientReservations();
						} else {
							console.error(
								'Échec de la suppression de la réservation'
							);
						}
					})
					.catch((error) => {
						console.error(
							'Erreur lors de la suppression de la réservation:',
							error
						);
					});
			}
		}
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
});
