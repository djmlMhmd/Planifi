import prestatLogo from '../../../assets/prestat-logo.svg';
import CalendarPage from '../../CalendarPage/CalendarPage';
import DocumentsPage from '../../DocumentsPage/DocumentsPage';
import Reveal from '../../Reveal/Reveal';
import {
	BookmarkIcon,
	CalendarIcon,
	ClientReviewCard,
	CompassIcon,
	DashboardIcon,
	DocumentIcon,
	DotsIcon,
	FavoritesPanel,
	HelpIcon,
	InvoiceItem,
	LogoutIcon,
	ReservationItem,
	SearchIcon,
	SettingsPanel,
	SettingsIcon,
	SidebarLink,
	UserAvatar,
} from '../ProfilePage.shared';

function MenuIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 17H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function FavoriteNewsCard({ item }) {
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

export function ClientDesktopSidebar({ activeTab, handleSidebarNavigation, handleLogout, setIsDocumentsNoticeOpen }) {
	return (
		<aside className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:flex-col xl:overflow-hidden xl:border-r xl:border-white/10 xl:bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] xl:text-white">
			<div className="flex h-[86px] items-center justify-center border-b border-white/10 px-7 xl:h-[92px]">
				<a href="/" aria-label="Retour a l'accueil Prestat" className="transition opacity-100 hover:opacity-80">
					<img src={prestatLogo} alt="Prestat" className="w-[126px]" style={{ filter: 'brightness(0) invert(1)' }} />
				</a>
			</div>

			<nav className="flex flex-1 flex-col px-5 pb-6 pt-6 xl:overflow-y-auto xl:px-9 xl:pb-9 xl:pt-11">
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-8">
					<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleSidebarNavigation}>Dashboard</SidebarLink>
					<SidebarLink href="/app/profil?tab=calendar" active={activeTab === 'calendar'} icon={CalendarIcon} onNavigate={handleSidebarNavigation}>Calendrier</SidebarLink>
					<SidebarLink href="/navigation" icon={CompassIcon}>Découvrir</SidebarLink>
					<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon} onNavigate={handleSidebarNavigation}>Favoris</SidebarLink>
					<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon} onNavigate={handleSidebarNavigation}>Paramètres</SidebarLink>
					<SidebarLink href="/app/profil?tab=documents" active={activeTab === 'documents'} icon={DocumentIcon} onNavigate={handleSidebarNavigation}>Documents</SidebarLink>
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:mt-auto xl:grid-cols-1 xl:gap-9">
					<button type="button" onClick={handleLogout} className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white">
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
	);
}

export function ClientHeader({ activeTab, profile, profileAvatarFallback, setIsMobileSidebarOpen }) {
	const title =
		activeTab === 'settings' ? 'Paramètres'
			: activeTab === 'favorites' ? 'Favoris'
				: activeTab === 'calendar' ? 'Calendrier'
					: activeTab === 'documents' ? 'Documents'
					: 'Dashboard';

	return (
		<header className="border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-5 py-5 backdrop-blur-sm sm:px-7 lg:px-10 lg:py-0 lg:h-[92px]">
			<div className="hidden md:flex md:items-center md:justify-between md:gap-5 lg:h-[92px]">
				<h1 className="text-[1.05rem] font-semibold text-[#151515] sm:text-[1.2rem]">{title}</h1>

				<div className="flex items-center gap-5 lg:gap-6">
					<div className="flex h-11 w-full items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)] sm:max-w-[310px] md:w-[310px] md:shrink-0">
						<SearchIcon className="h-5 w-5 text-black/35" />
						<input type="text" placeholder="Prestation, entreprise..." className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35" />
					</div>

					<div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
						<div className="text-right">
							<p className="whitespace-nowrap text-[1rem] font-medium text-[#1f1f28]">{profile.firstName} {profile.lastName}</p>
							<p className="mt-1 whitespace-nowrap text-[0.72rem] text-[var(--accent-mauve)]">{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}</p>
						</div>
						<UserAvatar profile={profileAvatarFallback} />
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:hidden">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-[1.45rem] font-semibold text-[#151515]">{title}</h1>
						<p className="mt-1 text-[0.82rem] text-black/40">Espace client</p>
					</div>
					<button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-black/8 bg-white text-[#151515] shadow-[0_10px_24px_rgba(24,24,35,0.035)]" aria-label="Ouvrir le menu du profil">
						<MenuIcon className="h-5 w-5" />
					</button>
				</div>

				<div className="flex h-11 w-full items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)]">
					<SearchIcon className="h-5 w-5 text-black/35" />
					<input type="text" placeholder="Prestation, entreprise..." className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35" />
				</div>
			</div>
		</header>
	);
}

export function ClientDashboardPanel({
	dashboardHighlight,
	setDashboardHighlight,
	favoriteNewsItems,
	reviewCards,
	openReviewModal,
	billingView,
	setBillingView,
	billingQuery,
	setBillingQuery,
	filteredBillingItems,
}) {
	return (
		<>
			<div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
				<button
					type="button"
					onClick={() => setDashboardHighlight('reviews')}
					className={`rounded-xl px-5 py-3 text-[0.95rem] font-semibold ${dashboardHighlight === 'reviews' ? 'bg-[#101010] text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]' : 'border border-black/6 bg-white/92 text-[#5a5a5a] shadow-[0_10px_24px_rgba(24,24,35,0.035)] hover:bg-black/[0.02]'}`}
				>
					Laisser un avis
				</button>
				<button
					type="button"
					onClick={() => setDashboardHighlight('news')}
					className={`rounded-xl border px-5 py-3 text-[0.95rem] font-medium ${dashboardHighlight === 'news' ? 'border-transparent bg-[#101010] text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]' : 'border-black/6 bg-white/92 text-[#5a5a5a] shadow-[0_10px_24px_rgba(24,24,35,0.035)] hover:bg-black/[0.02]'}`}
				>
					Actualités
				</button>
				<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2d2d] text-[0.6rem] font-semibold text-white sm:-ml-5 sm:-mt-5">1</span>
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
						<button type="button" onClick={() => setBillingView('invoices')} className={`rounded-full px-3 py-2 transition ${billingView === 'invoices' ? 'bg-black text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]' : 'bg-black/5 text-black/68 hover:bg-black/10'}`}>Factures</button>
						<button type="button" onClick={() => setBillingView('quotes')} className={`rounded-full px-3 py-2 transition ${billingView === 'quotes' ? 'bg-black text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]' : 'text-black/54 hover:text-black/74'}`}>Devis</button>
					</div>

					<div className="mb-4 flex h-11 items-center gap-3 rounded-[14px] border border-black/6 bg-white/80 px-4">
						<SearchIcon className="h-4 w-4 text-black/35" />
						<input value={billingQuery} onChange={(event) => setBillingQuery(event.target.value)} type="text" placeholder={billingView === 'invoices' ? 'Recherche une facture' : 'Recherche un devis'} className="w-full border-0 bg-transparent text-[0.9rem] text-[#1e1e1e] outline-none placeholder:text-black/34" />
					</div>

					<div className="space-y-2">
						{filteredBillingItems.length > 0 ? filteredBillingItems.map((item) => (
							<InvoiceItem
								key={`${billingView}-${item.id || item.number || item.title}`}
								document={item}
								kind={billingView === 'quotes' ? 'quote' : 'invoice'}
							/>
						)) : (
							<div className="rounded-[16px] border border-dashed border-black/10 bg-white/55 px-4 py-5 text-[0.92rem] text-black/42">
								Aucun {billingView === 'invoices' ? 'document de facturation' : 'devis'} ne correspond à cette recherche.
							</div>
						)}
					</div>
				</section>
			</Reveal>
		</>
	);
}

export function ClientReservationsAside({ reservationList, shouldShowAllReservationsButton, setIsReservationsModalOpen }) {
	return (
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
					<button type="button" onClick={() => setIsReservationsModalOpen(true)} className="mt-3 w-full text-center text-[0.96rem] font-semibold text-[var(--accent-mauve)] transition hover:opacity-70">
						Tous voir
					</button>
				) : null}
			</aside>
		</Reveal>
	);
}

export function ClientTabContent(props) {
	const { activeTab, profile, onProfileUpdated, contentVisible } = props;

	return (
		<div className={`grid gap-8 px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-11 ${activeTab === 'dashboard' ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
			<div key={activeTab} className={`min-w-0 transition-[opacity,transform] duration-220 ease-out ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-[6px] opacity-0'}`}>
				{activeTab === 'settings' ? (
					<SettingsPanel profile={profile} onProfileUpdated={onProfileUpdated} />
				) : activeTab === 'favorites' ? (
					<FavoritesPanel />
				) : activeTab === 'calendar' ? (
					<CalendarPage
						embedded
						role="client"
						reservations={props.reservations}
						onReservationsChange={props.onReservationsChange}
					/>
				) : activeTab === 'documents' ? (
					<DocumentsPage
						embedded
						initialProfile={profile}
						initialReservations={props.reservations}
						initialDocuments={props.documents}
					/>
				) : (
					<ClientDashboardPanel {...props} />
				)}
			</div>

			{activeTab === 'dashboard' ? (
				<ClientReservationsAside reservationList={props.reservationList} shouldShowAllReservationsButton={props.shouldShowAllReservationsButton} setIsReservationsModalOpen={props.setIsReservationsModalOpen} />
			) : null}
		</div>
	);
}
