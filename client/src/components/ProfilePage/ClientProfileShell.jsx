import { startTransition, useEffect, useMemo, useState } from 'react';
import favoritesPlaceholder from '../../assets/favorites-placeholder.jpg';
import prestatLogo from '../../assets/prestat-logo.svg';
import { navigateTo } from '../../lib/navigation';
import CalendarPage from '../CalendarPage/CalendarPage';
import Reveal from '../Reveal/Reveal';
import {
  BookmarkIcon,
  CalendarIcon,
  ClientReviewCard,
  CompassIcon,
  DevelopmentNoticeModal,
  DotsIcon,
  FavoritesPanel,
  getProfileTabFromLocation,
  HelpIcon,
  InvoiceItem,
  LogoutIcon,
  ModalPortal,
  ReservationItem,
  SearchIcon,
  SettingsPanel,
  SettingsIcon,
  SidebarLink,
  UserAvatar,
  DashboardIcon,
  DocumentIcon,
} from './ProfilePage.shared';

function MenuIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 17H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export default function DashboardShell({ profile, reservations, onProfileUpdated }) {
	// Ces cartes restent décoratives pour le moment, elles servent juste à remplir le dashboard.
	const reviewCards = useMemo(
		() => ['Prestige Services', 'Élite Solutions', 'Pro Connect', 'Services Faciles'],
		[]
	);
	const favoriteNewsItems = useMemo(
		() => [
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
		],
		[]
	);

	const invoiceItems = useMemo(
		// Je génère des libellés cohérents à partir du profil client.
		() => [
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestation].pdf`,
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestataire].pdf`,
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Accompagnement].pdf`,
		],
		[profile.city, profile.firstName, profile.lastName]
	);
	const quoteItems = useMemo(
		() => [
			`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Brushing].pdf`,
			`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Mise en beauté].pdf`,
			`DEVIS - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Coiffure évènement].pdf`,
		],
		[profile.city, profile.firstName, profile.lastName]
	);

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		navigateTo('/connexion/');
	}

	// L'onglet actif reste synchronisé avec l'URL pour éviter d'ajouter un router plus lourd ici.
	const [activeTab, setActiveTab] = useState(() => getProfileTabFromLocation());
	const [contentVisible, setContentVisible] = useState(true);
	const [isDocumentsNoticeOpen, setIsDocumentsNoticeOpen] = useState(false);
	const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
	const [billingView, setBillingView] = useState('invoices');
	const [billingQuery, setBillingQuery] = useState('');
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [dashboardHighlight, setDashboardHighlight] = useState('reviews');
	const [reviewModalProvider, setReviewModalProvider] = useState('');
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewComment, setReviewComment] = useState('');
	const [reviewHoverRating, setReviewHoverRating] = useState(0);
	const [reviewStep, setReviewStep] = useState('form');

	// Si le backend a déjà des réservations je les prends, sinon je garde un fallback visuel.
	const reservationList = reservations.length
		? reservations.slice(0, 7)
		: [
				{ reservation_id: 'demo-1', service_name: 'Massage bien-être', title: 'RelaxChezVous', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-2', service_name: 'Cours de yoga', title: 'Zen à la Maison', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-3', service_name: 'Soin du visage', title: 'Beauté Nomade', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-4', service_name: 'Soutien scolaire', title: 'Prof à Votre Porte', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-5', service_name: 'Réparation info', title: 'TechFix Mobile', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-6', service_name: 'Pet-sitting', title: 'Toutou Services', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-7', service_name: 'Coaching perso', title: 'Fit&Go Domicile', start: 'Vendredi 20 14:00 - 15:30' },
		  ];
	const shouldShowAllReservationsButton = reservations.length >= 6;
	const fullReservationList = reservations.length ? reservations : reservationList;
	const billingItems = billingView === 'invoices' ? invoiceItems : quoteItems;
	const filteredBillingItems = billingItems.filter((item) =>
		item.toLowerCase().includes(billingQuery.trim().toLowerCase())
	);
	const profileAvatarFallback = {
		...profile,
		profile_picture: '',
		profile_picture_preview: '',
	};

	function openReviewModal(providerName) {
		setReviewModalProvider(providerName);
		setReviewRating(0);
		setReviewComment('');
		setReviewHoverRating(0);
		setReviewStep('form');
	}

	function closeReviewModal() {
		setReviewModalProvider('');
		setReviewHoverRating(0);
		setReviewStep('form');
	}

	function handleReviewSubmit(event) {
		event.preventDefault();

		if (!reviewRating) {
			return;
		}

		setReviewStep('success');
		window.setTimeout(() => {
			closeReviewModal();
		}, 1800);
	}

	useEffect(() => {
		// Je resynchronise l'onglet si l'utilisateur navigue avec précédent / suivant.
		function handlePopState() {
			startTransition(() => {
				setActiveTab(getProfileTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	useEffect(() => {
		// Petite transition d'entrée quand on change d'onglet.
		setContentVisible(false);

		const animationFrameId = window.requestAnimationFrame(() => {
			setContentVisible(true);
		});

		return () => window.cancelAnimationFrame(animationFrameId);
	}, [activeTab]);

	function handleSidebarNavigation(href) {
		// Si on ne change pas de page, je gère juste le changement d'onglet localement.
		setIsMobileSidebarOpen(false);
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfileTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			navigateTo(targetUrl.toString());
			return;
		}

		if (nextTab === activeTab) {
			return;
		}

		window.history.pushState({}, '', `${targetUrl.pathname}${targetUrl.search}`);
		startTransition(() => {
			setActiveTab(nextTab);
		});
	}

	function FavoriteNewsCard({ item }) {
		return (
			<div className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,246,242,0.96)_100%)] p-4 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
					<div className="relative h-[108px] w-full overflow-hidden rounded-[18px] bg-[#eef1f5] sm:h-[118px] sm:w-[120px] sm:shrink-0">
						<img src={item.image} alt={item.company} className="h-full w-full object-cover" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-3">
							<h3 className="text-[1.02rem] font-semibold text-[#171717]">{item.company}</h3>
							<span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-[#ff2d2d]" />
						</div>
						<p className="mt-2 text-[1rem] font-semibold text-[#b44d5c]">{item.title}</p>
						<p className="mt-2 text-[0.94rem] leading-7 text-black/62">{item.body}</p>
						<button type="button" className="mt-3 text-[0.9rem] font-medium text-[var(--accent-mauve)] transition hover:opacity-72">
							&gt; En savoir plus
						</button>
					</div>
				</div>
			</div>
		);
	}

	function ReviewStar({ index }) {
		const isActive = index <= (reviewHoverRating || reviewRating);

		return (
			<button
				type="button"
				onMouseEnter={() => setReviewHoverRating(index)}
				onMouseLeave={() => setReviewHoverRating(0)}
				onFocus={() => setReviewHoverRating(index)}
				onBlur={() => setReviewHoverRating(0)}
				onClick={() => setReviewRating(index)}
				className={`transition ${isActive ? 'text-[var(--accent-mauve)]' : 'text-black/15 hover:text-black/35'}`}
				aria-label={`${index} étoile${index > 1 ? 's' : ''}`}
			>
				<svg viewBox="0 0 20 20" className="h-8 w-8" fill={isActive ? 'currentColor' : 'none'} aria-hidden="true">
					<path d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
				</svg>
			</button>
		);
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#1f1f1f]">
			<div className="grid min-h-screen xl:grid-cols-[210px_1fr]">
				<aside className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:flex-col xl:overflow-hidden xl:border-r xl:border-white/10 xl:bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] xl:text-white">
					<div className="flex h-[86px] items-center justify-center border-b border-white/10 px-7 xl:h-[92px]">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition opacity-100 hover:opacity-80">
							<img
								src={prestatLogo}
								alt="Prestat"
								className="w-[126px]"
								style={{ filter: 'brightness(0) invert(1)' }}
							/>
						</a>
					</div>

					<nav className="flex flex-1 flex-col px-5 pb-6 pt-6 xl:overflow-y-auto xl:px-9 xl:pb-9 xl:pt-11">
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-8">
							<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleSidebarNavigation}>
								Dashboard
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=calendar" active={activeTab === 'calendar'} icon={CalendarIcon} onNavigate={handleSidebarNavigation}>
								Calendrier
							</SidebarLink>
							<SidebarLink href="/navigation" icon={CompassIcon}>
								Découvrir
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon} onNavigate={handleSidebarNavigation}>
								Favoris
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon} onNavigate={handleSidebarNavigation}>
								Paramètres
							</SidebarLink>
							<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => setIsDocumentsNoticeOpen(true)}>
								Documents
							</SidebarLink>
						</div>

						<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:mt-auto xl:grid-cols-1 xl:gap-9">
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white"
							>
								<LogoutIcon className="h-5 w-5" />
								<span>Déconnexion</span>
							</button>

							<a className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white" href="#">
								<HelpIcon className="h-5 w-5" />
								<span>Aide & Contact</span>
							</a>
						</div>
					</nav>
				</aside>

				<div className="min-w-0">
					<header className="border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-5 py-5 backdrop-blur-sm sm:px-7 lg:px-10 lg:py-0 lg:h-[92px]">
						<div className="hidden md:flex md:items-center md:justify-between md:gap-5 lg:h-[92px]">
							<h1 className="text-[1.05rem] font-semibold text-[#151515] sm:text-[1.2rem]">
								{activeTab === 'settings'
									? 'Paramètres'
									: activeTab === 'favorites'
										? 'Favoris'
										: activeTab === 'calendar'
											? 'Calendrier'
										: 'Dashboard'}
							</h1>

							<div className="flex items-center gap-5 lg:gap-6">
								<div className="flex h-11 w-full items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)] sm:max-w-[310px] md:w-[310px] md:shrink-0">
									<SearchIcon className="h-5 w-5 text-black/35" />
									<input
										type="text"
										placeholder="Prestation, entreprise..."
										className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35"
									/>
								</div>

								<div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
									<div className="text-right">
										<p className="whitespace-nowrap text-[1rem] font-medium text-[#1f1f28]">
											{profile.firstName} {profile.lastName}
										</p>
										<p className="mt-1 whitespace-nowrap text-[0.72rem] text-[var(--accent-mauve)]">
											{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}
										</p>
									</div>
									<UserAvatar profile={profileAvatarFallback} />
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-4 md:hidden">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h1 className="text-[1.45rem] font-semibold text-[#151515]">
										{activeTab === 'settings'
											? 'Paramètres'
											: activeTab === 'favorites'
												? 'Favoris'
												: activeTab === 'calendar'
													? 'Calendrier'
												: 'Dashboard'}
									</h1>
									<p className="mt-1 text-[0.82rem] text-black/40">Espace client</p>
								</div>
								<button
									type="button"
									onClick={() => setIsMobileSidebarOpen(true)}
									className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-black/8 bg-white text-[#151515] shadow-[0_10px_24px_rgba(24,24,35,0.035)]"
									aria-label="Ouvrir le menu du profil"
								>
									<MenuIcon className="h-5 w-5" />
								</button>
							</div>

							<div className="flex h-11 w-full items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)]">
								<SearchIcon className="h-5 w-5 text-black/35" />
								<input
									type="text"
									placeholder="Prestation, entreprise..."
									className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35"
								/>
							</div>

						</div>
					</header>

					<div className={`grid gap-8 px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-11 ${activeTab === 'dashboard' ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
						<div
							key={activeTab}
							className={`min-w-0 transition-[opacity,transform] duration-220 ease-out ${
								contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-[6px] opacity-0'
							}`}
							>
								{activeTab === 'settings' ? (
									<SettingsPanel profile={profile} onProfileUpdated={onProfileUpdated} />
								) : activeTab === 'favorites' ? (
									<FavoritesPanel />
								) : activeTab === 'calendar' ? (
									<CalendarPage embedded />
								) : (
									<>
										<div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
											<button
												type="button"
												onClick={() => setDashboardHighlight('reviews')}
												className={`rounded-xl px-5 py-3 text-[0.95rem] font-semibold ${
													dashboardHighlight === 'reviews'
														? 'bg-[#101010] text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]'
														: 'border border-black/6 bg-white/92 text-[#5a5a5a] shadow-[0_10px_24px_rgba(24,24,35,0.035)] hover:bg-black/[0.02]'
												}`}
											>
												Laisser un avis
											</button>
											<button
												type="button"
												onClick={() => setDashboardHighlight('news')}
												className={`rounded-xl border px-5 py-3 text-[0.95rem] font-medium ${
													dashboardHighlight === 'news'
														? 'border-transparent bg-[#101010] text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]'
														: 'border-black/6 bg-white/92 text-[#5a5a5a] shadow-[0_10px_24px_rgba(24,24,35,0.035)] hover:bg-black/[0.02]'
												}`}
											>
												Actualités
											</button>
											<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2d2d] text-[0.6rem] font-semibold text-white sm:-ml-5 sm:-mt-5">
												1
											</span>
										</div>

										{dashboardHighlight === 'news' ? (
											<Reveal key="news-panel" from="bottom">
												<div className="mb-7 grid gap-5">
													{favoriteNewsItems.map((item, index) => (
														<Reveal key={item.id} from="bottom" delay={index * 70}>
															<FavoriteNewsCard item={item} />
														</Reveal>
													))}
												</div>
											</Reveal>
										) : (
											<Reveal key="reviews-panel" from="bottom" delay={40}>
												<div className="grid gap-5 md:grid-cols-2">
													{reviewCards.map((card, index) => (
														<Reveal key={card} from="bottom" delay={index * 70}>
															<ClientReviewCard title={card} onLeaveReview={openReviewModal} />
														</Reveal>
													))}
												</div>
											</Reveal>
										)}

										<Reveal from="bottom" delay={120}>
											<section className="mt-7 rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
												<div className="mb-6 flex items-center justify-between gap-4">
													<h2 className="text-[1.35rem] font-semibold text-[#151515]">Facturation &amp; Devis</h2>
													<DotsIcon className="h-5 w-5 text-[#1f1f28]" />
												</div>

												<div className="mb-5 flex flex-wrap items-center gap-3 text-[0.93rem] font-semibold uppercase tracking-[0.04em]">
													<button
														type="button"
														onClick={() => setBillingView('invoices')}
														className={`rounded-full px-3 py-2 transition ${billingView === 'invoices' ? 'bg-black text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]' : 'bg-black/5 text-black/68 hover:bg-black/10'}`}
													>
														Factures
													</button>
													<button
														type="button"
														onClick={() => setBillingView('quotes')}
														className={`rounded-full px-3 py-2 transition ${billingView === 'quotes' ? 'bg-black text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]' : 'text-black/54 hover:text-black/74'}`}
													>
														Devis
													</button>
												</div>

												<div className="mb-4 flex h-11 items-center gap-3 rounded-[14px] border border-black/6 bg-white/80 px-4">
													<SearchIcon className="h-4 w-4 text-black/35" />
													<input
														type="text"
														value={billingQuery}
														onChange={(event) => setBillingQuery(event.target.value)}
														placeholder={billingView === 'invoices' ? 'Recherche une facture' : 'Recherche un devis'}
														className="w-full border-0 bg-transparent text-[0.9rem] text-[#1e1e1e] outline-none placeholder:text-black/34"
													/>
												</div>

												<div className="space-y-2">
													{filteredBillingItems.length > 0 ? filteredBillingItems.map((item) => (
														<InvoiceItem key={`${billingView}-${item}`} label={item} kind={billingView === 'quotes' ? 'quote' : 'invoice'} />
													)) : (
														<div className="rounded-[16px] border border-dashed border-black/10 bg-white/55 px-4 py-5 text-[0.92rem] text-black/42">
															Aucun {billingView === 'invoices' ? 'document de facturation' : 'devis'} ne correspond à cette recherche.
														</div>
													)}
												</div>
											</section>
										</Reveal>
									</>
								)}
							</div>

						{activeTab === 'dashboard' ? (
							<Reveal from="bottom" delay={90}>
									<aside className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,246,241,0.96)_100%)] px-7 py-5 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
										<div className="mb-6 flex items-center justify-between">
											<p className="text-[0.94rem] font-medium text-black/58">Mes rendez-vous</p>
											<DotsIcon className="h-5 w-5 text-black/35" />
										</div>

											<div>
												{reservationList.map((reservation) => (
													<ReservationItem key={reservation.reservation_id} reservation={reservation} />
												))}
											</div>

											{shouldShowAllReservationsButton ? (
												<button
													type="button"
													onClick={() => setIsReservationsModalOpen(true)}
													className="mt-3 w-full text-center text-[0.96rem] font-semibold text-[var(--accent-mauve)] transition hover:opacity-70"
												>
													Tous voir
												</button>
											) : null}
										</aside>
									</Reveal>
							) : null}
					</div>
				</div>
				</div>
				{isMobileSidebarOpen ? (
					<ModalPortal>
						<div className="fixed inset-0 z-[95] bg-[rgba(10,10,14,0.42)] backdrop-blur-[3px]" onClick={() => setIsMobileSidebarOpen(false)}>
							<div
								className="ml-auto flex h-full w-[min(86vw,340px)] flex-col bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] px-5 pb-6 pt-5 text-white shadow-[-24px_0_50px_rgba(0,0,0,0.22)]"
								onClick={(event) => event.stopPropagation()}
							>
								<div className="flex items-center justify-between border-b border-white/10 pb-4">
									<img
										src={prestatLogo}
										alt="Prestat"
										className="w-[118px]"
										style={{ filter: 'brightness(0) invert(1)' }}
									/>
									<button
										type="button"
										onClick={() => setIsMobileSidebarOpen(false)}
										className="rounded-full border border-white/12 px-3 py-1.5 text-[0.84rem] text-white/76"
									>
										Fermer
									</button>
								</div>

								<div className="mt-5 flex items-center gap-3">
									<UserAvatar profile={profileAvatarFallback} />
									<div className="min-w-0">
										<p className="truncate text-[1rem] font-semibold text-white">
											{profile.firstName} {profile.lastName}
										</p>
										<p className="mt-1 text-[0.78rem] text-[#c7b2ec]">
											{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}
										</p>
									</div>
								</div>

								<nav className="mt-8 flex flex-1 flex-col justify-between">
									<div className="space-y-6">
										<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleSidebarNavigation}>
											Dashboard
										</SidebarLink>
										<SidebarLink href="/app/profil?tab=calendar" active={activeTab === 'calendar'} icon={CalendarIcon} onNavigate={handleSidebarNavigation}>
											Calendrier
										</SidebarLink>
										<SidebarLink href="/navigation" icon={CompassIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>
											Découvrir
										</SidebarLink>
										<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon} onNavigate={handleSidebarNavigation}>
											Favoris
										</SidebarLink>
										<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon} onNavigate={handleSidebarNavigation}>
											Paramètres
										</SidebarLink>
										<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => {
											setIsMobileSidebarOpen(false);
											setIsDocumentsNoticeOpen(true);
										}}>
											Documents
										</SidebarLink>
									</div>

									<div className="space-y-6 pb-1">
										<button
											type="button"
											onClick={handleLogout}
											className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white"
										>
											<LogoutIcon className="h-5 w-5" />
											<span>Déconnexion</span>
										</button>
										<a className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white" href="#">
											<HelpIcon className="h-5 w-5" />
											<span>Aide & Contact</span>
										</a>
									</div>
								</nav>
							</div>
						</div>
					</ModalPortal>
				) : null}
				<DevelopmentNoticeModal open={isDocumentsNoticeOpen} onClose={() => setIsDocumentsNoticeOpen(false)} />
				{reviewModalProvider ? (
					<ModalPortal>
						<div className="fixed inset-0 z-[92] overflow-y-auto bg-[rgba(10,10,14,0.44)] backdrop-blur-[3px]" onClick={closeReviewModal}>
							<div className="flex min-h-full items-center justify-center px-4 py-6">
								<div
									className="w-full max-w-[520px] rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,241,235,0.98)_100%)] p-6 shadow-[0_28px_80px_rgba(17,19,30,0.2)]"
									onClick={(event) => event.stopPropagation()}
								>
									{reviewStep === 'success' ? (
										<div className="flex min-h-[360px] flex-col items-center justify-center text-center animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
											<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-mauve-soft)] text-[var(--accent-mauve)] shadow-[0_16px_32px_rgba(149,99,214,0.16)]">
												<svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden="true">
													<path d="M6.5 12.5L10.2 16.2L17.5 8.9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</div>
											<h3 className="mt-6 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#171717]">Merci pour votre avis</h3>
											<p className="mt-3 max-w-[320px] text-[0.98rem] leading-7 text-black/58">
												Merci d&apos;avoir laissé un avis sur <span className="font-semibold text-[#171717]">{reviewModalProvider}</span>.
											</p>
										</div>
									) : (
										<form onSubmit={handleReviewSubmit} className="animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
											<div className="flex items-start justify-between gap-4">
												<div>
													<p className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-black/34">Votre avis</p>
													<h3 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#171717]">{reviewModalProvider}</h3>
													<p className="mt-2 text-[0.96rem] text-black/56">Partagez votre expérience en quelques mots.</p>
												</div>
												<button
													type="button"
													onClick={closeReviewModal}
													className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/78 text-[1.5rem] leading-none text-black/38 transition hover:text-black/62"
													aria-label="Fermer la fenêtre d'avis"
												>
													×
												</button>
											</div>

											<div className="mt-8 border-t border-black/8 pt-6">
												<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
													<div>
														<p className="text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-black/36">Note</p>
														<p className="mt-2 text-[0.9rem] text-black/48">
															{reviewRating ? `${reviewRating}/5 sélectionné${reviewRating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
														</p>
													</div>
													<div className="flex items-center gap-1">
														{Array.from({ length: 5 }).map((_, index) => (
															<ReviewStar key={index + 1} index={index + 1} />
														))}
													</div>
												</div>
											</div>

											<div className="mt-6 border-t border-black/8 pt-6">
												<label htmlFor="review-comment" className="text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-black/36">
													Commentaire
												</label>
												<textarea
													id="review-comment"
													value={reviewComment}
													onChange={(event) => setReviewComment(event.target.value)}
													placeholder="Votre rendez-vous s’est-il bien passé ?"
													rows={5}
													className="mt-4 w-full resize-none border-0 border-b border-black/12 bg-transparent px-0 py-0 text-[1rem] leading-7 text-[#171717] outline-none transition placeholder:text-black/28 focus:border-[var(--accent-mauve)]"
												/>
											</div>

											<div className="mt-8 flex flex-col gap-3 border-t border-black/8 pt-6 sm:flex-row sm:justify-end">
												<button
													type="button"
													onClick={closeReviewModal}
													className="rounded-full border border-black/8 px-5 py-3 text-[0.92rem] font-medium text-black/58 transition hover:bg-black/[0.03] hover:text-black/76"
												>
													Annuler
												</button>
												<button
													type="submit"
													disabled={!reviewRating}
													className="rounded-full bg-[#101010] px-6 py-3 text-[0.92rem] font-semibold text-white shadow-[0_14px_28px_rgba(10,10,10,0.16)] transition hover:-translate-y-px hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-40"
												>
													Publier mon avis
												</button>
											</div>
										</form>
									)}
								</div>
							</div>
						</div>
					</ModalPortal>
				) : null}
				{isReservationsModalOpen ? (
					<ModalPortal>
						<div
							className="fixed inset-0 z-[90] overflow-y-auto bg-[rgba(10,10,14,0.5)] backdrop-blur-[2px]"
							onClick={() => setIsReservationsModalOpen(false)}
						>
							<div className="flex min-h-full items-center justify-center px-4 py-6">
								<div
									className="w-full max-w-[780px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
									onClick={(event) => event.stopPropagation()}
								>
									<div className="mb-5 flex items-center justify-between gap-4">
										<div>
											<h2 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#171717]">Tous mes rendez-vous</h2>
											<p className="mt-1 text-[0.92rem] text-black/40">{fullReservationList.length} rendez-vous</p>
										</div>
										<button
											type="button"
											onClick={() => setIsReservationsModalOpen(false)}
											className="text-[1.8rem] leading-none text-black/32 transition hover:text-black/62"
											aria-label="Fermer la liste des rendez-vous"
										>
											×
										</button>
									</div>

									<div className="max-h-[70vh] overflow-y-auto pr-1">
										{fullReservationList.map((reservation) => (
											<ReservationItem key={`modal-${reservation.reservation_id}`} reservation={reservation} />
										))}
									</div>
								</div>
							</div>
						</div>
					</ModalPortal>
				) : null}
			</main>
	);
}
