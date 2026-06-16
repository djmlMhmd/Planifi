import { startTransition, useEffect, useMemo, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import { navigateTo } from '../../lib/navigation';
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

								<button
									type="button"
									onClick={() => {
										navigateTo('/app/calendar');
									}}
									className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-black/6 bg-white/88 text-[#1b1a20] shadow-[0_10px_24px_rgba(24,24,35,0.035)] transition hover:-translate-y-px sm:flex"
									aria-label="Ouvrir le calendrier"
								>
									<CalendarIcon className="h-[1.15rem] w-[1.15rem]" />
								</button>

								<div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
									<div className="text-right">
										<p className="whitespace-nowrap text-[1rem] font-medium text-[#1f1f28]">
											{profile.firstName} {profile.lastName}
										</p>
										<p className="mt-1 whitespace-nowrap text-[0.72rem] text-[var(--accent-mauve)]">
											{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}
										</p>
									</div>
									<UserAvatar profile={profile} />
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

							<div className="flex items-center justify-between gap-3">
								<button
									type="button"
									onClick={() => {
										navigateTo('/app/calendar');
									}}
									className="flex h-10 items-center justify-center gap-2 rounded-[14px] border border-black/6 bg-white/88 px-4 text-[#1b1a20] shadow-[0_10px_24px_rgba(24,24,35,0.035)] transition hover:-translate-y-px"
									aria-label="Ouvrir le calendrier"
								>
									<CalendarIcon className="h-[1.05rem] w-[1.05rem]" />
									<span className="text-[0.9rem] font-medium">Calendrier</span>
								</button>
							</div>
						</div>
					</header>

					<div className={`grid gap-8 px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-11 ${activeTab === 'dashboard' ? 'xl:grid-cols-[1fr_305px]' : 'grid-cols-1'}`}>
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
								) : (
									<>
										<div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
											<button
												type="button"
												className="rounded-xl bg-[#101010] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
											>
												Laissez un avis
											</button>
											<button
												type="button"
												className="rounded-xl border border-black/6 bg-white/92 px-5 py-3 text-[0.95rem] font-medium text-[var(--accent-mauve)] shadow-[0_10px_24px_rgba(24,24,35,0.035)]"
											>
												Actualités
											</button>
											<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2d2d] text-[0.6rem] font-semibold text-white sm:-ml-5 sm:-mt-5">
												1
											</span>
											{Array.from({ length: 3 }).map((_, index) => (
												<div
													key={index}
													className="flex h-12 w-[92px] items-center justify-center rounded-xl border border-black/5 bg-white/88 text-black/35 shadow-[0_10px_24px_rgba(24,24,35,0.03)]"
												>
													?
												</div>
											))}
										</div>

										<Reveal from="bottom">
											<div className="grid gap-5 md:grid-cols-2">
												{reviewCards.map((card, index) => (
													<Reveal key={card} from="bottom" delay={index * 70}>
														<ClientReviewCard title={card} />
													</Reveal>
												))}
											</div>
										</Reveal>

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
									<aside className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,246,241,0.96)_100%)] px-6 py-5 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
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
									<UserAvatar profile={profile} />
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
				{isReservationsModalOpen ? (
					<ModalPortal>
						<div
							className="fixed inset-0 z-[90] overflow-y-auto bg-[rgba(10,10,14,0.5)] backdrop-blur-[2px]"
							onClick={() => setIsReservationsModalOpen(false)}
						>
							<div className="flex min-h-full items-center justify-center px-4 py-6">
								<div
									className="w-full max-w-[720px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
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
