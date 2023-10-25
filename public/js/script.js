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

			$('#eventModalTitle').text('Détails de lévénement');
			$('#eventModalContent').html(
				'Client:' +
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
