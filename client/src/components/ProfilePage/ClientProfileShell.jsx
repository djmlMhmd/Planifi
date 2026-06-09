import { startTransition, useEffect, useMemo, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import Reveal from '../Reveal/Reveal';
import {
  BookmarkIcon,
  CaretDownIcon,
  ClientReviewCard,
  CompassIcon,
  DevelopmentNoticeModal,
  DotsIcon,
  FavoritesPanel,
  getProfileTabFromLocation,
  HelpIcon,
  HistoryIcon,
  InvoiceItem,
  LogoutIcon,
  MessageIcon,
  ReservationItem,
  SearchIcon,
  SettingsPanel,
  SettingsIcon,
  SidebarLink,
  UserAvatar,
  DashboardIcon,
  DocumentIcon,
} from './ProfilePage.shared';

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

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		window.location.href = '/connexion/';
	}

	// L'onglet actif reste synchronisé avec l'URL pour éviter d'ajouter un router plus lourd ici.
	const [activeTab, setActiveTab] = useState(() => getProfileTabFromLocation());
	const [contentVisible, setContentVisible] = useState(true);
	const [isDocumentsNoticeOpen, setIsDocumentsNoticeOpen] = useState(false);
	const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);

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
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfileTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			window.location.href = targetUrl.toString();
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
			<div className="grid min-h-screen grid-cols-[210px_1fr]">
				<aside className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] text-white">
					<div className="flex h-[92px] items-center justify-center border-b border-white/10 px-7">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition opacity-100 hover:opacity-80">
							<img
								src={prestatLogo}
								alt="Prestat"
								className="w-[126px]"
								style={{ filter: 'brightness(0) invert(1)' }}
							/>
						</a>
					</div>

					<nav className="flex flex-1 flex-col overflow-y-auto px-9 pb-9 pt-11">
						<div className="space-y-8">
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

						<div className="mt-auto space-y-9">
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
					<header className="flex h-[92px] items-center justify-between border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-10 backdrop-blur-sm">
						<h1 className="text-[1.2rem] font-semibold text-[#151515]">
							{activeTab === 'settings'
								? 'Paramètres'
								: activeTab === 'favorites'
									? 'Favoris'
									: 'Dashboard'}
						</h1>

						<div className="flex items-center gap-6">
							<div className="flex h-11 w-[310px] items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)]">
								<SearchIcon className="h-5 w-5 text-black/35" />
								<input
									type="text"
									placeholder="Prestation, entreprise..."
									className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35"
								/>
							</div>

							<div className="flex items-center gap-4 text-[#1b1a20]">
								<div className="relative">
									<MessageIcon className="h-6 w-6" />
									<span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff3d3d]" />
								</div>
								<HistoryIcon className="h-6 w-6" />
								<CaretDownIcon className="h-5 w-5 text-black/35" />
							</div>

							<div className="flex items-center gap-3">
								<div className="text-right">
									<p className="text-[1rem] font-medium text-[#1f1f28]">
										{profile.firstName} {profile.lastName}
									</p>
									<p className="mt-1 text-[0.72rem] text-black/38">
										{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}
									</p>
								</div>
								<UserAvatar profile={profile} />
							</div>
						</div>
					</header>

					<div className={`grid gap-8 px-9 pb-10 pt-11 ${activeTab === 'dashboard' ? 'lg:grid-cols-[1fr_305px]' : 'grid-cols-1'}`}>
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
										<div className="mb-8 flex items-center gap-4">
											<button
												type="button"
												className="rounded-xl bg-[#101010] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
											>
												Laissez un avis
											</button>
											<button
												type="button"
												className="rounded-xl border border-black/6 bg-white/92 px-5 py-3 text-[0.95rem] font-medium text-black/42 shadow-[0_10px_24px_rgba(24,24,35,0.035)]"
											>
												Actualités
											</button>
											<span className="-ml-5 -mt-5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2d2d] text-[0.6rem] font-semibold text-white">
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
												<div className="mb-6 flex items-center justify-between">
													<h2 className="text-[1.35rem] font-semibold text-[#151515]">Facturation &amp; Devis</h2>
													<DotsIcon className="h-5 w-5 text-[#1f1f28]" />
												</div>

												<div className="mb-5 flex items-center gap-6 text-[0.93rem] font-semibold uppercase tracking-[0.04em]">
													<span className="rounded-full bg-[#101010] px-3 py-2 text-white">Factures</span>
													<span className="text-black/48">Devis</span>
												</div>

												<div className="mb-4 flex h-11 items-center gap-3 rounded-[14px] border border-black/6 bg-white/80 px-4">
													<SearchIcon className="h-4 w-4 text-black/35" />
													<input
														type="text"
														placeholder="Recherche une facture"
														className="w-full border-0 bg-transparent text-[0.9rem] text-[#1e1e1e] outline-none placeholder:text-black/34"
													/>
												</div>

												<div>
													{invoiceItems.map((item) => (
														<InvoiceItem key={item} label={item} />
													))}
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
													className="mt-3 w-full text-center text-[0.96rem] font-semibold text-[#111111] transition hover:opacity-70"
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
				<DevelopmentNoticeModal open={isDocumentsNoticeOpen} onClose={() => setIsDocumentsNoticeOpen(false)} />
				{isReservationsModalOpen ? (
					<div
						className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(10,10,14,0.5)] px-4 backdrop-blur-[2px]"
						onClick={() => setIsReservationsModalOpen(false)}
					>
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
				) : null}
			</main>
	);
}
