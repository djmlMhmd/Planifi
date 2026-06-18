import favoritesPlaceholder from '../../../assets/favorites-placeholder.jpg';

export const reviewCards = ['Prestige Services', 'Élite Solutions', 'Pro Connect', 'Services Faciles'];

export const favoriteNewsItems = [
	{
		id: 'news-1',
		company: 'Prestige Services',
		title: 'Fermeture exceptionnelle',
		body: 'Votre institut sera fermé exceptionnellement ce samedi pour travaux et réouverture lundi matin.',
		image: favoritesPlaceholder,
	},
	{
		id: 'news-2',
		company: 'Pro Connect',
		title: 'Offre : -10% sur nos prestations',
		body: 'Nouvelle offre de rentrée réservée aux clients fidèles, valable sur une sélection de prestations.',
		image: favoritesPlaceholder,
	},
];

export function buildInvoiceItems(profile) {
	return [
		`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestation].pdf`,
		`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestataire].pdf`,
		`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Accompagnement].pdf`,
	];
}

export function buildQuoteItems(profile) {
	return [
		`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Brushing].pdf`,
		`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Mise en beauté].pdf`,
		`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Coiffure évènement].pdf`,
	];
}

export function buildFallbackReservations() {
	return [
		{ reservation_id: 'demo-1', service_name: 'Massage bien-être', title: 'RelaxChezVous', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-2', service_name: 'Cours de yoga', title: 'Zen à la Maison', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-3', service_name: 'Soin du visage', title: 'Beauté Nomade', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-4', service_name: 'Soutien scolaire', title: 'Prof à Votre Porte', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-5', service_name: 'Réparation info', title: 'TechFix Mobile', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-6', service_name: 'Pet-sitting', title: 'Toutou Services', start: 'Vendredi 20 14:00 - 15:30' },
		{ reservation_id: 'demo-7', service_name: 'Coaching perso', title: 'Fit&Go Domicile', start: 'Vendredi 20 14:00 - 15:30' },
	];
}
