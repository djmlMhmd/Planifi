document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');

	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'timeGridWeek',
		eventSources: [
			{
				url: 'http://localhost:3000/reservations/1',
				method: 'GET',
				extraParams: {
					custom_param: 'value',
				},
				color: 'red', // Couleur de l'événement
				textColor: 'white', // Couleur du texte de l'événement
				//display: 'background', // Affichage de l'événement
			},

			fetch('http://localhost:3000/service') // Assurez-vous que l'URL de l'API est correcte
				.then((response) => response.json())
				.then((services) => {
					// Traitez les données des services reçues de l'API
					services.forEach((service) => {
						const listItem = document.createElement('li');
						listItem.innerHTML = `
                    <strong>Service: </strong>${service.service_name}<br>
                    <strong>Description: </strong>${service.service_description}<br>
                    <strong>Prix: </strong>${service.service_price} €<br>
                    <strong>Durée: </strong>${service.duration} minutes<br>
                    <strong>Professionnel: </strong>${service.email}<br>
                    <strong>Téléphone: </strong>${service.phone}<br>
                    <strong>Entreprise: </strong>${service.company_name}<br>
                    <strong>Adresse: </strong>${service.company_address}<br><br>
                `;
						servicesList.appendChild(listItem);
					});
				})
				.catch((error) => {
					console.error(
						'Erreur lors de la récupération des services:',
						error
					);
				}),
		],

		headerToolbar: {
			start: 'prev next',
			center: 'title',
			end: 'today jourButton moisButton semaineButton listeRendezVousButton',
		},

		customButtons: {
			jourButton: {
				text: 'Jour',
				click: function () {
					calendar.changeView('timeGridDay');
				},
			},
			moisButton: {
				text: 'Mois',
				click: function () {
					calendar.changeView('dayGridMonth');
				},
			},

			semaineButton: {
				text: 'Semaine',
				click: function () {
					calendar.changeView('timeGridWeek');
				},
			},

			today: {
				text: "Aujourd'hui",
			},

			listeRendezVousButton: {
				text: 'Liste',
				click: function () {
					// Ajouter ici le code pour afficher la liste des rendez-vous

					alert('Afficher la liste des rendez-vous');
				},
			},
		},

		allDaySlot: false,
		slotMinTime: '08:00:00', // l'heure de début à 08:00
		slotMaxTime: '22:00:00', // l'heure de fin à 21:00
		slotDuration: '00:30:00',
		slotLabelFormat: {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		},

		eventClick: function (info) {
			var service = info.event.extendedProps.reservation.service_id;
			var client = info.event.title;
			var professinal =
				info.event.extendedProps.reservation.professional_name;

			$('#eventModalTitle').text("Détails de l'événement");
			$('#eventModalContent').html(
				'Client: ' +
					client +
					'<br> Service: ' +
					service +
					'<br>Professionnel: ' +
					professinal
			);
			$('#eventModal').modal('show');
		},

		firstDay: 1, // commencer la semaine le lundi
		weekends: true, // afficher le week-end (dimanche)
		locale: 'fr', // utiliser la localisation française
	});

	calendar.render();
});
