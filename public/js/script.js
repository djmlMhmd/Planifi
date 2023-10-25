document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');
	var professionalId = 1; // ID du professionnel
	var availabilityUrl = '/disponibilite/' + professionalId;
	var reservationsUrl = '/reservations/' + professionalId; // Nouvelle route pour les réservations

	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'timeGridWeek',
		eventSources: [
			{
				url: availabilityUrl,
				method: 'GET',
			},
			{
				url: reservationsUrl,
				method: 'GET',
				extraParams: {
					custom_param: 'value',
				},
				color: 'blue', // Couleur de l'événement
				textColor: 'white', // Couleur du texte de l'événement
				display: 'background', // Affichage de l'événement
				eventContent: function (info) {
					if (info.event.extendedProps) {
						var reservationInfo = info.event.extendedProps;
						var content = document.createElement('div');
						content.textContent =
							'Service: ' + reservationInfo.service_name;
						content.textContent +=
							', Utilisateur: ' + reservationInfo.user_fullName;
						content.textContent +=
							', Professionnel: ' +
							reservationInfo.professional_name;

						const userFullName = reservationInfo.user_fullName;
						if (userFullName) {
							content.textContent +=
								", Nom complet de l'utilisateur: " +
								userFullName;
						} else {
							content.textContent +=
								", Nom complet de l'utilisateur manquant";
						}

						console.log("Infos de l'événement : ", info);
						console.log("Contenu de l'événement : ", content);

						return { domNodes: [content] };
					} else {
						var content = document.createElement('div');
						content.textContent =
							'Données de réservation manquantes ou non définies';
						return { domNodes: [content] };
					}
				},
				eventDidMount: function (info) {
					if (info.event?.def?.publicId === 'error') {
						alert('Erreur lors de la récupération des données');
					}
				},
			},
		],

		headerToolbar: {
			start: false,
			center: 'title',
			end: 'jourButton moisButton semaineButton listeRendezVousButton',
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
		slotLabelFormat: {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		},

		firstDay: 1, // commencer la semaine le lundi
		weekends: true, // afficher le week-end (dimanche)
		locale: 'fr', // utiliser la localisation française
	});

	calendar.render();
});
