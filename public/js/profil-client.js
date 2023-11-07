document.addEventListener('DOMContentLoaded', () => {
	const clientProfileDiv = document.getElementById('client-profile');
	const reservationsListDiv = document.getElementById('reservations-list');
	const navigationLink = document.getElementById('navigation-link');

	let clientID;

	// Ajoutez un gestionnaire d'événements de clic à la balise <a>
	navigationLink.addEventListener('click', (event) => {
		event.preventDefault(); // Empêche le comportement par défaut du lien
		window.location.href = `/navigation.html?clientId=${clientID}`;
	});

	fetch('/profil/client/${clientID}')
		.then((response) => {
			if (!response.ok) {
				throw new Error('La requête a échoué');
			}
			return response.json();
		})
		.then((data) => {
			clientID = data.clientID;
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

	fetch(`/reservations/client`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('La requête a échoué');
			}
			return response.json();
		})
		.then((data) => {
			if (data.length > 0) {
				const reservationsHTML = data
					.map(
						(reservation) => `
                            <p>Réservation : ${reservation.start} - ${reservation.title} (${reservation.service_name})
                            <span class="delete-icon" data-reservation-id="${reservation.id}">&#10006;</span></p>
                        `
					)
					.join('');
				reservationsListDiv.innerHTML = reservationsHTML;
			} else {
				reservationsListDiv.innerHTML = 'Aucune réservation trouvée';
			}
		})
		.catch((error) => {
			console.error(
				'Erreur lors de la récupération des réservations du professionnel :',
				error
			);
		});

	reservationsListDiv.addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-icon')) {
			const reservationId = event.target.getAttribute(
				'data-reservation-id'
			);
			if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
				fetch(`/supprimer-reservation/${reservationId}`, {
					method: 'DELETE',
				})
					.then((response) => {
						if (response.ok) {
							// Actualise la liste des réservations
							fetchAndDisplayReservations();
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
