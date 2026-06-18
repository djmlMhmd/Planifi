import prestatLogo from '../../../assets/prestat-logo.svg';
import {
	BookmarkIcon,
	CalendarIcon,
	CompassIcon,
	DashboardIcon,
	DevelopmentNoticeModal,
	DocumentIcon,
	HelpIcon,
	LogoutIcon,
	ModalPortal,
	ReservationItem,
	SettingsIcon,
	SidebarLink,
	UserAvatar,
} from '../ProfilePage.shared';

function ReviewStar({ index, reviewHoverRating, reviewRating, setReviewHoverRating, setReviewRating }) {
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

export function ClientProfileModals({
	isMobileSidebarOpen,
	setIsMobileSidebarOpen,
	profile,
	profileAvatarFallback,
	activeTab,
	handleSidebarNavigation,
	handleLogout,
	isDocumentsNoticeOpen,
	setIsDocumentsNoticeOpen,
	reviewModalProvider,
	reviewStep,
	closeReviewModal,
	handleReviewSubmit,
	reviewRating,
	reviewHoverRating,
	setReviewHoverRating,
	setReviewRating,
	reviewComment,
	setReviewComment,
	isReservationsModalOpen,
	setIsReservationsModalOpen,
	fullReservationList,
}) {
	return (
		<>
			{isMobileSidebarOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[95] bg-[rgba(10,10,14,0.42)] backdrop-blur-[3px]" onClick={() => setIsMobileSidebarOpen(false)}>
						<div className="ml-auto flex h-full w-[min(86vw,340px)] flex-col bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] px-5 pb-6 pt-5 text-white shadow-[-24px_0_50px_rgba(0,0,0,0.22)]" onClick={(event) => event.stopPropagation()}>
							<div className="flex items-center justify-between border-b border-white/10 pb-4">
								<img src={prestatLogo} alt="Prestat" className="w-[118px]" style={{ filter: 'brightness(0) invert(1)' }} />
								<button type="button" onClick={() => setIsMobileSidebarOpen(false)} className="rounded-full border border-white/12 px-3 py-1.5 text-[0.84rem] text-white/76">Fermer</button>
							</div>

							<div className="mt-5 flex items-center gap-3">
								<UserAvatar profile={profileAvatarFallback} />
								<div className="min-w-0">
									<p className="truncate text-[1rem] font-semibold text-white">{profile.firstName} {profile.lastName}</p>
									<p className="mt-1 text-[0.78rem] text-[#c7b2ec]">{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}</p>
								</div>
							</div>

							<nav className="mt-8 flex flex-1 flex-col justify-between">
								<div className="space-y-6">
									<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleSidebarNavigation}>Dashboard</SidebarLink>
									<SidebarLink href="/app/profil?tab=calendar" active={activeTab === 'calendar'} icon={CalendarIcon} onNavigate={handleSidebarNavigation}>Calendrier</SidebarLink>
									<SidebarLink href="/navigation" icon={CompassIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>Découvrir</SidebarLink>
									<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon} onNavigate={handleSidebarNavigation}>Favoris</SidebarLink>
									<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon} onNavigate={handleSidebarNavigation}>Paramètres</SidebarLink>
									<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => { setIsMobileSidebarOpen(false); setIsDocumentsNoticeOpen(true); }}>Documents</SidebarLink>
								</div>

								<div className="space-y-6 pb-1">
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
						</div>
					</div>
				</ModalPortal>
			) : null}

			<DevelopmentNoticeModal open={isDocumentsNoticeOpen} onClose={() => setIsDocumentsNoticeOpen(false)} />

			{reviewModalProvider ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[92] overflow-y-auto bg-[rgba(10,10,14,0.44)] backdrop-blur-[3px]" onClick={closeReviewModal}>
						<div className="flex min-h-full items-center justify-center px-4 py-6">
							<div className="w-full max-w-[520px] rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,241,235,0.98)_100%)] p-6 shadow-[0_28px_80px_rgba(17,19,30,0.2)]" onClick={(event) => event.stopPropagation()}>
								{reviewStep === 'success' ? (
									<div className="flex min-h-[360px] flex-col items-center justify-center text-center animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
										<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-mauve-soft)] text-[var(--accent-mauve)] shadow-[0_16px_32px_rgba(149,99,214,0.16)]">
											<svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden="true">
												<path d="M6.5 12.5L10.2 16.2L17.5 8.9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
										<h3 className="mt-6 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#171717]">Merci pour votre avis</h3>
										<p className="mt-3 max-w-[320px] text-[0.98rem] leading-7 text-black/58">Merci d&apos;avoir laissé un avis sur <span className="font-semibold text-[#171717]">{reviewModalProvider}</span>.</p>
									</div>
								) : (
									<form onSubmit={handleReviewSubmit} className="animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
										<div className="flex items-start justify-between gap-4">
											<div>
												<p className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-black/34">Votre avis</p>
												<h3 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#171717]">{reviewModalProvider}</h3>
												<p className="mt-2 text-[0.96rem] text-black/56">Partagez votre expérience en quelques mots.</p>
											</div>
											<button type="button" onClick={closeReviewModal} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/78 text-[1.5rem] leading-none text-black/38 transition hover:text-black/62" aria-label="Fermer la fenêtre d'avis">×</button>
										</div>

										<div className="mt-8 border-t border-black/8 pt-6">
											<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
												<div>
													<p className="text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-black/36">Note</p>
													<p className="mt-2 text-[0.9rem] text-black/48">{reviewRating ? `${reviewRating}/5 sélectionné${reviewRating > 1 ? 's' : ''}` : 'Sélectionnez une note'}</p>
												</div>
												<div className="flex items-center gap-1">
													{Array.from({ length: 5 }).map((_, index) => (
														<ReviewStar key={index + 1} index={index + 1} reviewHoverRating={reviewHoverRating} reviewRating={reviewRating} setReviewHoverRating={setReviewHoverRating} setReviewRating={setReviewRating} />
													))}
												</div>
											</div>
										</div>

										<div className="mt-6 border-t border-black/8 pt-6">
											<label htmlFor="review-comment" className="text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-black/36">Commentaire</label>
											<textarea id="review-comment" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Votre rendez-vous s’est-il bien passé ?" rows={5} className="mt-4 w-full resize-none border-0 border-b border-black/12 bg-transparent px-0 py-0 text-[1rem] leading-7 text-[#171717] outline-none transition placeholder:text-black/28 focus:border-[var(--accent-mauve)]" />
										</div>

										<div className="mt-8 flex flex-col gap-3 border-t border-black/8 pt-6 sm:flex-row sm:justify-end">
											<button type="button" onClick={closeReviewModal} className="rounded-full border border-black/8 px-5 py-3 text-[0.92rem] font-medium text-black/58 transition hover:bg-black/[0.03] hover:text-black/76">Annuler</button>
											<button type="submit" disabled={!reviewRating} className="rounded-full bg-[#101010] px-6 py-3 text-[0.92rem] font-semibold text-white shadow-[0_14px_28px_rgba(10,10,10,0.16)] transition hover:-translate-y-px hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-40">Publier mon avis</button>
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
					<div className="fixed inset-0 z-[90] overflow-y-auto bg-[rgba(10,10,14,0.5)] backdrop-blur-[2px]" onClick={() => setIsReservationsModalOpen(false)}>
						<div className="flex min-h-full items-center justify-center px-4 py-6">
							<div className="w-full max-w-[780px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)]" onClick={(event) => event.stopPropagation()}>
								<div className="mb-5 flex items-center justify-between gap-4">
									<div>
										<h2 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#171717]">Tous mes rendez-vous</h2>
										<p className="mt-1 text-[0.92rem] text-black/40">{fullReservationList.length} rendez-vous</p>
									</div>
									<button type="button" onClick={() => setIsReservationsModalOpen(false)} className="text-[1.8rem] leading-none text-black/32 transition hover:text-black/62" aria-label="Fermer la liste des rendez-vous">×</button>
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
		</>
	);
}
