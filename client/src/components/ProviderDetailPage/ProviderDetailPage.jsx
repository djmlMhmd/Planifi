import { useEffect, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import navigationPlaceholder from '../../assets/navigation-placeholder.jpg';
import { getProviderById } from '../../data/providers';
import { navigateTo } from '../../lib/navigation';

function formatBackendDuration(duration) {
	// Le backend peut me renvoyer un interval PostgreSQL, donc je le normalise avant affichage.
	if (!duration) {
		return '1h';
	}

	if (typeof duration === 'object') {
		const hours = Number(duration.hours) || 0;
		const minutes = Number(duration.minutes) || 0;

		if (hours && minutes) return `${hours}h${String(minutes).padStart(2, '0')}`;
		if (hours) return `${hours}h`;
		if (minutes) return `${minutes}min`;
		return '1h';
	}

	const parts = String(duration).split(':');
	if (parts.length >= 2) {
		const hours = Number(parts[0]) || 0;
		const minutes = Number(parts[1]) || 0;

		if (hours && minutes) return `${hours}h${String(minutes).padStart(2, '0')}`;
		if (hours) return `${hours}h`;
		if (minutes) return `${minutes}min`;
	}

	return String(duration);
}

function formatBackendPrice(price) {
	// Je garde un affichage simple et homogène pour les prix côté UI.
	const amount = Number(price);

	if (Number.isNaN(amount)) {
		return price || '--';
	}

	return Number.isInteger(amount) ? `${amount}€` : `${amount.toFixed(2)}€`;
}

function buildBackendProvider(professionalId, serviceRows) {
	// Ici je reconstruis un objet compatible avec la page prestataire à partir des lignes SQL.
	const firstRow = serviceRows[0];

	if (!firstRow) {
		return null;
	}

	return {
		id: String(professionalId),
		company: firstRow.company_name,
		location: firstRow.company_address || '[localisation]',
		rating: '5,0',
		reviews: serviceRows.length * 18 + 24,
		policy: 'Réservation en ligne disponible. Les informations détaillées de ce prestataire seront enrichies depuis son profil professionnel.',
		description: `Découvrez ${firstRow.company_name}, un prestataire disponible à ${firstRow.company_address || 'son adresse professionnelle'}. Les informations publiques détaillées sont en cours de synchronisation avec le profil professionnel.`,
		news: 'Ce prestataire propose maintenant la réservation en ligne directement depuis Prestat.',
		contact: '[nom prénom - mail@mail.com - 06123456789]',
		socials: [
			{ id: 'instagram', label: 'Instagram', href: '#' },
			{ id: 'tiktok', label: 'TikTok', href: '#' },
			{ id: 'link', label: 'Site', href: '#' },
		],
		gallery: [
			{ id: 'g1', image: navigationPlaceholder, alt: firstRow.company_name },
			{ id: 'g2', image: navigationPlaceholder, alt: `${firstRow.company_name} - vue 2` },
			{ id: 'g3', image: navigationPlaceholder, alt: `${firstRow.company_name} - vue 3` },
		],
		services: serviceRows.map((serviceRow) => ({
			id: String(serviceRow.service_id),
			name: serviceRow.service_name,
			duration: formatBackendDuration(serviceRow.duration),
			price: formatBackendPrice(serviceRow.service_price),
			description: serviceRow.service_description || 'Description à venir.',
		})),
		hours: [
			['Lundi', '09:00 - 18:00'],
			['Mardi', '09:00 - 18:00'],
			['Mercredi', '09:00 - 18:00'],
			['Jeudi', '09:00 - 18:00'],
			['Vendredi', '09:00 - 18:00'],
			['Samedi', 'Fermé'],
		],
	};
}

function SearchIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
			<path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function MessageIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 6.5H19V15.5H10L6 19V15.5H5V6.5Z" fill="currentColor" />
		</svg>
	);
}

function HistoryIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 12A8 8 0 1 0 7 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 4V9H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function BellIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M12 4.8A4.2 4.2 0 0 0 7.8 9V11.1C7.8 12.1 7.45 13.08 6.8 13.84L5.6 15.25C5.22 15.7 5.54 16.4 6.13 16.4H17.87C18.46 16.4 18.78 15.7 18.4 15.25L17.2 13.84A4.2 4.2 0 0 1 16.2 11.1V9A4.2 4.2 0 0 0 12 4.8Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<path d="M10.2 18C10.55 18.64 11.21 19 12 19C12.79 19 13.45 18.64 13.8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function CalendarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="4.2" y="5.7" width="15.6" height="14.1" rx="2.6" stroke="currentColor" strokeWidth="1.8" />
			<path d="M8 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M16 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4.2 9.2H19.8" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	);
}

function BookmarkIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
		</svg>
	);
}

function PinIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M12 20C12 20 18 14.5 18 10.2A6 6 0 1 0 6 10.2C6 14.5 12 20 12 20Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<circle cx="12" cy="10.2" r="2.1" fill="currentColor" />
		</svg>
	);
}

function StarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
			<path
				d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function VerifiedBadge({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path fill="#c5a96a" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" />
			<path fill="#fff" d="M10.4 15.3 7.1 12l1.3-1.3 2 2 4.2-4.2 1.3 1.3z" />
		</svg>
	);
}

function SocialIcon({ kind }) {
	if (kind === 'instagram') {
		return (
			<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
				<rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
				<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
				<circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
			</svg>
		);
	}
	if (kind === 'tiktok') {
		return (
			<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
				<path d="M14 4V13.2A3.8 3.8 0 1 1 10.8 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M14 4C14.8 5.8 16.3 7 18.4 7.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
			<path d="M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M8.5 16.5L6.8 18.2A3 3 0 1 1 2.6 14l2.1-2.1A3 3 0 0 1 9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M15 13A3 3 0 0 1 19.3 13.1l2.1 2.1A3 3 0 1 1 17.2 19.4L15.5 17.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

function UserAvatar({ profile }) {
	// Si l'utilisateur n'a pas de photo, je bascule sur un avatar à initiales.
	const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Bob Alves';
	const initials =
		`${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() ||
		displayName.trim().charAt(0).toUpperCase();

	return (
		<div className="flex items-center gap-3">
			{profile?.profile_picture ? (
				<div className="h-14 w-14 overflow-hidden rounded-full">
					<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
				</div>
			) : (
				<div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] text-[1.1rem] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)]">
					{initials}
				</div>
			)}
			<p className="text-[0.98rem] font-medium text-[#202020]">{displayName}</p>
		</div>
	);
}

function ServiceCard({ service, providerId, onOpenDetails }) {
	return (
		<div className="flex h-full w-full max-w-[480px] flex-col gap-2.5">
			<h3 className="px-1 text-[1.1rem] font-semibold tracking-[-0.03em] text-[#191919]">{service.name}</h3>

			<button
				type="button"
				onClick={() => onOpenDetails(service)}
				// La carte ouvre le détail complet, mais le bouton garde sa propre navigation de réservation.
				className="relative w-full rounded-[22px] border border-black/8 bg-white px-4 pb-4 pt-4 text-left shadow-[0_18px_42px_rgba(17,19,30,0.04)] transition hover:-translate-y-px hover:shadow-[0_20px_44px_rgba(17,19,30,0.055)]"
			>
				<span className="absolute right-4 top-4 text-[0.98rem] font-medium text-[#c7c7c7]">{service.duration}</span>
				<div className="flex items-start gap-6">
					<div className="flex w-[108px] shrink-0 flex-col items-center">
						<div className="h-[108px] w-[108px] rounded-[14px] bg-[linear-gradient(135deg,#aba79c_0%,#7c786f_100%)]" />
						<p
							className="mt-3 text-center text-[2.05rem] tracking-[-0.045em] text-[#161616]"
							style={{ fontFamily: '"TAN Meringue", "Iowan Old Style", "Times New Roman", serif' }}
						>
							{service.price}
						</p>
					</div>
					<div className="flex min-h-[156px] flex-1 flex-col justify-between pt-8">
						<p
							className="max-w-[24ch] text-[0.96rem] leading-[1.7] text-black/64"
							style={{
								display: '-webkit-box',
								WebkitLineClamp: 3,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
							}}
						>
							{service.description}
						</p>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								navigateTo(`/app/reservation?professionalId=${providerId}&serviceId=${service.id}`);
							}}
							className="mt-6 inline-flex items-center justify-center self-center rounded-[14px] bg-[linear-gradient(135deg,#181818_0%,#343434_100%)] px-6 py-[0.9rem] text-[0.94rem] font-medium text-white shadow-[0_10px_22px_rgba(22,22,22,0.14)] transition hover:-translate-y-px hover:opacity-92"
						>
							Prendre RDV
						</button>
					</div>
				</div>
			</button>
		</div>
	);
}

export default function ProviderDetailPage() {
	// Je garde ici uniquement l'état utile à la page et à ses modales.
	const [profile, setProfile] = useState(null);
	const [backendProvider, setBackendProvider] = useState(null);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [activePhotoIndex, setActivePhotoIndex] = useState(0);
	const [selectedService, setSelectedService] = useState(null);
	const search = window.location.search;
	const searchParams = new URLSearchParams(search);
	const [showConfirmation, setShowConfirmation] = useState(() => searchParams.get('confirmed') === '1');
	const providerId = searchParams.get('professionalId') || 'tressa';
	const isBackendProviderId = /^[0-9]+$/.test(providerId);
	const provider = backendProvider || (!isBackendProviderId ? getProviderById(providerId) : null);
	const confirmedDate = searchParams.get('date') || '[date]';
	const confirmedTime = searchParams.get('time') || '[heure]';

	useEffect(() => {
		// Je charge le profil connecté pour alimenter la navbar / l'avatar.
		let cancelled = false;

		async function loadProfile() {
			try {
				const response = await fetch('/profil', { credentials: 'same-origin' });
				if (!response.ok) return;
				const payload = await response.json();
				if (!cancelled && payload?.message) {
					setProfile(payload.message);
				}
			} catch {
				// ignore
			}
		}

		loadProfile();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		// Si l'id vient du backend, je reconstruis toute la page prestataire depuis les services SQL.
		if (!isBackendProviderId) {
			setBackendProvider(null);
			return undefined;
		}

		let cancelled = false;

		async function loadBackendProvider() {
			try {
				const response = await fetch(`/service/${providerId}/liste`, { credentials: 'same-origin' });
				if (!response.ok) {
					return;
				}

				const payload = await response.json();
				const nextProvider = buildBackendProvider(providerId, payload?.message || []);

				if (!cancelled) {
					setBackendProvider(nextProvider);
				}
			} catch {
				// On garde un écran vide si le backend ne répond pas.
			}
		}

		loadBackendProvider();
		return () => {
			cancelled = true;
		};
	}, [isBackendProviderId, providerId]);

	useEffect(() => {
		// Je resynchronise l'état de confirmation quand l'URL change après une réservation.
		setShowConfirmation(searchParams.get('confirmed') === '1');
	}, [search]);

	useEffect(() => {
		// J'écoute le clavier seulement quand la galerie est ouverte.
		if (!provider) return undefined;
		if (!isGalleryOpen) return undefined;

		function handleKeyDown(event) {
			if (event.key === 'Escape') {
				setIsGalleryOpen(false);
			}
			if (event.key === 'ArrowRight') {
				setActivePhotoIndex((value) => (value + 1) % provider.gallery.length);
			}
			if (event.key === 'ArrowLeft') {
				setActivePhotoIndex((value) => (value - 1 + provider.gallery.length) % provider.gallery.length);
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isGalleryOpen, provider]);

	function openGallery(index) {
		// J'ouvre la galerie directement sur la photo cliquée.
		setActivePhotoIndex(index);
		setIsGalleryOpen(true);
	}

	function showNextPhoto() {
		setActivePhotoIndex((value) => (value + 1) % provider.gallery.length);
	}

	function showPreviousPhoto() {
		// Navigation circulaire pour ne jamais bloquer l'utilisateur en bout de galerie.
		setActivePhotoIndex((value) => (value - 1 + provider.gallery.length) % provider.gallery.length);
	}

	if (!provider) {
		return null;
	}

	return (
		<main className="min-h-screen animate-[pageEnter_280ms_cubic-bezier(0.22,1,0.36,1)] bg-[linear-gradient(180deg,#faf9f5_0%,#ffffff_44%,#f3f1eb_100%)] text-[#1b1b1d]">
			<section className="px-4 pb-14 pt-6 xl:px-8">
				<div className="mx-auto w-full max-w-[1480px]">
					<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-5">
							<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dbc78f] bg-white shadow-[0_16px_34px_rgba(17,19,30,0.04)]">
								<div className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2ecdd] text-[#6a5a34]">
									<BookmarkIcon className="h-[18px] w-[18px]" />
								</div>
								<svg viewBox="0 0 64 64" className="h-20 w-20 text-[#cfb16d]" fill="none" aria-hidden="true">
									<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
									<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
									<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
									<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
								</svg>
							</div>

							<div className="pt-2">
								<h1 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#181818]">{provider.company}</h1>
								<div className="mt-3 flex items-center gap-2 text-[1rem] font-medium text-[#1f1f1f]">
									<PinIcon className="h-[18px] w-[18px]" />
									<span>{provider.location}</span>
								</div>
								<div className="mt-2 flex items-center gap-2 text-[0.95rem] text-black/68">
									<StarIcon className="h-4 w-4" />
									<span>{provider.rating}</span>
									<span className="text-black/42">({provider.reviews} avis)</span>
								</div>
								<div className="mt-2 flex items-center gap-2 text-[0.96rem] text-black/48">
									<VerifiedBadge className="h-[18px] w-[18px]" />
									<span>utilisateur vérifié</span>
								</div>
							</div>
						</div>
					</div>

					<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
						<div className="min-w-0">
							<section>
								<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Vitrine photo</h2>
									<div className="flex flex-wrap gap-4">
										{provider.gallery.map((photo, index) => (
											<button
												key={photo.id}
												type="button"
												onClick={() => openGallery(index)}
												className="group relative aspect-square w-[168px] overflow-hidden rounded-[22px] border border-black/6 bg-white shadow-[0_14px_34px_rgba(17,19,30,0.04)] sm:w-[182px] lg:w-[196px] xl:w-[210px]"
											>
											<img src={photo.image} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
											{index === 2 ? (
												<div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.55)_100%)] text-[1.05rem] font-medium text-white">
													Voir les autres photos
												</div>
											) : null}
										</button>
									))}
								</div>
							</section>

							<section className="mt-10">
								<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Prestation</h2>
								<div className="grid gap-6 md:auto-rows-fr md:grid-cols-2">
									{provider.services.map((service) => (
										<ServiceCard key={service.id} service={service} providerId={provider.id} onOpenDetails={setSelectedService} />
									))}
								</div>
							</section>

							<section className="mt-10">
								<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Descriptions</h2>
								<div className="rounded-[26px] border border-black/8 bg-white p-7 text-[1rem] leading-8 text-black/66 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
									{provider.description.split('\n\n').map((paragraph) => (
										<p key={paragraph} className="mb-6 last:mb-0">{paragraph}</p>
									))}
								</div>
								<div className="mt-8 flex flex-wrap gap-8 text-[1rem] font-medium text-[#7b6335]">
									<a href="#" className="transition hover:text-[#5f4b26]">&gt; Demander un devis</a>
									<a href="#" className="transition hover:text-[#5f4b26]">&gt; Demander une facture</a>
								</div>
							</section>
						</div>

						<aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
							<div className="overflow-hidden rounded-[26px] border border-black/8 bg-white p-4 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<div className="relative h-[240px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#efe5c7_0%,#dad7cf_40%,#f1efe8_100%)]">
									<div className="absolute inset-0 opacity-75" style={{ backgroundImage: 'linear-gradient(#ffffff99 1px, transparent 1px), linear-gradient(90deg, #ffffff99 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
									<div className="absolute left-[12%] top-[12%] h-[260px] w-[10px] rotate-[32deg] rounded-full bg-[#d6bb6f]" />
									<div className="absolute left-[35%] top-[8%] h-[220px] w-[6px] rotate-[76deg] rounded-full bg-[#c8c4bb]" />
									<div className="absolute right-[18%] top-[20%] h-[190px] w-[6px] rotate-[22deg] rounded-full bg-[#9eb5d8]" />
									<div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#c7612f] text-white shadow-[0_14px_30px_rgba(199,97,47,0.28)]">
										<PinIcon className="h-7 w-7" />
									</div>
								</div>
							</div>

							<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Politique de prestation</h3>
								<p className="mt-5 text-[0.96rem] leading-7 text-black/62">{provider.policy}</p>
								<a href="#" className="mt-5 inline-block font-medium text-[#7b6335] transition hover:text-[#5f4b26]">&gt; En savoir plus</a>
							</div>

							<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Actualités</h3>
								<p className="mt-5 text-[0.96rem] leading-7 text-black/62">{provider.news}</p>
							</div>

							<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Horaires d’ouvertures</h3>
								<div className="mt-6 overflow-hidden rounded-[16px] border border-black/6">
									{provider.hours.map(([day, hours]) => (
										<div key={day} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/6 px-5 py-3.5 text-[1rem] last:border-b-0">
											<span className="text-[#2c2c2c]">{day}</span>
											<span className={`${hours === 'Fermé' ? 'text-black/34' : 'text-[#2c2c2c]'}`}>{hours}</span>
										</div>
									))}
								</div>
							</div>

							<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Avis</h3>
								<div className="mt-5 rounded-[18px] border border-black/6 p-5">
									<div className="flex items-center gap-2 text-[0.95rem] text-[#1d1d1d]">
										<span className="font-semibold">{provider.rating}</span>
										<StarIcon className="h-4 w-4" />
									</div>
									<p className="mt-4 text-[0.96rem] leading-7 text-black/62">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...</p>
									<div className="mt-4 flex justify-end text-[#1a1a1a]">→</div>
								</div>
							</div>

							<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Nous suivre</h3>
								<div className="mt-6 flex items-center justify-center gap-8 rounded-[18px] border border-black/6 px-6 py-7 text-[#111111]">
									{provider.socials.map((social) => (
										<a key={social.id} href={social.href} aria-label={social.label} className="transition hover:-translate-y-px hover:text-[#7b6335]">
											<SocialIcon kind={social.id} />
										</a>
									))}
								</div>
							</div>
						</aside>
					</div>
				</div>
			</section>

			{showConfirmation ? (
				<div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(17,17,24,0.16)] px-4">
					<div className="w-full max-w-[360px] rounded-[22px] bg-white p-7 shadow-[0_26px_70px_rgba(17,19,30,0.22)]">
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => setShowConfirmation(false)}
								className="text-[1.4rem] leading-none text-black/35 transition hover:text-black/65"
								aria-label="Fermer"
							>
								×
							</button>
						</div>
						<p className="mt-6 text-[1.15rem] leading-8 text-[#1b1b1d]">
							Rendez-vous confirmé le <span className="font-medium">{confirmedDate}</span> à <span className="font-medium">{confirmedTime}</span>
						</p>
						<p className="mt-3 text-[0.98rem] leading-7 text-black/56">
							Vous recevrez un rappel la veille de votre rendez-vous.
						</p>
					</div>
				</div>
			) : null}

			{isGalleryOpen ? (
				<div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,10,14,0.78)] px-4" onClick={() => setIsGalleryOpen(false)}>
					<div className="relative w-full max-w-[980px]" onClick={(event) => event.stopPropagation()}>
						<button
							type="button"
							onClick={() => setIsGalleryOpen(false)}
							className="absolute right-0 top-[-52px] text-[2rem] leading-none text-white/78 transition hover:text-white"
							aria-label="Fermer la galerie"
						>
							×
						</button>

						<div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
							<img
								src={provider.gallery[activePhotoIndex].image}
								alt={provider.gallery[activePhotoIndex].alt}
								className="h-[min(72vh,780px)] w-full object-cover"
							/>

							<button
								type="button"
								onClick={showPreviousPhoto}
								className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#161616] shadow-[0_12px_26px_rgba(17,19,30,0.16)] transition hover:scale-105"
								aria-label="Photo précédente"
							>
								←
							</button>
							<button
								type="button"
								onClick={showNextPhoto}
								className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#161616] shadow-[0_12px_26px_rgba(17,19,30,0.16)] transition hover:scale-105"
								aria-label="Photo suivante"
							>
								→
							</button>

							<div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,transparent_0%,rgba(10,10,14,0.72)_100%)] px-6 pb-5 pt-10 text-white">
								<div className="flex items-center justify-between gap-4">
									<p className="text-[1rem] font-medium">{provider.gallery[activePhotoIndex].alt}</p>
									<p className="text-[0.92rem] text-white/72">
										{activePhotoIndex + 1} / {provider.gallery.length}
									</p>
								</div>
							</div>
						</div>

						<div className="mt-4 flex justify-center gap-3">
							{provider.gallery.map((photo, index) => (
								<button
									key={photo.id}
									type="button"
									onClick={() => setActivePhotoIndex(index)}
									className={`h-16 w-16 overflow-hidden rounded-[14px] border transition ${
										index === activePhotoIndex ? 'border-white shadow-[0_10px_24px_rgba(255,255,255,0.18)]' : 'border-white/18 opacity-78 hover:opacity-100'
									}`}
									aria-label={`Voir la photo ${index + 1}`}
								>
									<img src={photo.image} alt={photo.alt} className="h-full w-full object-cover" />
								</button>
							))}
						</div>
					</div>
				</div>
			) : null}

			{selectedService ? (
				<div className="fixed inset-0 z-[85] flex items-center justify-center bg-[rgba(10,10,14,0.54)] px-4 backdrop-blur-[2px]" onClick={() => setSelectedService(null)}>
					<div
						className="w-full max-w-[760px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<h3 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[#191919]">{selectedService.name}</h3>
								<p className="mt-1 text-[0.98rem] text-black/40">{selectedService.duration}</p>
							</div>
							<button
								type="button"
								onClick={() => setSelectedService(null)}
								className="text-[1.8rem] leading-none text-black/36 transition hover:text-black/66"
								aria-label="Fermer le détail de la prestation"
							>
								×
							</button>
						</div>

						<div className="grid gap-5 md:grid-cols-[140px_1fr]">
							<div className="flex flex-col">
								<div className="h-[140px] rounded-[20px] bg-[linear-gradient(135deg,#aba79c_0%,#7c786f_100%)]" />
								<p
									className="mt-4 text-left text-[2.4rem] tracking-[-0.04em] text-[#161616]"
									style={{ fontFamily: '"TAN Meringue", "Iowan Old Style", "Times New Roman", serif' }}
								>
									{selectedService.price}
								</p>
							</div>

							<div className="flex min-h-[140px] flex-col">
								<p className="text-[1rem] leading-8 text-black/66">{selectedService.description}</p>
								<button
									type="button"
									onClick={() => navigateTo(`/app/reservation?professionalId=${provider.id}&serviceId=${selectedService.id}`)}
									className="mt-6 inline-flex items-center justify-center self-start rounded-full bg-[linear-gradient(135deg,#161616_0%,#35332d_100%)] px-6 py-3 text-[0.95rem] font-medium text-white shadow-[0_12px_26px_rgba(22,22,22,0.16)] transition hover:-translate-y-px hover:opacity-92"
								>
									Prendre RDV
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</main>
	);
}
