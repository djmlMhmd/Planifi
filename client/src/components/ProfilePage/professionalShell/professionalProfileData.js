export const plannerDays = [
	{
		id: 'day-1',
		label: 'Vendredi',
		dayNumber: '20',
		appointments: [
			{ id: 'appt-1', service: 'Brushing', client: 'Chloé Ritel', time: '09:00 - 11:00' },
			{ id: 'appt-2', service: 'Boucle', client: 'Vanessa Trio', time: '13:00 - 15:00' },
			{ id: 'appt-3', service: 'Lissage', client: 'Rebecca Eart', time: '15:40 - 18:00' },
		],
	},
	{
		id: 'day-2',
		label: 'Samedi',
		dayNumber: '21',
		appointments: [
			{ id: 'appt-4', service: 'Coupe', client: 'Ariane Lopes', time: '10:00 - 11:30' },
			{ id: 'appt-5', service: 'Barbe', client: 'Karim Ben Ali', time: '12:30 - 13:30' },
		],
	},
	{
		id: 'day-3',
		label: 'Dimanche',
		dayNumber: '22',
		appointments: [
			{ id: 'appt-6', service: 'Soin', client: 'Mila Roussel', time: '11:00 - 12:00' },
			{ id: 'appt-7', service: 'Coloration', client: 'Zoé Lambert', time: '14:00 - 16:00' },
			{ id: 'appt-8', service: 'Lissage', client: 'Ines Martin', time: '16:30 - 18:00' },
		],
	},
];

export const dailyStats = [
	{ label: 'Honorés', value: 11, color: '#1e1f25', textColor: '#1e1f25' },
	{ label: 'Annulés', value: 2, color: '#8f99ab', textColor: '#5d6777' },
	{ label: 'Rdv total', value: 17, color: '#c9d3e4', textColor: '#6b7485' },
];

export const tips = [
	{ title: 'Soignez vos photos', body: 'Les prestataires avec des photos de qualité reçoivent jusqu\'à 3× plus de réservations.', img: '/src/assets/tips-person.png' },
	{ title: 'Répondez rapidement', body: 'Un temps de réponse court améliore votre positionnement dans les résultats de recherche.', img: '/src/assets/tips-2.png' },
	{ title: 'Disponibilités à jour', body: 'Mettez à jour vos créneaux régulièrement pour rester visible et éviter les annulations.', img: '/src/assets/tips-3.png' },
	{ title: 'Demandez des avis', body: 'Après chaque prestation, invitez vos clients à laisser un avis pour renforcer votre crédibilité.', img: '/src/assets/tips-4.png' },
	{ title: 'Profil complet', body: 'Un profil renseigné à 100 % apparaît en priorité dans les suggestions Prestat.', img: '/src/assets/tips-5.png' },
];

export const newsItems = [
	{ tag: 'Fonctionnalité', date: 'Juin 2025', title: 'Réservation instantanée', body: 'Les clients peuvent désormais réserver sans confirmation manuelle de votre part.' },
	{ tag: 'Amélioration', date: 'Mai 2025', title: 'Nouveau tableau de bord', body: 'Statistiques enrichies et graphiques d\'évolution annuelle disponibles.' },
	{ tag: 'Correction', date: 'Avr. 2025', title: 'Notifications push', body: 'Les rappels de RDV sont maintenant envoyés 24 h à l\'avance.' },
	{ tag: 'Fonctionnalité', date: 'Mar. 2025', title: 'Messagerie intégrée', body: 'Échangez directement avec vos clients depuis votre espace professionnel.' },
	{ tag: 'Amélioration', date: 'Fév. 2025', title: 'Photos de profil', body: 'Ajoutez jusqu\'à 6 photos pour illustrer vos prestations.' },
];

export const initialServiceTiles = [
	{ id: 'srv-main', title: 'Brushing', price: '70€', description: '', large: true },
	{ id: 'srv-2', title: 'Coloration', price: '', description: '' },
	{ id: 'srv-3', title: 'Lissage', price: '', description: '' },
];

export function buildDocumentItems(companyName) {
	return [`FACTURE - ${companyName} - Avril.pdf`, `DEVIS - ${companyName} - Mai.pdf`];
}
