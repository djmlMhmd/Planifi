import navigationPlaceholder from '../assets/navigation-placeholder.jpg';
import providerGalleryOne from '../assets/provider-gallery-1.jpg';
import providerGalleryTwo from '../assets/provider-gallery-2.jpg';

export const providers = [
	{
		id: 'tressa',
		company: 'TRESSA COIFFURE',
		location: '[localisation]',
		rating: '5,0',
		reviews: 150,
		policy:
			'Politique de prestation : les rendez-vous peuvent etre modifies jusqu a 24h avant le passage. Toute annulation tardive peut entrainer des frais. Les demandes specifiques sont confirmees avant validation.',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
		news:
			'Nouvelle collection de soins signature disponible cette semaine. Les rendez-vous du samedi partent vite, pensez a reserver en avance.',
		contact: '[nom prénom - mail@mail.com - 06123456789]',
		socials: [
			{ id: 'instagram', label: 'Instagram', href: '#' },
			{ id: 'tiktok', label: 'TikTok', href: '#' },
			{ id: 'link', label: 'Site', href: '#' },
		],
		slots: [
			{
				label: 'Matin',
				days: [
					{ label: 'Lun.24', active: false },
					{ label: 'Mar.25', active: false },
					{ label: 'Mer.26', active: true },
				],
			},
			{
				label: 'Midi',
				days: [
					{ label: 'Lun.24', active: true },
					{ label: 'Mar.25', active: false },
					{ label: 'Mer.26', active: true },
				],
			},
		],
		gallery: [
			{ id: 'g1', image: providerGalleryOne, alt: 'Coiffure en cours' },
			{ id: 'g2', image: providerGalleryTwo, alt: 'Materiel de coiffure' },
			{ id: 'g3', image: navigationPlaceholder, alt: 'Salon de coiffure' },
		],
		services: [
			{
				id: 'srv-1',
				name: 'Brushing',
				duration: '2h',
				price: '70€',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...',
			},
			{
				id: 'srv-2',
				name: 'Brushing',
				duration: '2h',
				price: '70€',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...',
			},
			{
				id: 'srv-3',
				name: 'Brushing',
				duration: '2h',
				price: '70€',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...',
			},
			{
				id: 'srv-4',
				name: 'Brushing',
				duration: '2h',
				price: '70€',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...',
			},
		],
		hours: [
			['Lundi', '09:00 - 18:00'],
			['Mardi', '09:00 - 18:00'],
			['Mercredi', '09:00 - 18:00'],
			['Jeudi', '09:00 - 18:00'],
			['Vendredi', '09:00 - 18:00'],
			['Samedi', 'Fermé'],
		],
	},
	{
		id: 'atelier',
		company: 'ATELIER SIGNATURE',
		location: '[localisation]',
		rating: '4,9',
		reviews: 98,
		policy:
			'Politique de prestation : les rendez-vous peuvent etre modifies jusqu a 24h avant le passage. Merci de prevenir en cas de retard.',
		description:
			'Atelier Signature propose des prestations premium dans un cadre calme et lumineux. Chaque rendez-vous est pense pour offrir une experience soignee, avec une attention particuliere portee aux details et au confort du client.',
		news:
			'Ouverture de nouveaux creneaux en fin de journee a partir de la semaine prochaine.',
		contact: '[nom prénom - mail@mail.com - 06123456789]',
		socials: [
			{ id: 'instagram', label: 'Instagram', href: '#' },
			{ id: 'tiktok', label: 'TikTok', href: '#' },
			{ id: 'link', label: 'Site', href: '#' },
		],
		slots: [
			{
				label: 'Matin',
				days: [
					{ label: 'Lun.24', active: true },
					{ label: 'Mar.25', active: false },
					{ label: 'Mer.26', active: false },
				],
			},
			{
				label: 'Midi',
				days: [
					{ label: 'Lun.24', active: true },
					{ label: 'Mar.25', active: true },
					{ label: 'Mer.26', active: false },
				],
			},
		],
		gallery: [
			{ id: 'g1', image: providerGalleryTwo, alt: 'Outils professionnels' },
			{ id: 'g2', image: providerGalleryOne, alt: 'Coiffure en cours' },
			{ id: 'g3', image: navigationPlaceholder, alt: 'Salon de coiffure' },
		],
		services: [
			{ id: 'srv-1', name: 'Coupe', duration: '1h30', price: '55€', description: 'Prestation signature pour une coupe nette et un coiffage elegant.' },
			{ id: 'srv-2', name: 'Coloration', duration: '2h', price: '95€', description: 'Couleur personnalisee et finition soignee pour un rendu lumineux.' },
		],
		hours: [
			['Lundi', '09:00 - 18:00'],
			['Mardi', '09:00 - 18:00'],
			['Mercredi', '09:00 - 18:00'],
			['Jeudi', '09:00 - 18:00'],
			['Vendredi', '09:00 - 18:00'],
			['Samedi', 'Fermé'],
		],
	},
	{
		id: 'maison',
		company: 'MAISON LUMIERE',
		location: '[localisation]',
		rating: '5,0',
		reviews: 212,
		policy:
			'Politique de prestation : un acompte peut etre demande avant validation. Les prestations a domicile sont confirmees par message.',
		description:
			'Maison Lumiere accompagne ses clientes sur des prestations plus longues et plus detaillees, avec un suivi personnalise et un accompagnement avant rendez-vous.',
		news:
			'Nouveaux forfaits evenementiels disponibles pour les week-ends et les grandes occasions.',
		contact: '[nom prénom - mail@mail.com - 06123456789]',
		socials: [
			{ id: 'instagram', label: 'Instagram', href: '#' },
			{ id: 'tiktok', label: 'TikTok', href: '#' },
			{ id: 'link', label: 'Site', href: '#' },
		],
		slots: [
			{
				label: 'Matin',
				days: [
					{ label: 'Lun.24', active: false },
					{ label: 'Mar.25', active: true },
					{ label: 'Mer.26', active: true },
				],
			},
			{
				label: 'Midi',
				days: [
					{ label: 'Lun.24', active: false },
					{ label: 'Mar.25', active: true },
					{ label: 'Mer.26', active: true },
				],
			},
		],
		gallery: [
			{ id: 'g1', image: navigationPlaceholder, alt: 'Salon de coiffure' },
			{ id: 'g2', image: providerGalleryOne, alt: 'Coiffure en cours' },
			{ id: 'g3', image: providerGalleryTwo, alt: 'Outils professionnels' },
		],
		services: [
			{ id: 'srv-1', name: 'Balayage', duration: '2h30', price: '120€', description: 'Technique lumineuse pour un resultat naturel et un rendu sur mesure.' },
			{ id: 'srv-2', name: 'Soin profond', duration: '1h', price: '40€', description: 'Soin reparateur adapte a la nature du cheveu et a ses besoins.' },
		],
		hours: [
			['Lundi', '09:00 - 18:00'],
			['Mardi', '09:00 - 18:00'],
			['Mercredi', '09:00 - 18:00'],
			['Jeudi', '09:00 - 18:00'],
			['Vendredi', '09:00 - 18:00'],
			['Samedi', 'Fermé'],
		],
	},
];

export function getProviderById(providerId) {
	return providers.find((provider) => provider.id === providerId) ?? providers[0];
}

export function getProviderAndService(providerId, serviceId) {
	const provider = getProviderById(providerId);
	const service = provider.services.find((item) => item.id === serviceId) ?? provider.services[0];
	return { provider, service };
}
