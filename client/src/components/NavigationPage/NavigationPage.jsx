import { useEffect, useRef, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import navigationPlaceholder from '../../assets/navigation-placeholder.jpg';
import { navigateTo } from '../../lib/navigation';
import { ModalPortal } from '../ProfilePage/ProfilePage.shared';

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

function BookmarkIcon({ className = '', filled = false }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M7 4.5H17V20L12 16.7L7 20V4.5Z"
				fill={filled ? 'currentColor' : 'none'}
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
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
			<path
				fill="#1d9bf0"
				d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
			/>
			<path
				fill="#fff"
				d="M10.4 15.3 7.1 12l1.3-1.3 2 2 4.2-4.2 1.3 1.3z"
			/>
		</svg>
	);
}

function FilterIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 7H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M8 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M10.5 17H13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function CloseIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function UserAvatar({ profile, name = 'Bob Alves' }) {
	const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || name;
	const initials =
		`${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() ||
		displayName.trim().charAt(0).toUpperCase();
	const [open, setOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		navigateTo('/connexion/');
	}

	const profileHref = profile?.est_pro ? '/app/profil/professionnel' : '/app/profil';

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex items-center gap-3 rounded-full transition hover:opacity-90"
			>
				{profile?.profile_picture ? (
					<div className="h-14 w-14 overflow-hidden rounded-full">
						<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
					</div>
				) : (
					<div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] text-[1.2rem] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)]">
						{initials}
					</div>
				)}
				<div className="min-w-0">
					<p className="truncate text-[0.98rem] font-medium text-[#202020]">{displayName}</p>
				</div>
			</button>

			{open ? (
				<div className="absolute right-0 top-[calc(100%+10px)] z-50 w-48 overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5 shadow-[0_20px_44px_rgba(17,19,30,0.14)]">
					<a
						href={profileHref}
						className="block rounded-xl px-3 py-2.5 text-sm text-[#1b1b1d] transition hover:bg-black/5"
					>
						Voir mon profil
					</a>
					<button
						type="button"
						onClick={handleLogout}
						className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#d23b3b] transition hover:bg-[#d23b3b]/8"
					>
						Se déconnecter
					</button>
				</div>
			) : null}
		</div>
	);
}

function NavigationCard({ item, selected, onSelect, isFavorite, onToggleFavorite }) {
	return (
		<div
			role="button"
			tabIndex={0}
			aria-pressed={selected}
			onClick={() => onSelect(item.id)}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					onSelect(item.id);
				}
			}}
			className={`grid w-full max-w-[560px] cursor-pointer gap-4 rounded-[24px] border bg-white p-3 text-left shadow-[0_16px_38px_rgba(17,19,30,0.045)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(17,19,30,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 sm:grid-cols-[170px_1fr] ${
				selected ? 'border-black/70 ring-1 ring-black/70' : 'border-black/8 hover:border-black/30'
			}`}
		>
			<div className="relative h-[190px] overflow-hidden rounded-[18px] sm:min-h-[148px] sm:h-auto">
				<img src={item.previewImage || navigationPlaceholder} alt={item.company} className="absolute inset-0 h-full w-full object-cover" />
				<button
					type="button"
					aria-label={isFavorite ? 'Supprimer des favoris' : 'Ajouter aux favoris'}
					aria-pressed={isFavorite}
					onClick={(event) => {
						event.stopPropagation();
						onToggleFavorite(item.id);
					}}
					className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-[0_10px_24px_rgba(10,10,10,0.16)] transition hover:scale-105 ${
						isFavorite ? 'bg-[#0a0a0a] text-white' : 'bg-white/96 text-[#1a1a1a]'
					}`}
				>
					<BookmarkIcon className="h-5 w-5" filled={isFavorite} />
				</button>
			</div>

			<div className="flex min-w-0 flex-col py-1">
				<h3 className="truncate text-[1.02rem] font-semibold text-[#2f2b31]">{item.company}</h3>
				<div className="mt-2 flex items-center gap-2 text-[0.88rem] text-[#2e2e2e]">
					<StarIcon className="h-4 w-4" />
					<span>{item.rating}</span>
					<span className="text-black/34">({item.reviews} avis)</span>
				</div>
				<div className="mt-1.5 flex items-center gap-2 text-[0.95rem] text-black/48">
					<PinIcon className="h-[18px] w-[18px] shrink-0" />
					<span>{item.location}</span>
				</div>

				<div className="mt-5 flex flex-wrap gap-2.5">
					{item.servicesPreview.map((service) => (
						<span key={`${item.id}-${service.name}`} className="rounded-[10px] border border-black/10 bg-[#fafaf8] px-3 py-1.5 text-[0.88rem] text-black/68">
							{service.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function formatServiceDuration(duration) {
	if (!duration) {
		return '';
	}

	if (typeof duration === 'object') {
		const hours = Number(duration.hours) || 0;
		const minutes = Number(duration.minutes) || 0;

		if (hours && minutes) return `${hours}h${String(minutes).padStart(2, '0')}`;
		if (hours) return `${hours}h`;
		if (minutes) return `${minutes}min`;
		return '';
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

function buildNavigationProviders(serviceRows) {
	const providersMap = new Map();

	serviceRows.forEach((serviceRow) => {
		const providerId = String(serviceRow.professional_id);
		const existingProvider = providersMap.get(providerId);
		const previewImage = serviceRow.service_image_url || serviceRow.profile_picture || navigationPlaceholder;
		const serviceItem = {
			id: String(serviceRow.service_id),
			name: serviceRow.service_name,
			duration: formatServiceDuration(serviceRow.duration),
			price: serviceRow.service_price,
		};

		if (existingProvider) {
			existingProvider.servicesPreview.push(serviceItem);
			if (!existingProvider.previewImage && previewImage) {
				existingProvider.previewImage = previewImage;
			}
			return;
		}

		providersMap.set(providerId, {
			id: providerId,
			company: serviceRow.company_name,
			location: serviceRow.company_address || '[localisation]',
			profile_picture: serviceRow.profile_picture || '',
			previewImage,
			rating: '5,0',
			reviews: 0,
			policy: 'Réservation en ligne disponible. Les détails du prestataire seront enrichis directement depuis son profil.',
			hours: [
				['Lundi', '09:00 - 18:00'],
				['Mardi', '09:00 - 18:00'],
				['Mercredi', '09:00 - 18:00'],
				['Jeudi', '09:00 - 18:00'],
				['Vendredi', '09:00 - 18:00'],
				['Samedi', 'Fermé'],
			],
			servicesPreview: [serviceItem],
		});
	});

	return Array.from(providersMap.values()).map((provider) => ({
		...provider,
		reviews: provider.servicesPreview.length * 18 + 24,
		servicesPreview: provider.servicesPreview.slice(0, 4),
	}));
}

export default function NavigationPage() {
	const [profile, setProfile] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [favorites, setFavorites] = useState(() => new Set());
	const [toast, setToast] = useState(null);
	const [providers, setProviders] = useState([]);
	const [loadError, setLoadError] = useState('');
	const [isMobileProviderPanelOpen, setIsMobileProviderPanelOpen] = useState(false);
	const [mobilePanelOffset, setMobilePanelOffset] = useState(0);
	const touchStartXRef = useRef(null);
	const touchCurrentXRef = useRef(null);

	// On lit les paramètres de l'URL dans un state React
	// → permet de détecter les changements même si le pathname (/navigation) ne change pas
	const [searchQuery, setSearchQuery] = useState(
		() => new URLSearchParams(window.location.search).get('q') || ''
	);
	const [searchVille, setSearchVille] = useState(
		() => new URLSearchParams(window.location.search).get('ville') || ''
	);

	// On écoute TOUS les changements d'URL (bouton retour du navigateur OU navigateTo)
	// Quand l'URL change, on relit les params et on met à jour le state
	useEffect(() => {
		function handleNavChange() {
			const params = new URLSearchParams(window.location.search);
			setSearchQuery(params.get('q') || '');
			setSearchVille(params.get('ville') || '');
		}
		window.addEventListener('popstate', handleNavChange);
		window.addEventListener('codex:navigation', handleNavChange);
		return () => {
			window.removeEventListener('popstate', handleNavChange);
			window.removeEventListener('codex:navigation', handleNavChange);
		};
	}, []);

	function toggleFavorite(id) {
		setFavorites((prev) => {
			const next = new Set(prev);
			let added;
			if (next.has(id)) {
				next.delete(id);
				added = false;
			} else {
				next.add(id);
				added = true;
			}
			setToast({
				id: Date.now(),
				message: added ? 'Ajouté aux favoris' : 'Supprimé des favoris',
				added,
			});
			return next;
		});
	}

	function closeMobileProviderPanel() {
		setIsMobileProviderPanelOpen(false);
		setMobilePanelOffset(0);
		touchStartXRef.current = null;
		touchCurrentXRef.current = null;
	}

	function handleSelectProvider(nextId) {
		setSelectedId(nextId);
		if (typeof window !== 'undefined' && window.innerWidth < 1280) {
			setIsMobileProviderPanelOpen(true);
			setMobilePanelOffset(0);
		}
	}

	function handlePanelTouchStart(event) {
		touchStartXRef.current = event.touches[0]?.clientX ?? null;
		touchCurrentXRef.current = touchStartXRef.current;
	}

	function handlePanelTouchMove(event) {
		if (touchStartXRef.current === null) {
			return;
		}

		touchCurrentXRef.current = event.touches[0]?.clientX ?? touchCurrentXRef.current;
		const delta = (touchCurrentXRef.current ?? 0) - touchStartXRef.current;
		setMobilePanelOffset(delta > 0 ? delta : 0);
	}

	function handlePanelTouchEnd() {
		if (touchStartXRef.current === null || touchCurrentXRef.current === null) {
			setMobilePanelOffset(0);
			return;
		}

		const delta = touchCurrentXRef.current - touchStartXRef.current;
		if (delta > 90) {
			closeMobileProviderPanel();
			return;
		}

		setMobilePanelOffset(0);
		touchStartXRef.current = null;
		touchCurrentXRef.current = null;
	}

	useEffect(() => {
		if (!toast) return undefined;
		const timeoutId = window.setTimeout(() => setToast(null), 2200);
		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	const selectedProvider = providers.find((provider) => provider.id === selectedId) ?? null;

	useEffect(() => {
		let cancelled = false;

		async function loadPageData() {
			try {
				if (!cancelled) {
					setLoadError('');
				}

				// On relit les params au moment du fetch (au cas où l'URL a changé)
				const params = new URLSearchParams(window.location.search);
				const q = params.get('q') || '';
				const ville = params.get('ville') || '';

				// Si l'user a tapé un terme → on appelle la route de recherche
				// Sinon → on récupère tous les services
				const servicesUrl = q
					? `/service/search-services?q=${encodeURIComponent(q)}&ville=${encodeURIComponent(ville)}`
					: '/service';

				const [profileResponse, servicesResponse] = await Promise.all([
					fetch('/profil', { credentials: 'same-origin' }),
					fetch(servicesUrl, { credentials: 'same-origin' }),
				]);

				// Je n'empêche pas l'affichage des prestataires si seule la route profil échoue.
				// La page découvrir doit rester utile même si le chargement du profil a raté.
				if (!servicesResponse.ok) {
					if (!cancelled) {
						setProviders([]);
						setSelectedId(null);
						setLoadError('Impossible de charger les prestataires pour le moment.');
					}
					return;
				}

				const servicesPayload = await servicesResponse.json();
				const profilePayload = profileResponse.ok ? await profileResponse.json() : null;

				if (!cancelled) {
					if (profilePayload?.message) {
						setProfile(profilePayload.message);
					}

					const nextProviders = buildNavigationProviders(servicesPayload?.message || []);
					setProviders(nextProviders);
					setLoadError('');
					// On remet la sélection sur le premier résultat à chaque nouvelle recherche
					setSelectedId(nextProviders[0]?.id || null);
				}
			} catch {
				if (!cancelled) {
					setProviders([]);
					setSelectedId(null);
					setLoadError('Impossible de charger les prestataires pour le moment.');
				}
			}
		}

		loadPageData();

		return () => {
			cancelled = true;
		};
	// En ajoutant searchQuery et searchVille ici, React relance le useEffect
	// à chaque fois que l'URL change (nouvelle recherche)
	}, [searchQuery, searchVille]);

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth >= 1280) {
				setIsMobileProviderPanelOpen(false);
				setMobilePanelOffset(0);
			}
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<main className="min-h-screen animate-[pageEnter_280ms_cubic-bezier(0.22,1,0.36,1)] bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_46%,#f4f4f2_100%)] text-[#1b1b1d]">
			<section className="px-4 pb-12 pt-5 xl:px-8">
				<div className="mx-auto w-full max-w-[1480px]">
				<div className="mb-8">
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-1.5 text-[0.85rem] font-medium text-white shadow-[0_10px_24px_rgba(10,10,10,0.18)] transition hover:-translate-y-px hover:opacity-90"
					>
						<FilterIcon className="h-4 w-4" />
						<span>Filtres</span>
					</button>
				</div>

				<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
					<div className="min-w-0">
						<div className="mb-8">
							{/* On affiche les termes de recherche venant de l'URL */}
							<h1 className="text-[clamp(1.8rem,3vw,2.55rem)] font-semibold tracking-[-0.04em] text-[#161616]">
								{searchQuery
									? `${searchQuery}${searchVille ? ` à ${searchVille}` : ''}`
									: 'Tous les prestataires'}
							</h1>
							<div className="mt-4 flex items-center gap-4 flex-wrap">
								<p className="text-[1.1rem] font-medium text-[#202020]">{providers.length} prestataires</p>
								{/* Bouton reset : visible seulement quand une recherche est active */}
								{searchQuery || searchVille ? (
									<button
										type="button"
										onClick={() => navigateTo('/navigation')}
										className="text-[0.9rem] text-[var(--accent-mauve)] underline underline-offset-2 transition-colors hover:opacity-75"
									>
										Voir tous les prestataires
									</button>
								) : null}
							</div>
						</div>

						<div className="flex flex-col gap-5">
							{loadError ? (
								<p className="text-[1rem] text-[#6e6e73]">
									{loadError}
								</p>
							) : null}

							{/* Si la recherche ne donne aucun résultat, on affiche un message */}
							{!loadError && providers.length === 0 && (searchQuery || searchVille) ? (
								<div className="space-y-3">
									<p className="text-[1rem] text-[#6e6e73]">
										Aucun résultat pour &ldquo;{searchQuery}{searchVille ? ` à ${searchVille}` : ''}&rdquo;.
									</p>
									<button
										type="button"
										onClick={() => navigateTo('/navigation')}
										className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-[0.92rem] font-medium text-[#1b1b1d] transition hover:border-black/28 hover:bg-black/3"
									>
										Voir tous les prestataires
									</button>
								</div>
							) : !loadError && providers.length === 0 ? (
								<p className="text-[1rem] text-[#6e6e73]">
									Aucun prestataire à afficher pour le moment.
								</p>
							) : (
								providers.map((provider) => (
									<NavigationCard
										key={provider.id}
										item={provider}
										selected={provider.id === selectedProvider?.id}
										onSelect={handleSelectProvider}
										isFavorite={favorites.has(provider.id)}
										onToggleFavorite={toggleFavorite}
									/>
								))
							)}
						</div>
					</div>

						<aside className="hidden xl:sticky xl:top-[7.25rem] xl:block xl:self-start xl:max-h-[calc(100vh-8.5rem)] xl:overflow-y-auto xl:pr-1">
						<div className="transition-[opacity,filter] duration-180 ease-out">
						{selectedProvider ? (
							<>
						<div className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-[0_14px_34px_rgba(17,19,30,0.045)] sm:px-6 sm:py-6">
							<div className="flex flex-col gap-5 border-b border-black/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex min-w-0 items-start gap-4">
									<div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/12 text-[#1a1a1a]">
											{selectedProvider.profile_picture ? (
												<img src={selectedProvider.profile_picture} alt={selectedProvider.company} className="h-full w-full object-cover" />
											) : (
												<svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" aria-hidden="true">
													<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
													<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
													<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
													<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
												</svg>
											)}
										</div>
									<div className="min-w-0">
											<h2 className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-[#242424]">
												{selectedProvider.company}
											</h2>
											<div className="mt-1 flex items-center gap-2 text-[0.98rem] font-medium text-[#252525]">
												<PinIcon className="h-4 w-4 shrink-0" />
												<span className="truncate">{selectedProvider.location}</span>
											</div>
											<div className="mt-1 flex items-center gap-2 text-[0.82rem] text-black/45">
												<VerifiedBadge className="h-4 w-4" />
												<span>utilisateur vérifié</span>
											</div>
											<div className="mt-1.5 flex items-center gap-1.5 text-[0.86rem] text-[#1c1c1c]">
												<StarIcon className="h-[0.92rem] w-[0.92rem]" />
												<span>{selectedProvider.rating}</span>
												<span className="text-black/40">({selectedProvider.reviews} avis)</span>
											</div>
										</div>
									</div>

								<div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
									<button
										type="button"
										aria-label={favorites.has(selectedProvider.id) ? 'Supprimer des favoris' : 'Ajouter aux favoris'}
										aria-pressed={favorites.has(selectedProvider.id)}
										onClick={() => toggleFavorite(selectedProvider.id)}
										className={`flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-105 ${
											favorites.has(selectedProvider.id)
												? 'border-transparent bg-[#0a0a0a] text-white'
												: 'border-black/12 text-[#1a1a1a] hover:border-black/30'
										}`}
									>
										<BookmarkIcon className="h-[1.05rem] w-[1.05rem]" filled={favorites.has(selectedProvider.id)} />
									</button>

									<button
										type="button"
										onClick={() => navigateTo(`/services?professionalId=${selectedProvider.id}`)}
										className="text-[0.94rem] font-medium text-[var(--accent-mauve)] transition hover:opacity-72"
									>
										Prendre RDV
									</button>
								</div>
							</div>

							<div className="mt-6 space-y-5">
								<section className="rounded-[18px] border border-black/8 bg-white px-6 py-5">
									<h3 className="text-center text-[1.02rem] font-semibold text-[#222222]">Politique de prestation</h3>
									<p className="mt-4 text-[0.92rem] leading-6 text-[#404040]">{selectedProvider.policy}</p>
									<button type="button" className="mt-3 text-[0.92rem] font-medium text-[var(--accent-mauve)] transition hover:opacity-72">
										&gt; En savoir plus
									</button>
								</section>

								<section>
									<h3 className="text-center text-[1.02rem] font-semibold text-[#222222]">Horaires d’ouvertures</h3>
									<div className="mt-4 overflow-hidden rounded-[16px] border border-black/8 bg-white">
										{selectedProvider.hours.map(([day, hours]) => (
											<div key={day} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/8 px-5 py-3 text-[0.95rem] last:border-b-0">
												<span className="text-[#2c2c2c]">{day}</span>
												<span className={`${hours === 'Fermé' ? 'text-black/34' : 'text-[#2c2c2c]'}`}>{hours}</span>
											</div>
										))}
									</div>
								</section>
							</div>
						</div>
							</>
						) : (
							<div className="rounded-[28px] border border-dashed border-black/10 bg-white/70 p-8 shadow-[0_16px_38px_rgba(17,19,30,0.035)]">
								<h2 className="text-[1.2rem] font-semibold text-[#222222]">Sélectionnez un prestataire</h2>
								<p className="mt-3 max-w-[32ch] text-[0.98rem] leading-7 text-black/48">
									Cliquez sur une carte à gauche pour afficher ici ses informations puis accéder à sa page prestataire.
								</p>
							</div>
						)}
						</div>
					</aside>
				</div>
				</div>
			</section>

			{selectedProvider && isMobileProviderPanelOpen ? (
				<ModalPortal>
					<div
						className="fixed inset-0 z-[90] bg-[rgba(10,10,14,0.42)] backdrop-blur-[3px] xl:hidden"
						onClick={closeMobileProviderPanel}
					>
						<div className="flex min-h-full items-center justify-center px-4 py-6">
							<div
								className="w-full max-w-[420px] rounded-[30px] border border-black/8 bg-white shadow-[0_28px_80px_rgba(17,19,30,0.18)] transition-transform duration-200 ease-out"
								style={{ transform: `translateX(${mobilePanelOffset}px)` }}
								onClick={(event) => event.stopPropagation()}
								onTouchStart={handlePanelTouchStart}
								onTouchMove={handlePanelTouchMove}
								onTouchEnd={handlePanelTouchEnd}
							>
								<div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
									<div>
										<h2 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[#242424]">
											{selectedProvider.company}
										</h2>
									</div>
									<button
										type="button"
										onClick={closeMobileProviderPanel}
										className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/55 transition hover:bg-black/5 hover:text-black"
										aria-label="Fermer le panneau prestataire"
									>
										<CloseIcon className="h-5 w-5" />
									</button>
								</div>

								<div className="max-h-[min(78vh,760px)] overflow-y-auto px-5 py-5">
									<div className="space-y-6">
										<section className="border-b border-black/8 pb-6">
											<div className="flex min-w-0 items-start gap-4">
												<div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/12 text-[#1a1a1a]">
													{selectedProvider.profile_picture ? (
														<img src={selectedProvider.profile_picture} alt={selectedProvider.company} className="h-full w-full object-cover" />
													) : (
														<svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" aria-hidden="true">
															<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
															<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
															<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
															<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
														</svg>
													)}
												</div>
												<div className="min-w-0 flex-1">
													<div className="mt-1 flex items-center gap-2 text-[0.98rem] font-medium text-[#252525]">
														<PinIcon className="h-4 w-4 shrink-0" />
														<span className="truncate">{selectedProvider.location}</span>
													</div>
													<div className="mt-1 flex items-center gap-2 text-[0.82rem] text-black/45">
														<VerifiedBadge className="h-4 w-4" />
														<span>utilisateur vérifié</span>
													</div>
													<div className="mt-1.5 flex items-center gap-1.5 text-[0.86rem] text-[#1c1c1c]">
														<StarIcon className="h-[0.92rem] w-[0.92rem]" />
														<span>{selectedProvider.rating}</span>
														<span className="text-black/40">({selectedProvider.reviews} avis)</span>
													</div>
												</div>
											</div>

											<div className="mt-5 flex items-center justify-between gap-4">
												<button
													type="button"
													aria-label={favorites.has(selectedProvider.id) ? 'Supprimer des favoris' : 'Ajouter aux favoris'}
													aria-pressed={favorites.has(selectedProvider.id)}
													onClick={() => toggleFavorite(selectedProvider.id)}
													className={`flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-105 ${
														favorites.has(selectedProvider.id)
															? 'border-transparent bg-[#0a0a0a] text-white'
															: 'border-black/12 text-[#1a1a1a] hover:border-black/30'
													}`}
												>
													<BookmarkIcon className="h-[1.05rem] w-[1.05rem]" filled={favorites.has(selectedProvider.id)} />
												</button>

												<button
													type="button"
													onClick={() => navigateTo(`/services?professionalId=${selectedProvider.id}`)}
													className="text-[0.94rem] font-medium text-[var(--accent-mauve)] transition hover:opacity-72"
												>
													Prendre RDV
												</button>
											</div>
										</section>

										<section className="rounded-[22px] border border-black/8 bg-[#fdfdfc] px-5 py-5">
											<h3 className="text-center text-[1.02rem] font-semibold text-[#222222]">Politique de prestation</h3>
											<p className="mt-4 text-[0.92rem] leading-6 text-[#404040]">{selectedProvider.policy}</p>
											<button type="button" className="mt-3 text-[0.92rem] font-medium text-[var(--accent-mauve)] transition hover:opacity-72">
												&gt; En savoir plus
											</button>
										</section>

										<section>
											<h3 className="text-center text-[1.02rem] font-semibold text-[#222222]">Horaires d’ouvertures</h3>
											<div className="mt-4 overflow-hidden rounded-[20px] border border-black/8 bg-[#fdfdfc]">
												{selectedProvider.hours.map(([day, hours]) => (
													<div key={day} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/8 px-5 py-3 text-[0.95rem] last:border-b-0">
														<span className="text-[#2c2c2c]">{day}</span>
														<span className={`${hours === 'Fermé' ? 'text-black/34' : 'text-[#2c2c2c]'}`}>{hours}</span>
													</div>
												))}
											</div>
										</section>
									</div>
								</div>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{toast ? (
				<div
					key={toast.id}
					role="status"
					aria-live="polite"
					className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#0a0a0a] px-5 py-3 text-[0.92rem] font-medium text-white shadow-[0_18px_40px_rgba(10,10,10,0.28)] animate-[toastIn_260ms_cubic-bezier(0.22,1,0.36,1)]"
				>
					<BookmarkIcon className="h-4 w-4" filled={toast.added} />
					<span>{toast.message}</span>
				</div>
			) : null}
		</main>
	);
}
